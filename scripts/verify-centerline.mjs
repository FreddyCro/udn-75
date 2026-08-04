// 驗證抽出的中心線：與指令型別無關（不假設 motion 一定是純 C 或含 L）。
// 兩項斷言：
//   1. 涵蓋度——motion 的 y 起訖，對照可見線「所有」subpath（含被過濾掉的端蓋/轉角標記）
//      的 y 全域範圍，避免漏接一整段（見 extract-centerline.mjs 的直線 outline 處理）。
//   2. 貼合度——沿 motion 每 5px 取一個樣本點，量它到可見線 outline 的最短距離，
//      斷言最大值 < 3px（outline 描邊寬度幾 px，中心線應落在其內側）。
import fs from 'node:fs';

const SRC = 'app/components/02.forum/ForumCorePath.vue';
const src = fs.readFileSync(SRC, 'utf8');
const outlineDs = [...src.matchAll(/d="(M[^"]+)"/g)].map((m) => m[1]);

const splitSubpaths = (d) => d.split(/(?=M)/).filter((s) => s.trim());

function tokenize(sub) {
  const out = [];
  const re = /([MLCHVZ])([^MLCHVZ]*)/gi;
  let m;
  while ((m = re.exec(sub))) {
    const nums = (m[2].match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []).map(Number);
    out.push({ cmd: m[1].toUpperCase(), nums });
  }
  return out;
}

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

function bezierPoint(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const a = mt * mt * mt, b = 3 * mt * mt * t, c = 3 * mt * t * t, e = t * t * t;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + e * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + e * p3[1],
  ];
}

// 把一個 subpath（M/L/H/V/C，可能有 Z）攤平成密集折線（C 用 24 段逼近）。
function flattenSubpath(tokens) {
  const pts = [];
  let cur = [0, 0];
  for (const t of tokens) {
    if (t.cmd === 'Z') break;
    if (t.cmd === 'M' || t.cmd === 'L') {
      cur = [t.nums[0], t.nums[1]];
      pts.push(cur);
    } else if (t.cmd === 'H') {
      cur = [t.nums[0], cur[1]];
      pts.push(cur);
    } else if (t.cmd === 'V') {
      cur = [cur[0], t.nums[0]];
      pts.push(cur);
    } else if (t.cmd === 'C') {
      const p0 = cur;
      const p1 = [t.nums[0], t.nums[1]];
      const p2 = [t.nums[2], t.nums[3]];
      const p3 = [t.nums[4], t.nums[5]];
      for (let k = 1; k <= 24; k++) pts.push(bezierPoint(p0, p1, p2, p3, k / 24));
      cur = p3;
    }
  }
  return pts;
}

// 攤平整段可見線（所有 subpath）成一個密集點集，供「距離 outline」查詢用。
function flattenOutline(d) {
  const pts = [];
  for (const sub of splitSubpaths(d)) pts.push(...flattenSubpath(tokenize(sub)));
  return pts;
}

// 可見線的 y 全域範圍（含被 extract-centerline.mjs 過濾掉的端蓋/轉角標記 subpath）。
function outlineYRange(d) {
  const pts = flattenOutline(d);
  const ys = pts.map((p) => p[1]);
  return [Math.min(...ys), Math.max(...ys)];
}

// 點到折線（線段序列）最短距離。
function distToPolyline(pt, poly) {
  let min = Infinity;
  for (let i = 0; i + 1 < poly.length; i++) {
    const a = poly[i], b = poly[i + 1];
    const abx = b[0] - a[0], aby = b[1] - a[1];
    const len2 = abx * abx + aby * aby;
    let t = len2 > 0 ? ((pt[0] - a[0]) * abx + (pt[1] - a[1]) * aby) / len2 : 0;
    t = Math.max(0, Math.min(1, t));
    const px = a[0] + t * abx, py = a[1] + t * aby;
    const d = Math.hypot(pt[0] - px, pt[1] - py);
    if (d < min) min = d;
  }
  return min;
}

// 沿 motion 折線每 STEP px 取一個樣本點（依累積弧長線性內插，不是逐指令取點）。
const STEP = 5;
function sampleAlong(poly, step) {
  const samples = [poly[0]];
  let acc = 0;
  for (let i = 0; i + 1 < poly.length; i++) {
    const a = poly[i], b = poly[i + 1];
    let segLen = dist(a, b);
    let segPos = 0;
    while (acc + (segLen - segPos) >= step) {
      segPos += step - acc;
      acc = 0;
      const t = segLen > 0 ? segPos / segLen : 0;
      samples.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
    acc += segLen - segPos;
  }
  return samples;
}

const COVERAGE_TOLERANCE = 10; // px：容許端蓋標記造成的幾 px 落差，但擋得住漏接一整段（見 finding 1）
const FIT_TOLERANCE = 3; // px

let fail = 0;
for (const n of [1, 2]) {
  const motionD = fs.readFileSync(`temp/motion${n}.txt`, 'utf8').trim();
  const cmds = [...motionD.matchAll(/([MLC])([^MLC]*)/g)].map((m) => ({
    cmd: m[1],
    nums: (m[2].match(/-?\d*\.?\d+/g) || []).map(Number),
  }));

  if (cmds.filter((c) => c.cmd === 'M').length !== 1) {
    console.error(`motion${n}: ✗ 不是單一連續 path（有多個 M）`);
    fail++;
  }

  const motionPoly = flattenSubpath(tokenize(motionD));
  const motionYs = motionPoly.map((p) => p[1]);
  const [motionYMin, motionYMax] = [Math.min(...motionYs), Math.max(...motionYs)];

  // 1. 涵蓋度
  const [outlineYMin, outlineYMax] = outlineYRange(outlineDs[n - 1]);
  const covTop = Math.abs(motionYMin - outlineYMin);
  const covBottom = Math.abs(motionYMax - outlineYMax);
  const covOk = covTop < COVERAGE_TOLERANCE && covBottom < COVERAGE_TOLERANCE;
  console.log(
    `motion${n} 涵蓋度：motion y[${motionYMin.toFixed(1)},${motionYMax.toFixed(1)}] vs 可見線 y[${outlineYMin.toFixed(1)},${outlineYMax.toFixed(1)}]（差 ${covTop.toFixed(1)}px / ${covBottom.toFixed(1)}px） ${covOk ? '✓' : '✗ 超過 ' + COVERAGE_TOLERANCE + 'px 門檻'}`,
  );
  if (!covOk) fail++;

  // 2. 貼合度
  const outlinePoly = flattenOutline(outlineDs[n - 1]);
  const samples = sampleAlong(motionPoly, STEP);
  let maxFit = 0;
  for (const s of samples) maxFit = Math.max(maxFit, distToPolyline(s, outlinePoly));
  const fitOk = maxFit < FIT_TOLERANCE;
  console.log(
    `motion${n} 貼合度：${samples.length} 個取樣點，最大距離 outline ${maxFit.toFixed(2)}px ${fitOk ? '✓' : '✗ 超過 ' + FIT_TOLERANCE + 'px 門檻'}`,
  );
  if (!fitOk) fail++;
}
process.exit(fail ? 1 : 0);
