// 捲動／動畫驅動的單次觸發音效。
//
//   const { cueOn } = useSfxCue();
//   cueOn(() => props.progress > 0, 'aiFaceText');
//
// 語意：source 由 false 翻成 true 的那一次響一聲。**倒退靜音**（往回捲不響），
// 來回捲會再響一次 —— 規則與判定見 ~/utils/sfx-cue 的 risingEdge。
//
// 為什麼要有這一層、而不是各元件自己 watch：
//   ・七個掛載點分散在 hero／symbol／forum／blessing 四段，各寫各的 watch
//     很快就會出現「這裡倒退也響、那裡不響」的不一致，而那種差異在瀏覽器上
//     幾乎看不出來，只有耳朵聽得出來。
//   ・規則本身（risingEdge）是純函式、已有測試；這一層只負責接上反應式系統。
//
// ⚠️ 與 useSfx() 相同，必須在 **setup 期間**呼叫 —— 內部用 watch，
//    且 useSfx() 此刻要讀 runtimeConfig（見 useSfx.ts 檔頭）。

import { risingEdge } from '~/utils/sfx-cue';
import type { SoundKey } from '~/utils/sound-manifest';

export function useSfxCue() {
  const { play } = useSfx();

  /**
   * source 前進跨過門檻時播一次。
   *
   * 不用 `immediate`：掛載當下若已經是 true（例如減少動態時動畫直接停在完成格、
   * 或使用者從子頁切回來落在段落中間），那不是「剛剛跑過去」，不該出聲。
   */
  const cueOn = (source: () => boolean, key: SoundKey) => {
    watch(source, (next, prev) => {
      if (risingEdge(!!prev, next)) play(key);
    });
  };

  return { cueOn };
}
