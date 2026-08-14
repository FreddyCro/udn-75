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
  sfx01: 'udn75_sfx01_01.mp3',
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
