// 一次性腳本：從 ForumCorePath.vue 貼上的 outline 填色 d 抽出中心線。
// 用法：node scripts/extract-centerline.mjs
import fs from 'node:fs';

const SRC = 'app/components/02.forum/ForumCorePath.vue';
const src = fs.readFileSync(SRC, 'utf8');
const ds = [...src.matchAll(/d="(M[^"]+)"/g)].map((m) => m[1]);

// 把 d 拆成 subpath（每個以 M 開頭）
const splitSubpaths = (d) => d.split(/(?=M)/).filter((s) => s.trim());

// 把 subpath 拆成 [指令字母, 數字...] 的序列
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

// 只取「曲線 outline」：含 C 指令且長度夠（短的是轉角節點標記）
const isCurveOutline = (sub) => /C/.test(sub) && sub.length > 120;

// 直線 outline（矩形／平行四邊形，用 H/V/L 畫的入口 stub 或斜線段）：沒有 C，
// 但 bbox 對角夠大 → 是可見線的一部分；對角只有 2–8px 的同款 subpath 是端蓋／
// 轉角標記，門檻抓在中間（20px）分開兩者。
const STRAIGHT_MIN_DIAG = 20;
const isStraightOutline = (sub, tokens) => !/C/.test(sub) && bboxDiag(tokens) > STRAIGHT_MIN_DIAG;

function bboxDiag(tokens) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let cur = [0, 0];
  for (const t of tokens) {
    if (t.cmd === 'Z') break;
    if (t.cmd === 'M' || t.cmd === 'L') cur = [t.nums[0], t.nums[1]];
    else if (t.cmd === 'H') cur = [t.nums[0], cur[1]];
    else if (t.cmd === 'V') cur = [cur[0], t.nums[0]];
    else if (t.cmd === 'C') cur = [t.nums[4], t.nums[5]];
    else continue;
    minX = Math.min(minX, cur[0]); maxX = Math.max(maxX, cur[0]);
    minY = Math.min(minY, cur[1]); maxY = Math.max(maxY, cur[1]);
  }
  return Math.hypot(maxX - minX, maxY - minY);
}

// 把直線 outline 拆成頂點序列（只有 M/L/H/V），丟掉收尾時補回起點的重複點。
function straightVertices(tokens) {
  const pts = [];
  let cur = [0, 0];
  for (const t of tokens) {
    if (t.cmd === 'Z') break;
    if (t.cmd === 'M' || t.cmd === 'L') cur = [t.nums[0], t.nums[1]];
    else if (t.cmd === 'H') cur = [t.nums[0], cur[1]];
    else if (t.cmd === 'V') cur = [cur[0], t.nums[0]];
    else continue;
    pts.push(cur);
  }
  if (pts.length > 1 && dist(pts[0], pts[pts.length - 1]) < 0.5) pts.pop();
  return pts;
}

// 中心線兩端＝outline 追蹤閉合形狀時，在描邊起點／終點各多插的「接縫」頂點——
// 這種頂點前後兩條邊都是「短邊」（描邊端蓋的碎邊）；「長邊」＝整圈邊裡最長的兩條
// （代表可見線兩側），其餘皆短邊。矩形（入口 stub）與平行四邊形（斜線段）同一套邏輯。
function straightCenterline(tokens) {
  const pts = straightVertices(tokens);
  const n = pts.length;
  if (n < 4) return null;
  const edgeLen = pts.map((p, i) => dist(p, pts[(i + 1) % n]));
  const longIdx = new Set(
    edgeLen
      .map((len, i) => ({ len, i }))
      .sort((a, b) => b.len - a.len)
      .slice(0, 2)
      .map((e) => e.i),
  );
  const seams = pts.filter((_, i) => !longIdx.has((i - 1 + n) % n) && !longIdx.has(i));
  if (seams.length !== 2) return null; // 退化狀況：不勉強湊，讓這段被丟棄
  return [
    { type: 'M', p: seams[0] },
    { type: 'L', p: seams[1] },
  ];
}

// 把 tokens 展開成「每個指令對應一個錨點」的序列：H/V 用前一點補齊缺的座標，
// C 只取曲線終點（控制點留在 tok.nums 裡，畫線時仍用原始資料）。
// 用來定位去程／回程的分界，本身不是最終畫線資料。
function toAnchorItems(tokens) {
  const items = [];
  let prev = null;
  for (const t of tokens) {
    if (t.cmd === 'Z') break;
    if (t.cmd === 'M' || t.cmd === 'L') {
      prev = [t.nums[0], t.nums[1]];
      items.push({ cmd: 'L', p: prev, tok: t });
    } else if (t.cmd === 'H') {
      prev = [t.nums[0], prev[1]];
      items.push({ cmd: 'L', p: prev, tok: { cmd: 'L', nums: prev } });
    } else if (t.cmd === 'V') {
      prev = [prev[0], t.nums[0]];
      items.push({ cmd: 'L', p: prev, tok: { cmd: 'L', nums: prev } });
    } else if (t.cmd === 'C') {
      prev = [t.nums[4], t.nums[5]];
      items.push({ cmd: 'C', p: prev, tok: t });
    }
  }
  if (items.length) items[0].cmd = 'M'; // 還原起點標記
  return items;
}

// 找「去程結束、回程開始」的轉折點（遠端點）在錨點序列裡的索引：
// 一般情況＝第一段連續 C 之後的第一個非 C 指令 —— 那是描邊端蓋的側移標記，
// 座標與下一個 subpath 的起點完全相同（相同的端點，只是兩邊各自的 outline 各記一次）。
// 退化情況（去程與回程之間沒有側移標記，例如 M L C×20 L Z，轉折點落在 C 串中間）
// ＝整串錨點的中點；outline 兩側曲線段數相等，中點即轉折點的近似值。
function findFarIdx(items) {
  let i = 0;
  while (i < items.length && items[i].cmd !== 'C') i++;
  const run1Start = i;
  while (i < items.length && items[i].cmd === 'C') i++;
  const run1End = i;
  let j = run1End;
  while (j < items.length && items[j].cmd !== 'C') j++;
  if (run1Start < run1End && j < items.length && run1End < j) return run1End;
  return Math.floor(items.length / 2);
}

// 去程 = 從起點到遠端點（含）。
// 起點（M）之後常接一個「近端側移」標記（同一個轉角的另一側，見遠端點註解），
// 與 M 距離約 1–2px，會在串接處多出一段假跳躍；有這個標記就丟棄，直接讓 M
// 接上第一段 C（誤差同樣落在「距中心線約 1px」的既有容許範圍內）。
function forwardHalf(tokens) {
  const items = toAnchorItems(tokens);
  const farIdx = findFarIdx(items);
  const hasLeadMarker = items.length > 1 && items[1].cmd !== 'C';
  const kept = hasLeadMarker ? [items[0], ...items.slice(2, farIdx + 1)] : items.slice(0, farIdx + 1);
  const pts = kept.map((it) => ({ type: it.cmd, p: it.tok.nums }));
  // 遠端若是側移標記（一般情況，不是曲線本身的終點），把它併進前一個 C 的終點座標，
  // 不要另存一個 L —— 否則曲線終點與標記點之間會再多一段 ~2px 的假跳躍
  // （兩者是同一個轉角的兩側，本來就該是同一點）。退化情況（遠端點本身就是
  // 一個 C 的終點，見 findFarIdx）沒有這個標記，不受影響。
  const last = pts[pts.length - 1];
  const prev = pts[pts.length - 2];
  if (last?.type === 'L' && prev?.type === 'C') {
    prev.p = [prev.p[0], prev.p[1], prev.p[2], prev.p[3], last.p[0], last.p[1]];
    pts.pop();
  }
  return pts;
}

const endPt = (seg) => {
  const last = seg[seg.length - 1];
  return last.type === 'C' ? [last.p[4], last.p[5]] : [last.p[0], last.p[1]];
};
const startPt = (seg) => [seg[0].p[0], seg[0].p[1]];

// 反轉一段（C 的控制點對調）
function reverse(seg) {
  const out = [];
  let cur = endPt(seg);
  out.push({ type: 'M', p: cur });
  for (let i = seg.length - 1; i >= 1; i--) {
    const s = seg[i];
    const prev = seg[i - 1];
    const prevEnd = prev.type === 'C' ? [prev.p[4], prev.p[5]] : [prev.p[0], prev.p[1]];
    if (s.type === 'C') {
      out.push({ type: 'C', p: [s.p[2], s.p[3], s.p[0], s.p[1], prevEnd[0], prevEnd[1]] });
    } else {
      out.push({ type: 'L', p: prevEnd });
    }
  }
  return out;
}

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// 找整條鏈唯一的頭尾端點：內部接縫的端點都能在「其他」段裡找到幾乎重合的另一半
// （見 forwardHalf 的說明——遠端點座標與下一段的起點完全相同），只有鏈的頭尾兩個端點
// 找不到鄰居，其「與最近其他端點的距離」會遠大於其他所有內部接縫。取這兩點裡 y 較小的
// 當全域起點——不能像先前只看單一段自己的 start/end y 值來判斷方向，因為單一段裡遠端點
// 的 y 有可能小於起點 y（曲線局部往上繞），會被誤判成該段自己就要反轉。
function findHead(segs) {
  const ends = segs.flatMap((s) => [
    { seg: s, isStart: true, p: startPt(s) },
    { seg: s, isStart: false, p: endPt(s) },
  ]);
  const withNearest = ends.map((e) => ({
    ...e,
    nearest: Math.min(...ends.filter((o) => o.seg !== e.seg).map((o) => dist(o.p, e.p))),
  }));
  withNearest.sort((a, b) => b.nearest - a.nearest);
  const [end1, end2] = withNearest; // 鏈的頭尾兩端（與其他端點距離最遠的兩個）
  return end1.p[1] <= end2.p[1] ? end1 : end2;
}

function chain(segs) {
  const pool = segs.slice();
  const headEnd = findHead(pool);
  let head = headEnd.seg;
  pool.splice(pool.indexOf(head), 1);
  if (!headEnd.isStart) head = reverse(head);
  const chained = [head];
  let tail = endPt(head);
  while (pool.length) {
    let best = null;
    for (const s of pool) {
      const ds = dist(tail, startPt(s));
      const de = dist(tail, endPt(s));
      const d = Math.min(ds, de);
      if (!best || d < best.d) best = { s, d, flip: de < ds };
    }
    const seg = best.flip ? reverse(best.s) : best.s;
    // seg[0]（M）與 tail 是同一個接縫點（見 forwardHalf 的遠端點註解），丟棄避免輸出重複點。
    chained.push(seg.slice(1));
    tail = endPt(seg);
    pool.splice(pool.indexOf(best.s), 1);
    if (best.d > 4) console.warn(`  ⚠ 接縫距離 ${best.d.toFixed(2)}px`);
  }
  return chained;
}

const fmt = (n) => Number(n.toFixed(2));
function toD(chained) {
  let d = '';
  chained.forEach((seg, i) => {
    seg.forEach((s, j) => {
      if (s.type === 'C') d += `C${s.p.map(fmt).join(' ')}`;
      else if (i === 0 && j === 0) d += `M${fmt(s.p[0])} ${fmt(s.p[1])}`;
      else d += `L${fmt(s.p[0])} ${fmt(s.p[1])}`;
    });
  });
  return d;
}

ds.forEach((d, i) => {
  const segs = [];
  for (const sub of splitSubpaths(d)) {
    const tokens = tokenize(sub);
    if (isCurveOutline(sub)) segs.push(forwardHalf(tokens));
    else if (isStraightOutline(sub, tokens)) {
      const line = straightCenterline(tokens);
      if (line) segs.push(line);
    }
  }
  const out = toD(chain(segs));
  console.log(`\n// motion${i + 1}（${segs.length} 段串接，長度 ${out.length}）`);
  console.log(`'${out}',`);
  fs.writeFileSync(`temp/motion${i + 1}.txt`, out);
});
