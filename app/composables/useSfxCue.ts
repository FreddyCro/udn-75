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

// settle 窗長度：掛載後這段時間內，watcher 只更新基準（prev）、不出聲。
//
// 為什麼需要：cue 的來源（捲動進度、逐格動畫的格號）在 setup 當下一律是 0／false ——
// ScrollTrigger 要到 onMounted → refresh 才寫入真值。所以 watcher 看到的第一個 prev
// 永遠是 false，「掛載之後被瞬移過去」也會被算成上升緣。
//
// 失敗路徑：從子頁點 header 的錨點回首頁，Nuxt 預設 scrollBehavior 會瞬移到該段，
// 途中每一個 cue 都在同一兩幀內翻正 → 三四支 2–3 秒的長音同時響、互相切斷。
//
// 500ms 的理由：要涵蓋「掛載 → ScrollTrigger refresh → scrollBehavior 瞬移 → 首幀
// 寫入進度」這一整串非同步鏈，同時要短到使用者不可能在這段時間內真的手動捲到
// 某個 cue 的門檻上（那樣才會被誤吃）。
const CUE_SETTLE_MS = 500;

export function useSfxCue() {
  const { play } = useSfx();

  /**
   * source 前進跨過門檻時播一次。
   *
   * 不用 `immediate`：掛載當下若已經是 true（例如減少動態時動畫直接停在完成格、
   * 或使用者從子頁切回來落在段落中間），那不是「剛剛跑過去」，不該出聲。
   *
   * settle 閘門擋的是**播放**、不是 watch —— watcher 照常運作，Vue 才會持續更新
   * prev，settle 窗結束時 prev 就已經是瞬移之後的真實值，不會補放一次。
   *
   * onBeforeUnmount 註冊在 cueOn 的同步呼叫路徑上（不是 onMounted 的 callback 裡）：
   * 確保呼叫當下一定有作用中的元件實例可掛，同時保證 timer 一定會被清掉，
   * 不會有「元件卸載後 callback 仍執行」的情形。
   */
  const cueOn = (source: () => boolean, key: SoundKey) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    onMounted(() => {
      timer = setTimeout(() => {
        settled = true;
        timer = null;
      }, CUE_SETTLE_MS);
    });

    onBeforeUnmount(() => {
      if (timer) clearTimeout(timer);
      timer = null;
    });

    watch(source, (next, prev) => {
      if (!settled) return;
      if (risingEdge(!!prev, next)) play(key);
    });
  };

  return { cueOn };
}
