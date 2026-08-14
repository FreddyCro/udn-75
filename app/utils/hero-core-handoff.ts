// 影片裡那顆 orange core → DOM orange core 的「交棒」幾何（純函式，無 Vue / DOM 依賴）。
//
// hero 退場段最後幾秒，影片畫面裡就有一顆 orange core；gone 那一刻要由 01.hero/OrangeCore
// 接手。兩顆要疊在同一點，就得把「影片畫面座標」換算成「螢幕座標」—— <video> 是
// object-fit: cover，畫面被等比放大並裁掉溢出的部分，不能直接拿元素矩形的比例算。

/** core 在影片畫面上的落點（正規化，與視窗尺寸無關） */
export interface HeroCoreAnchor {
  /** 中心 x：相對畫面寬的比例（0..1） */
  x: number;
  /** 中心 y：相對畫面高的比例（0..1） */
  y: number;
  /** 邊長：相對「畫面寬」的比例（0..1） */
  size: number;
}

/** getBoundingClientRect() 用得到的四個值 */
export interface ScreenBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface HeroCoreScreenPoint {
  /** core 中心的螢幕座標（px） */
  x: number;
  y: number;
  /** core 在螢幕上的邊長（px） */
  size: number;
}

/**
 * 把影片畫面上的 anchor 換算成螢幕座標。
 *
 * object-fit: cover ＝ 等比放大到「兩邊都不小於元素」，溢出的部分依 object-position 裁掉：
 *   scale  = max(元素寬 / 畫面寬, 元素高 / 畫面高)
 *   origin = 元素左上 + (元素尺寸 − 放大後尺寸) × objectPosition   ← 差值為負，即被裁掉的量
 *
 * frameW / frameH 傳 `<video>` 的 videoWidth / videoHeight；metadata 還沒到（皆為 0）時回 null。
 * objectPosition 對應 SCSS 的 object-position（0.5 / 0.5 ＝ center）—— 那邊改了這裡要一起改。
 */
export function coverAnchorToScreen(
  box: ScreenBox,
  frameW: number,
  frameH: number,
  anchor: HeroCoreAnchor,
  objectPosition: { x: number; y: number } = { x: 0.5, y: 0.5 },
): HeroCoreScreenPoint | null {
  if (frameW <= 0 || frameH <= 0 || box.width <= 0 || box.height <= 0) return null;

  const scale = Math.max(box.width / frameW, box.height / frameH);
  const shownW = frameW * scale;
  const shownH = frameH * scale;
  const originX = box.left + (box.width - shownW) * objectPosition.x;
  const originY = box.top + (box.height - shownH) * objectPosition.y;

  return {
    x: originX + anchor.x * shownW,
    y: originY + anchor.y * shownH,
    size: anchor.size * shownW,
  };
}

/**
 * 元素在垂直方向上還有沒有和視窗重疊（頁面只有垂直捲動、hero 又是滿版寬，故只看 y）。
 *
 * 用來判斷退場交棒的當下「影片還在不在畫面上」—— 不在就沒有可對齊的目標，
 * core 改從畫面上緣滑進來（見 Hero.vue 的 runCoreEntrance）。
 */
export function isVerticallyOnScreen(
  box: Pick<ScreenBox, 'top' | 'height'>,
  viewportH: number,
): boolean {
  return box.top < viewportH && box.top + box.height > 0;
}

/**
 * 把「螢幕座標的位移」換算成「已旋轉 deg 度的父層」底下的 local 位移。
 *
 * OrangeCorePath 會在 core 外層寫入路徑切線 rotation（hero 段的垂直線恆為 90°），
 * 子層的 translate 會跟著一起轉 —— 直接把螢幕位移餵給子層，水平位移會跑到垂直方向去。
 * 父層旋轉 θ 時「螢幕位移 = R(θ)·local」，故 local = R(−θ)·螢幕位移。
 */
export function unrotateDelta(
  dx: number,
  dy: number,
  deg: number,
): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return { x: dx * cos + dy * sin, y: -dx * sin + dy * cos };
}
