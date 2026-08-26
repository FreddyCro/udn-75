// 音效清單（單一來源）。
//
// 設計師會陸續補音效檔進來。新增一支的流程只有兩步：
//   ① 把檔案丟進 public/sounds/
//   ② 在 SOUND_MANIFEST 加一行 `key: '檔名.mp3'`
// 之後呼叫端就能寫 play('key')，型別會自動補完；打錯 key 編譯期就報錯。
//
// ⚠️ 這裡只放「檔名」不放完整路徑：實際部署可能掛在子路徑或 CDN 上，前綴要在 runtime
//    由 useAssetUrl() 補（見 useSfx.ts）。路徑寫死在這會在子路徑部署時 404。
//
// 清單與 public/sounds/ 的實際檔案由 test/sound-manifest.spec.ts 雙向對照 ——
// 檔名打錯、或丟了檔卻忘了登記，都會被測試擋下來。
export const SOUND_MANIFEST = {
  /** 2.11s。剩三個呼叫端：紙飛機變身（ForumCorePath）、小飛機進入橘色（Blessing）、
   *  議程箭頭換組（Agenda）—— 都是「一個段落級的事件」，撐得起 2 秒的音。
   *
   *  ⚠️ 這支在 2026-08-25 的 `efc4b81` 被換過內容 —— **檔名沒變、音檔換了**：
   *  0.27s／96 kbps／3.2 KB → 2.11s／196 kbps／51 KB（ffprobe 實測）。
   *  同名不同音在 code review 與 git diff 上都看不出來，這是那次事故沒被發現的原因；
   *  日後要換音效請**加新檔名**，不要覆蓋既有檔案。 */
  sfx01: 'udn75_sfx01_01.mp3',
  /** 0.27s：`efc4b81` 之前的 sfx01，自 0.7.0 還原（blob cf7edb70）。
   *
   *  **全站的互動音**：按鈕與連結的 hover／click（55 處）＋ orange core 的路徑撞擊
   *  （FORUM_TURN_SFX）。選它而不是 sfx01 的理由是長度 —— 這兩類都是密集、可連發的
   *  事件（滑過一排 icon、快速捲過連續轉折），而 play() 對同一支是 currentTime 歸零
   *  重播（見 useSfx）：2.11s 的音會被下一次觸發從頭打斷，糊成一團；0.27s 每一下都
   *  播得完。 */
  sfx01Short: 'udn75_sfx01_01_short.mp3',
  /** 2.8s：符號段粒子收攏（converge）。 */
  aiFaceBg: 'udn75_sfx_ai_face_bg.mp3',
  /** 2.3s：符號段的文字亂碼跳動與方塊遮罩轉場。 */
  aiFaceText: 'udn75_sfx_ai_face_text.mp3',
  /** 2.3s：永續祝福的階梯線逐格進場。 */
  benedictionLine: 'udn75_sfx_benediction_line.mp3',
  /** 3.3s：永續祝福的逐格笑臉開始畫。 */
  benedictionSmile: 'udn75_sfx_benediction_smile.mp3',
} as const;

export type SoundKey = keyof typeof SOUND_MANIFEST;

/** 音效檔在 public/ 底下的目錄（不含部署前綴）。 */
export const SOUND_DIR = '/sounds';

export const SOUND_KEYS = Object.keys(SOUND_MANIFEST) as SoundKey[];

/** key → 站台根目錄寫法的路徑。部署前綴由呼叫端用 useAssetUrl() 補。 */
export const soundPath = (key: SoundKey) => `${SOUND_DIR}/${SOUND_MANIFEST[key]}`;

/**
 * 防呆：擋掉沒過型別檢查的呼叫端（例如從 JSON 或 dataset 讀進來的字串）。
 *
 * 用 Object.hasOwn 而非 `in`：後者會走原型鏈，'toString' / 'constructor' 這類
 * Object.prototype 上的名字會被誤判成合法 key。
 */
export const isSoundKey = (key: string): key is SoundKey =>
  Object.hasOwn(SOUND_MANIFEST, key);
