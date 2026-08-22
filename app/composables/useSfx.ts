// 互動音效（SFX）播放 API —— 其他事件要出聲，只需要碰這支。
//
//   const { play, stop, stopAll } = useSfx();
//   play('sfx01');   // 重複呼叫會重頭播（見下方「重複觸發」）
//
// 與 useAppSound 的關係：**共用同一顆開關**。soundOn 為 false 時 play() 直接 no-op，
// 使用者只需要理解「一個音效開關」（hero 的 start 閘門 / header 那顆按鈕）。
//
// 音效清單見 utils/sound-manifest.ts；生命週期（預載、解鎖、卸載）由 AppSfx.vue 統一持有。

import {
  SOUND_KEYS,
  isSoundKey,
  soundPath,
  type SoundKey,
} from '~/utils/sound-manifest';
import { sfxStopList } from '~/utils/sfx-cue';

// ── audio pool ────────────────────────────────────────────────────────
// 一支音效一個 Audio 物件，存在 module scope 而非 useState：
//   ・Audio 不可序列化，塞進 useState 會讓 SSR payload 爆掉。
//   ・只在 client 建立（見 ensure 的 import.meta.client 守衛），SSR 期間這個 Map
//     恆為空，故不會有 module scope 在 server 跨 request 共享的污染問題。
const pool = new Map<SoundKey, HTMLAudioElement>();

function ensure(key: SoundKey, toUrl: (path: string) => string) {
  if (!import.meta.client) return null;

  let audio = pool.get(key);
  if (!audio) {
    audio = new Audio(toUrl(soundPath(key)));
    // 短音效要「呼叫下去就出聲」，故整支先抓下來，不只抓 metadata。
    audio.preload = 'auto';
    pool.set(key, audio);
  }
  return audio;
}

export function useSfx() {
  const { soundOn } = useAppSound();
  // useAssetUrl() 內部讀 runtimeConfig，需要 Nuxt context。在 useSfx() 被呼叫的當下
  // （setup 期間）就取好，之後 play() 從任意 event handler 呼叫都不再依賴 context。
  const assetUrl = useAssetUrl();

  /**
   * 播放一支音效。soundOn 關閉時不出聲。
   *
   * 重複觸發：前一次還沒播完就再呼叫 → currentTime 歸零重頭播（不疊音）。
   * 連點按鈕、滑過一排 icon 都是這個行為。
   *
   * 長音互斥：2–3 秒的動畫音彼此不疊（規則見 ~/utils/sfx-cue 的 LONG_SFX_KEYS）。
   * 短音 sfx01 不受影響 —— 按鈕聲要能疊在動畫音之上。
   */
  const play = (key: SoundKey) => {
    if (!soundOn.value || !isSoundKey(key)) return;

    const audio = ensure(key, assetUrl);
    if (!audio) return;

    // 先停再播：停的是「其他長音」，不含自己（見 sfxStopList）。
    sfxStopList(key).forEach(stop);

    audio.currentTime = 0;
    // 瀏覽器擋自動播放時會 reject（NotAllowedError）—— 那是預期內的情況，
    // 不該讓未處理的 rejection 冒到呼叫端（多半是動畫 callback）去。
    void audio.play().catch(() => {});
  };

  const stop = (key: SoundKey) => {
    const audio = pool.get(key);
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  };

  const stopAll = () => SOUND_KEYS.forEach(stop);

  // ── 以下三支給 AppSfx.vue 用，一般呼叫端不需要 ──────────────────────

  /** 預先建立並下載所有音效，讓第一次 play() 不必等下載。 */
  const prime = () => SOUND_KEYS.forEach((key) => ensure(key, assetUrl));

  /**
   * 借使用者手勢解鎖音訊。
   *
   * iOS / Safari 只允許在使用者手勢中「啟動」音訊；之後由捲動、動畫結束等非手勢時機
   * 呼叫 play() 一律被擋。soundOn 被打開的那一次點擊就是手勢，借它把每支音效靜音地
   * 播一下再停 —— 該 Audio 物件從此就被視為已解鎖。
   */
  const unlock = () => {
    for (const audio of pool.values()) {
      audio.muted = true;
      void audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
        })
        .catch(() => {})
        .finally(() => {
          audio.muted = false;
        });
    }
  };

  /** 卸載：停掉全部並釋放 pool，讓 Audio 物件可被回收。 */
  const release = () => {
    stopAll();
    pool.forEach((audio) => audio.removeAttribute('src'));
    pool.clear();
  };

  return { play, stop, stopAll, prime, unlock, release };
}
