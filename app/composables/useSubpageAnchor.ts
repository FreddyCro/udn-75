// 子頁錨點列（SubpageAnchor 右側 rail / SubpageAnchorBar 底部列）的共享狀態。
//
// 錨點元件改由 layouts/subpage.vue 渲染 **一次**。原本是 Subpage.vue 自己渲染，但手機版的
// 連續閱讀頁（pages/subpage.vue）把六篇串成同一份文件 —— 維持原本的做法就會出現六份底部
// 錨點列疊在一起。
//
// 而 mode 是由頁面（獨立子頁／連續閱讀頁）決定、錨點元件消費的，兩邊不在同一棵子樹，
// 故用 useState 接（同 useAnchorClaim 的分工）。
//
// ⚠ 這裡**沒有顯隱旗子**：pc rail 與 <1280 底部列都是全程顯示（一進入子頁就在），
//   由 layouts/subpage.vue 直接傳 visible。原本有一面 visible 由舞台 pin 的
//   onLeave／onEnterBack 寫入（「舞台演完才滑入」），改成全程顯示後恆真而移除。
//
// ⚠ useState **跨 client-side 導航存活**（同 useAnchorClaim 的警告）：離開子頁 layout 時
//   必須清回初值，否則 mode／activeSlug 會帶著上一頁的值進到下一頁（例如從連續閱讀頁
//   回首頁再進獨立子頁，六項會全部不亮）。清理寫在 layouts/subpage.vue 的 onBeforeUnmount。
import { SUBPAGE_ANCHOR_ATTR } from '~/utils/subpage-stream';

export type SubpageAnchorMode = 'route' | 'scroll';

export function useSubpageAnchor() {
  /**
   * 'route'  獨立子頁（/news…/health）：active 看 route.path，點擊＝換頁。
   * 'scroll' 連續閱讀頁（/subpage）：active 看 scroll-spy，點擊＝頁內捲動。
   */
  const mode = useState<SubpageAnchorMode>('subpage-anchor-mode', () => 'route');

  /** scroll 模式下 spy 判出的 active 錨點 slug（'' ＝ 六項都不亮） */
  const activeSlug = useState('subpage-anchor-active', () => '');

  /** 離開子頁 layout 時呼叫（見檔頭的 useState 存活警告） */
  const resetSubpageAnchor = () => {
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
    const top = slugTop(slug);
    if (top === null) return;
    window.scrollTo({ top, behavior: 'auto' });
  };

  /**
   * 某一篇在文件裡的縱座標（null ＝ 找不到／SSR）。
   * 與 jumpToSlug 分開匯出，是為了讓呼叫端能「先比對再決定要不要動捲軸」——
   * 連續閱讀頁的落點會被多方推擠，需要每幀確認（見 pages/subpage.vue 的 holdLanding）。
   */
  const slugTop = (slug: string): number | null => {
    if (!import.meta.client) return null;
    const el = document.querySelector<HTMLElement>(
      `[${SUBPAGE_ANCHOR_ATTR}="${slug}"]`,
    );
    return el ? el.offsetTop : null;
  };

  return { mode, activeSlug, resetSubpageAnchor, jumpToSlug, slugTop };
}
