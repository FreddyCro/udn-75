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

export type ForumEvent = {
  /** 「論壇一」 */
  no: string;
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
  /** 「09/09」 —— 中間的「/」是核心停靠點 */
  date: string;
  /** 「（三）」 */
  weekday: string;
  /** 地點，可多行 */
  venue: string[];
  time: string;
  /** 講者區塊標題（「講者介紹」） */
  speakerLabel?: string;
  speakers?: ForumSpeaker[];
};
