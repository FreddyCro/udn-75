// 用事件委派處理「掛不到 @click 的連結」，掛一次在 document 上。
//
// 三類：
//   1. common-components 產生的連結（<NmdShare> / <NmdFooter>）—— 元件在 node_modules 裡，
//      改不了它的 template，但它會輸出 data-ga 屬性可供比對。
//   2. <NmdFooter> 的三條站台連結（聯合報數位版／隱私政策／服務協議）——
//      **這三條連 data-ga 都沒有**（只有 class="footer__link"），只能比 href。
//   3. 內文連結：文案存在 locales/*.json 的 HTML 字串裡、由 v-html 渲染，
//      Vue 不會為它們建立 vnode，@click 無從掛起。改在 JSON 的 <a> 上寫 data-ga-term。
//
// 為什麼是 capture 階段：header 的分享鈕、子頁的作品列都自帶 @click（音效），而外連是
// target="_blank"／整頁跳轉 —— 冒泡階段有機會在導航開始後才跑到。capture 由上往下、
// 在任何元件 handler 之前，最不會被搶。
//
// 為什麼不用 pointerdown：那會把「按下但拖走／取消」也算成一次點擊。click 才是導航的語意。
import {
  gaClickButton,
  gaFooterLink,
  gaShare,
  gaSocialMedia,
} from '~/utils/tracking-event';

/**
 * common-components 的 data-ga → 本專案事件的對照。
 *
 * top / bottom 兩份都對到同一個事件：事件命名已定案走「主頁」那份表（拆分事件名 ＋
 * site 參數），不含 area 維度。若日後要分 header／footer，值本身已經帶了 -top / -bottom
 * 後綴，直接改這張表即可（自製的 AppHeaderShare 刻意沿用同一組命名）。
 */
const SHARE_MAP: Record<string, string> = {
  'share-facebook-top': 'facebook',
  'share-facebook-bottom': 'facebook',
  'share-line-top': 'line',
  'share-line-bottom': 'line',
  'share-twitter-top': 'twitter',
  'share-twitter-bottom': 'twitter',
};

const SOCIAL_MAP: Record<string, string> = {
  'udn-facebook': 'facebook',
  'udn-instagram': 'instagram',
  'udn-youtube': 'youtube',
  'udn-line': 'line',
};

/**
 * 站台頁尾三連結，以 href 特徵比對。
 *
 * ⚠️ 順序有意義，而且必須**先限定在 .nmd-footer__nav 之內**才比 ——
 *    'vip.udn.com' 這個特徵同時命中子頁內文的「聯合報數位版」外連（那筆是
 *    click_button / area=inline），不限定容器就會把兩者混為一談。
 */
const FOOTER_LINKS: Array<[needle: string, key: string]> = [
  ['udn_privacy', 'privacy'],
  ['members/service', 'service'],
  ['vip.udn.com', 'vip'],
];

export default defineNuxtPlugin(() => {
  const onClick = (e: MouseEvent) => {
    const link = (e.target as HTMLElement | null)?.closest?.('a');
    if (!link) return;

    // 1. 站台頁尾三連結（限定容器，見 FOOTER_LINKS 的警告）
    if (link.closest('.nmd-footer__nav')) {
      const href = link.getAttribute('href') ?? '';
      const hit = FOOTER_LINKS.find(([needle]) => href.includes(needle));
      if (hit) gaFooterLink(hit[1]);
      return;
    }

    // 2. common-components ／自製 header 分享鈕的 data-ga
    const ga = link.getAttribute('data-ga');
    if (ga) {
      if (SHARE_MAP[ga]) return gaShare(SHARE_MAP[ga]);
      if (SOCIAL_MAP[ga]) return gaSocialMedia(SOCIAL_MAP[ga]);
    }

    // 3. 內文（v-html）連結。只有這一類會寫 data-ga-term，故 area 固定 inline。
    const term = link.getAttribute('data-ga-term');
    if (term) gaClickButton('inline', term);
  };

  document.addEventListener('click', onClick, { capture: true });
});
