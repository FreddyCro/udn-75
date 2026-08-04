// 論壇段驅動線的幾何處理：把 FORUM_PATH 的中心線片段平移到 .forum-path 的座標系，
// 再串成單一連續 path 供 getPointAtLength 取樣。
//
// 純字串／數值運算，無 DOM、無 Vue import → 可直接用 vitest 測（test/forum-path-geometry.spec.ts）。
//
// 下游一律假設「座標 x,y 交替」，所以入口必須先過 normalizeD 把 V / H 展開成 L ——
// 那兩個指令只帶單一座標，會讓奇偶判斷整條錯位，而且**不會報錯**。
// Figma 匯出的 stroke path 很常見 V（例：temp/vector276-asset.svg 的 'M383.554 2V209.5C…'）。

const NUM = /-?\d*\.?\d+/g;
// 只切這五個指令：實際線稿用不到 S / Q / T / A（弧線）。真的遇到的話，
// 它們會被歸進前一個指令的 body 而算錯 —— 換線稿時先掃一遍指令字母。
const CMD = /([MLCVH])([^MLCVH]*)/g;

/** 把 V / H 展開成等效的 L（補上另一軸的目前座標），讓下游只需處理 M / L / C。 */
export function normalizeD(d: string): string {
  let x = 0;
  let y = 0;
  return d.replace(CMD, (_, cmd: string, body: string) => {
    const n = (body.match(NUM) ?? []).map(Number);
    if (cmd === 'V') {
      return n
        .map((v) => {
          y = v;
          return `L${x} ${y}`;
        })
        .join('');
    }
    if (cmd === 'H') {
      return n
        .map((v) => {
          x = v;
          return `L${x} ${y}`;
        })
        .join('');
    }
    // M / L / C：最後一組 (x, y) 就是新的目前點（C 的最後一組是曲線終點）。
    x = n[n.length - 2] ?? x;
    y = n[n.length - 1] ?? y;
    return cmd + n.join(' ');
  });
}

/** 把一段中心線 d 的所有座標平移 (tx, ty)。形狀尺寸不變 → 尾端精準落在錨點。 */
export function translateD(d: string, tx: number, ty: number): string {
  return d.replace(CMD, (_, cmd: string, body: string) => {
    const moved = (body.match(NUM) ?? [])
      .map(Number)
      .map((n, i) => (i % 2 === 0 ? n + tx : n + ty).toFixed(2));
    return cmd + moved.join(' ');
  });
}

/** 取一段 d 的第一個座標（＝該段起點）。前提：已 normalizeD。 */
export function firstPoint(d: string): [number, number] {
  const n = (d.match(NUM) ?? []).map(Number);
  return [n[0]!, n[1]!];
}

/** 取一段 d 的最後一個座標（＝該段終點）。前提：已 normalizeD。 */
export function lastPoint(d: string): [number, number] {
  const n = (d.match(NUM) ?? []).map(Number);
  return [n[n.length - 2]!, n[n.length - 1]!];
}

// 串成單一連續 path：後段的 M 換成從前段末端拉過去的 L（連接段），
// 長度隨兩個錨點的實際距離動態變化。必須只留一個 M —— 多個 M 會讓
// getPointAtLength 在段落之間跳點，接縫就會頓一下。
// 只有一段時原樣回傳、不加連接段（pad 的單一連續線稿走這條）。
export function joinSegments(ds: string[]): string {
  return ds.reduce((acc, d) => {
    if (!acc) return d;
    const [x, y] = firstPoint(d);
    const rest = d.replace(/^M[^LC]*/, '');
    return `${acc}L${x.toFixed(2)} ${y.toFixed(2)}${rest}`;
  }, '');
}
