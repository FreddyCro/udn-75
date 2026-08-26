// 論壇場次（section2.json 的 forum.events[]）。bio / photo 為空即不渲染該區塊。
//
// ForumBp 從 utils 借過來，不在這裡另立一份 'pc' | 'pad' | 'mob' ——
// 斷點名稱在專案裡只該有一個真值（見 ~/utils/forum-path-events）。
import type { ForumBp } from '~/utils/forum-path-events';

export type ForumSpeaker = {
  role: string;
  /** 姓名。論壇一在稿上是 outline 過的 vector，故可帶素材（見 ForumTextArt） */
  name: ForumLine;
  /** 中文全名（Dr. Mario García 有中譯名，台積電講者無） */
  nameZh?: ForumLine;
  /** 照片編號（'01' 起跳，全段唯一）：photo 未填時顯示帶此編號的 placeholder 方塊 */
  photoNo: string;
  /** UPic 路徑，不含副檔名與裝置後綴；空＝顯示 placeholder */
  photo?: string;
  /** 講者介紹段落；空陣列＝不渲染 */
  bio?: string[];
};

/** 一個斷點的稿字形素材 */
export type ForumTextArtSrc = {
  /** SVG 路徑（public 下，如 /img/forum/forum1-title-pc.svg） */
  src: string;
  /** 素材在 Figma 的原生寬高。w 用來算 em 寬，兩者一起讓瀏覽器預留空間 */
  w: number;
  h: number;
};

/**
 * 稿上 outline 過的展示型文字：畫面吃 SVG 素材，真文字留在 DOM 給 SR / SEO。
 * 機制（行盒為什麼要保留、寬度為什麼掛在 span 上）見
 * architecture/2026-08-12-forum1-text-art-design.md
 */
/**
 * 一個展示型文字的逐斷點素材（不含真文字）。
 * 日期大字用它 —— 那組的真文字是從 year / date / weekday 組出來的，不另存一份
 * （見 ForumEvent.dateArt）。
 */
export type ForumArtByBp = Partial<Record<ForumBp, ForumTextArtSrc>>;

export type ForumTextArt = {
  /** 真文字。素材斷點下轉為 visually-hidden，其餘斷點就是畫面上的字 */
  text: string;
  /**
   * 逐斷點的素材。
   *
   * ⚠️ **逐斷點各一份，不是等比縮放** —— 三個斷點的稿是不同的 SVG。
   *    早期版本只做了一份 pc 素材、靠 font-size 等比縮放，pad／mob 會偏約 2.7%
   *    （Noto 在 pc 74px 的渲染寬 728.98 比稿寬 709.285 寬 2.8%，逐斷點字級是
   *    照那個渲染寬反推的，故 pad 稿寬並不等於 pc 稿寬 × 54/74）。
   *
   * 沒填的斷點**退回活文字**（Noto Sans TC），與改動前完全相同。
   */
  art: ForumArtByBp;
};

/**
 * 一行文字：字串＝活文字，物件＝SVG 素材（由 <UArtLine> 渲染）。
 *
 * ⚠️ 放寬**跟著批次走** —— 只有真的接上 <UArtLine> 的欄位才改成這個型別。
 *    提前放寬會讓 `{{ line }}` 在型別上合法、runtime 印出 [object Object]。
 *    目前已放寬：title、subtitle（論壇一第一批）。
 *    quoteEn、venue 留到第二批（英文引言／日期地點）。
 */
export type ForumLine = string | ForumTextArt;

/**
 * 日期／地點／引言那一落的設計稿版式：
 * quote＝日期靠左＋右側英文引言（論壇一）；stair＝三行階梯式日期、地點在右上（論壇二）；
 * right＝日期與地點整組切齊右緣（論壇三）；
 * youth＝論壇四，是前兩者的混合 —— 日期兩行（第二行往右錯開）＋時間＋地點整組切齊右緣，
 *        講者卡則與 stair 完全相同（故 SCSS 以選擇器共用，不重寫一份）。
 */
export type ForumLayout = 'quote' | 'stair' | 'right' | 'youth';

export type ForumEvent = {
  /** 「論壇一」 */
  no: string;
  layout: ForumLayout;
  /** 「大師談媒體」 */
  tag: string;
  /** 主標上方的品牌行（論壇二「台積電」、論壇四「台積電文教基金會」） */
  brand?: ForumLine;
  /** 主標，可多行。論壇一是 ForumTextArt（稿字形素材），其餘場次是字串 */
  title: ForumLine[];
  /** 主標下的副標，可多行。同 title */
  subtitle?: ForumLine[];
  /** 右側英文引言，可多行（論壇一） */
  quoteEn?: ForumLine[];
  /** 段落內文 */
  body?: string;
  /** CTA 按鈕文字（論壇二／四） */
  cta?: string;
  /** CTA 的 DOM id（GTM 點擊事件用），與 cta 成對出現 */
  ctaId?: string;
  /** CTA 的 GA term（click_button / area=signup）：forum2_signup ／ forum4_signup */
  ctaGaTerm?: string;
  /**
   * 報名尚未開放時的「佔位隱藏」：按鈕照樣渲染、照樣佔位，只是看不見也點不到
   * （visibility: hidden）。
   *
   * ⚠️ 不能改用 v-if 拿掉按鈕 —— .forum-event__cta 是 ForumCorePath 的量測錨點
   *    （utils/forum-node-path 的 W12／R3／S3），節點消失那條橘核心設計線就會偏掉；
   *    且按鈕上還掛著論壇二品牌行讓出的 margin-bottom，抽掉會讓 CTA 以下整組上移。
   */
  ctaHidden?: boolean;
  /** 本場次的 GA term（section_view 的 symposium_{gaTerm}、click_news 共用同一組 slug） */
  gaTerm: string;
  year: string;
  /** 「09/09」 —— 中間的「/」平常照畫 */
  date: string;
  /**
   * 日期大字的稿字形素材，**逐「行」一筆**，行的構成 ＝ 現行 grid 的列：
   *   2 筆（論壇一三四）→ 「2026」／「09/09 三」
   *   3 筆（論壇二的階梯）→ 「2026」／「09」／「15 三」
   *
   * 真文字不存在這裡，是從 year / date / weekday 組出來的（見 ForumEvent.vue 的
   * dateLines）—— 文案只有一份，校稿只改那三個欄位。
   *
   * ⚠️ 星期的圓框**烤在素材裡**（稿是一個畫出來的圓，不是 border-radius），
   *    論壇二那一撇則**不在**素材裡（它是功能，由橘核心逐段畫出，見 slash）。
   * ⚠️ 畫布模式逐場不同，不能互抄：論壇一三四是「整組共用畫布」（列與列的水平錯位
   *    烤進畫布），論壇二是「各列貼齊自己的墨跡」（錯位留給 --stair-x1／--stair-x2）。
   *    理由與實測值見 architecture/2026-08-12-forum1-text-art-design.md。
   */
  dateArt: ForumArtByBp[];
  /**
   * 日期中間那一撇怎麼處理：
   *   省略      → 依版式預設（stair 不畫、其餘畫實體 `/`）
   *   true      → 畫實體 `/`（論壇四是 stair 卻有斜線，故明寫）
   *   'core'    → **不畫字元**，改由橘核心經過時逐段補上（論壇二）
   *
   * 設計稿把論壇二 09 與 15 之間的對角空隙留給核心 ——
   * 那不是字型的 `/`（稿上 206.1 高、是 --date-size 的兩倍），是一筆橫跨兩階的直線。
   * 完整脈絡見 architecture/forum-node-path.md 的「那一撇」。
   */
  slash?: boolean | 'core';
  /** 星期單字（「三」），渲染時外面套設計稿的圓框 */
  weekday: string;
  /**
   * 地點，可多行。
   *
   * ⚠️ 稿的地點**逐斷點的斷行與文案都不同**（實測：論壇一 pad 併成一行、論壇三 mob 拆成
   *    三行、論壇四 mob 拆兩行且兩行不同字級；論壇二三的場地名 pc 與 pad／mob 互不相同）。
   *    這個欄位只有一份文字（＝ SEO 的唯一來源），故素材只給「斷行與文案都對得上」的斷點，
   *    其餘維持活文字。要逐斷點各有文案就得把這個欄位本身改成逐斷點 —— 尚未做。
   */
  venue: ForumLine[];
  /** 時間（論壇三為空字串＝不渲染）。在 __venue 之內，故沿用它的 --art-base */
  time: ForumLine;
  /** 講者區塊標題（「講者介紹」） */
  speakerLabel?: string;
  speakers?: ForumSpeaker[];
};
