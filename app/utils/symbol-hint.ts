// SymbolFace 的「游標在人像上嗎」判定。
//
// 抽出來的理由有二：
//   1. 宮格彩蛋（哪一格 → 哪一句）與 PC 提示（碰到就永久收起）用的是同一套換算，
//      寫兩份遲早會分岔。
//   2. 這段是純數學，抽出來才測得到 —— 元件本身是 WebGL + rAF，沒有測試環境。

/** 判定「游標真的在互動」的影響強度門檻（SymbolFace 的 influence 是緩動後的 0..1）。 */
export const FACE_HOVER_INFLUENCE = 0.4;

/**
 * 游標的 world 座標 → 人像 bbox 內的正規化座標。
 *
 * 人像置中於原點，故 bbox 是 x ∈ [-halfW, halfW]、y ∈ [-halfH, halfH]。
 * 回傳 `u` 為左→右 0..1、`v` 為上→下 0..1（world 的 +y 在上，故 v 要翻轉）；
 * 落在框外（含右／下邊界）或人像尚未建立時回 `null`。
 */
export function faceUv(
  mx: number,
  my: number,
  halfW: number,
  halfH: number,
): { u: number; v: number } | null {
  if (halfW <= 0 || halfH <= 0) return null;
  const u = (mx + halfW) / (2 * halfW);
  const v = (halfH - my) / (2 * halfH);
  if (u < 0 || u >= 1 || v < 0 || v >= 1) return null;
  return { u, v };
}
