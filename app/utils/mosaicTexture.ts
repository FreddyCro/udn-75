import * as THREE from 'three';

/**
 * 隨機藍色矩陣拼貼貼圖。
 * 兩層構成：全域稀疏散點 + 數個高密度矩形 patch（拼貼塊），
 * 每列以隨機長度的橫向色帶填色，形成橫紋馬賽克感。
 */
export const makeMosaicTexture = (
  w: number,
  h: number,
  cellSize: number,
  palette: string[],
) => {
  const cols = Math.ceil(w / cellSize);
  const rows = Math.ceil(h / cellSize);
  const c = document.createElement('canvas');
  c.width = Math.max(cols * cellSize, cellSize);
  c.height = Math.max(rows * cellSize, cellSize);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, c.width, c.height);

  const fillRows = (
    x0: number,
    y0: number,
    cw: number,
    ch: number,
    density: number,
  ) => {
    for (let y = y0; y < y0 + ch && y < rows; y++) {
      let x = x0;
      while (x < x0 + cw && x < cols) {
        const run = 1 + Math.floor(Math.random() * 5);
        if (Math.random() < density) {
          ctx.fillStyle = palette[Math.floor(Math.random() * palette.length)]!;
          ctx.fillRect(x * cellSize, y * cellSize, run * cellSize, cellSize);
        }
        x += run;
      }
    }
  };

  fillRows(0, 0, cols, rows, 0.2);
  const patches = 8;
  for (let i = 0; i < patches; i++) {
    const pw = Math.floor(cols * (0.12 + Math.random() * 0.25));
    const ph = Math.floor(rows * (0.15 + Math.random() * 0.35));
    const px = Math.floor(Math.random() * (cols - pw));
    const py = Math.floor(Math.random() * (rows - ph));
    fillRows(px, py, pw, ph, 0.7);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};
