// 論壇場次（section2.json 的 forum.events[]）。bio / photo 為空即不渲染該區塊。
export type ForumSpeaker = {
  role: string;
  name: string;
  /** 中文全名（Dr. Mario García 有中譯名，台積電講者無） */
  nameZh?: string;
  /** 照片編號（'01' 起跳，全段唯一）：photo 未填時顯示帶此編號的 placeholder 方塊 */
  photoNo: string;
  /** UPic 路徑，不含副檔名與裝置後綴；空＝顯示 placeholder */
  photo?: string;
  /** 講者介紹段落；空陣列＝不渲染 */
  bio?: string[];
};

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
  /** 主標上方的品牌行（僅論壇二的「台積電」有） */
  brand?: string;
  /** 主標，可多行 */
  title: string[];
  /** 主標下的副標，可多行 */
  subtitle?: string[];
  /** 右側英文引言，可多行 */
  quoteEn?: string[];
  /** 段落內文 */
  body?: string;
  /** CTA 按鈕文字（僅論壇二有） */
  cta?: string;
  year: string;
  /** 「09/09」 —— 中間的「/」平常照畫 */
  date: string;
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
  /** 地點，可多行 */
  venue: string[];
  time: string;
  /** 講者區塊標題（「講者介紹」） */
  speakerLabel?: string;
  speakers?: ForumSpeaker[];
};
