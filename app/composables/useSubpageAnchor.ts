// 子頁錨點列（SubpageAnchor 右側 rail / SubpageAnchorBar 底部列）的共享狀態。
//
// 錨點元件改由 layouts/subpage.vue 渲染 **一次**。原本是 Subpage.vue 自己渲染，但手機版的
// 連續閱讀頁（pages/subpage.vue）把六篇串成同一份文件 —— 維持原本的做法就會出現六份底部
// 錨點列疊在一起。
//
// 而「舞台演完才滑入」這個顯隱條件是 Subpage.vue 的舞台進度線算出來的，它與 layout 不在
// 同一棵子樹，故用 useState 接（同 useAnchorClaim 的分工）。
//
// ⚠ useState **跨 client-side 導航存活**（同 useAnchorClaim 的警告）：離開子頁 layout 時
//   必須清回初值，否則回首頁再進另一篇時，錨點列會在 hero 那一屏就已經掛在畫面上。
//   清理寫在 layouts/subpage.vue 的 onBeforeUnmount。
import { SUBPAGE_ANCHOR_ATTR } from '~/utils/subpage-stream';

export type SubpageAnchorMode = 'route' | 'scroll';

export function useSubpageAnchor() {
  /** 錨點列是否已滑入（舞台演完才 true；見 Subpage.vue 的 drivesAnchor） */
  const visible = useState('subpage-anchor-visible', () => false);

  /**
   * 'route'  獨立子頁（/news…/health）：active 看 route.path，點擊＝換頁。
   * 'scroll' 連續閱讀頁（/subpage）：active 看 scroll-spy，點擊＝頁內捲動。
   */
  const mode = useState<SubpageAnchorMode>('subpage-anchor-mode', () => 'route');

  /** scroll 模式下 spy 判出的 active 錨點 slug（'' ＝ 六項都不亮） */
  const activeSlug = useState('subpage-anchor-active', () => '');

  /** 離開子頁 layout 時呼叫（見檔頭的 useState 存活警告） */
  const resetSubpageAnchor = () => {
    visible.value = false;
    mode.value = 'route';
    activeSlug.value = '';
  };

  /**
   * scroll 模式下跳到某一篇（錨點列點擊用）。
   *
   * ⚠️ 用**瞬跳**而非 smooth：連續閱讀頁六篇合計數萬 px，平滑捲動要嘛久到不能用、要嘛
   *    快到頭暈；而且獨立子頁的錨點列本來就是換頁（＝瞬間到位），瞬跳與既有體感一致。
   * ⚠️ 跳完不動 pin：Subpage 的舞台 onUpdate 有 `jumped` 判定（位移 > 一屏即視為跳捲，
   *    直接 set 各塊狀態不播過場），跨舞台的長距離跳躍靠它收尾，這裡不必額外處理。
   * ⚠️ 位置取 offsetTop 而非 scrollIntoView：段落頂端就是該篇 hero 的頂端，而 hero 自帶
   *    padding-top，對齊視窗頂即為設計稿的首屏構圖 —— 不需要再扣 header 高度。
   */
  const jumpToSlug = (slug: string) => {
    if (!import.meta.client) return;
    const el = document.querySelector<HTMLElement>(
      `[${SUBPAGE_ANCHOR_ATTR}="${slug}"]`,
    );
    if (!el) return;
    window.scrollTo({ top: el.offsetTop, behavior: 'auto' });
  };

  return { visible, mode, activeSlug, resetSubpageAnchor, jumpToSlug };
}
