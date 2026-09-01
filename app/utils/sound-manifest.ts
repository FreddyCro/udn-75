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
  /** 2.11s：**窄長條站定**的那一聲 —— media 拍 1 結束的橘色長條
   *  （useMediaIntroMotion，寬 28px，站在空白畫面中央），門檻見
   *  ~/utils/sfx-cue 的 MEDIA_BEAT_SFX。
   *
   *  ⚠️ 同一個視覺母題原本還有第二次出現：hero → symbol 轉場的黑色長條
   *  （HeroSymbolTransition，寬 ＝ CORE.dotSize 26px，門檻 SYMBOL_TRANSITION.barSfxAt）。
   *  設計師 2026-08-31 指定拿掉那一聲，門檻旋鈕也一併移除；hero 轉場現在只剩起手音
   *  aiFaceBg。要復原見 orange-core-config 末尾那則 git 取回註記。
   *
   *  另一個呼叫端不屬於那個母題，是設計師 2026-08-31 另外指定的：media 標題組字的
   *  最後一件 —— 引號之間的「新」淡入（MEDIA_BEAT_SFX 的拍 ③）。
   *
   *  歷史（同一天內來回過，別被舊註解誤導）：2026-08-28 先依設計師指定把它原本三個
   *  時機全數退掉（「小飛機進入橘色」→ aiFaceBg、「orange core 變身紙飛機」與
   *  「議程箭頭換組」→ sfx01Short），一度沒有任何呼叫端；同日再以上面那兩個新時機
   *  重新啟用，並加入 LONG_SFX_KEYS 互斥組。
   *
   *  ⚠️ 設計師 2026-08-28 交來的 `udn75_sfx_newmedia_text_open.aac` 與本檔
   *     **是同一段音**（解成 PCM 後逐樣本相關 1.0、同為 101,376 個 48kHz 取樣）。
   *     那支 aac 只是同音不同格式，確認後已刪、未登記進本清單 —— 記在這裡是為了
   *     日後再收到同名檔時不必重驗一次。
   *
   *  ⚠️ 這支在 2026-08-25 的 `efc4b81` 被換過內容 —— **檔名沒變、音檔換了**：
   *  0.27s／96 kbps／3.2 KB → 2.11s／196 kbps／51 KB（ffprobe 實測）。
   *  同名不同音在 code review 與 git diff 上都看不出來，這是那次事故沒被發現的原因；
   *  日後要換音效請**加新檔名**，不要覆蓋既有檔案。 */
  sfx01: 'udn75_sfx01_01.mp3',
  /** 0.27s：`efc4b81` 之前的 sfx01，自 0.7.0 還原（blob cf7edb70）。
   *
   *  **全站唯一還在用的短音**：按鈕與連結的 hover／click（55 處）＋ orange core 的
   *  路徑撞擊（FORUM_TURN_SFX）＋ orange core 變身紙飛機那一下＋議程箭頭換組
   *  （後兩者 2026-08-28 由 sfx01 改來，設計師指定）。
   *  變身與撞擊同支、時機緊鄰，聽感是連兩下而不是被切半截；議程箭頭則本來就會連發
   *  （activeSlot 逐格追趕、刻意不節流），0.27s 正是它需要的長度。
   *  選它而不是 sfx01 的理由是長度 —— 這幾類都是密集、可連發的
   *  事件（滑過一排 icon、快速捲過連續轉折），而 play() 對同一支是 currentTime 歸零
   *  重播（見 useSfx）：2.11s 的音會被下一次觸發從頭打斷，糊成一團；0.27s 每一下都
   *  播得完。 */
  sfx01Short: 'udn75_sfx01_01_short.mp3',
  /** 2.8s：hero → symbol 的方塊遮罩轉場起手音（HeroSymbolTransition，p>0）、
   *  符號段粒子集合成人臉（SymbolScene，112vh／33.53%；2026-08-31 由 converge 搬來）、
   *  小飛機進入橘色（Blessing）、
   *  橘色遮罩轉場到新媒體（Blessing）—— 四處由設計師指定共用同一支。
   *
   *  轉場起手音那一處是 2026-08-31 由 aiFaceText 改過來的（設計師指定）：那支的檔名
   *  是 `..._ai_face_text`，卻同時掛著「文字亂碼」與「方塊遮罩轉場」兩種語意，
   *  換完之後兩件事各自有音。同日設計師又把 p≥0.32 那一聲（sfx01）拿掉，
   *  所以這支在 hero 轉場不再被切斷、2.8s 會整支播完。 */
  aiFaceBg: 'udn75_sfx_ai_face_bg.mp3',
  /** 2.3s：符號段的文字亂碼跳動（SymbolIntro 起跑、SymbolFace 點／滑到某張臉）。
   *  ⚠️ 2026-08-31 之前也掛在 hero 的方塊遮罩轉場起手音上，該處已改用 aiFaceBg。 */
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
