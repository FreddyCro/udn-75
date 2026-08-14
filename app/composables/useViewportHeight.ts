// 「一個視窗高」的單一來源 —— JS 側。CSS 側是 vhLength()（見 ~/utils/viewport-height）。
// 值由 plugins/viewport-height.client.ts 量測寫入，兩邊讀的是同一個數字。
//
// 用法：把原本的 `window.innerHeight * SOME_VH` 換成 `vhPx(SOME_VH)`。
//
// ⚠️ **不是每個 innerHeight 都該換。** 判準：
//   ・「這條尺有多長」「幾何錨在哪」→ 換（網址列收合不該改變它）
//   ・「使用者此刻看得到什麼」→ 不換（AppHeader 的捲動進度、影片是否在畫面上…）
//   完整分類見改版當時的站點清冊。
export function useViewportHeight() {
  const vh = useState<number>('viewport-height', () => 0);

  /**
   * n 個視窗高的 px 值。`vhPx(1.2)` ＝ 原本的 `window.innerHeight * 1.2`。
   * 省略 n ＝ 一個視窗高。
   */
  const vhPx = (n = 1): number => {
    // 理論上 plugin 早於任何元件的 onMounted 就寫好了。真的沒有時退回
    // innerHeight —— 回 0 會讓 ScrollTrigger 的 end 變成零長度捲動尺
    // （GSAP 會夾成 start + 0.01），核心一進場就跳到路徑末端，比值不準嚴重得多。
    const base = vh.value || (import.meta.client ? window.innerHeight : 0);
    return base * n;
  };

  return { vh, vhPx };
}
