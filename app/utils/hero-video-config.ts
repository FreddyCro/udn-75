// hero 影片（section 1 第一屏）的「設定台」。
//
// 純資料模組（無 Vue runtime），Nuxt auto-import；由 useHeroVideo / HeroVideo /
// DevHeroVideoControls 共用同一份。這裡集中兩件事：
//   1. 影片來源（mob / pad / pc 三段，RWD 預留）
//   2. 四階段（main / loop / outro / gone）在影片時間軸上的秒數
// 要換片或調時間點只改這裡，元件不必動。
//
// 目前只有 pc 版一支剪輯（實測 40.02s，main / loop / outro 都在同一支裡），
// pad / mob 尚未提供 → 先指向同一支、段落秒數共用。

export type HeroVideoDevice = 'mob' | 'pad' | 'pc';

/** 有影片的階段（對應 HeroState 前三個；gone 已無影片，不占時間軸） */
export type HeroVideoPhase = 'main' | 'loop' | 'outro';

/** 單一階段在影片時間軸上的區間（秒）：[start, end) */
export interface HeroVideoSegment {
  start: number;
  end: number;
}

export type HeroVideoSegments = Record<HeroVideoPhase, HeroVideoSegment>;

// ── 影片來源（RWD 預留）─────────────────────────────────────────────
// 路徑相對 public/；實際載入時會補上 runtimeConfig.public.APP_ASSETS_PATH 前綴（同 UVid / UPic）。
// 裝置判定沿用 ~/utils/get-device 的 getDeviceTypeByResolution（單一來源，與 UVid 一致）。
export const HERO_VIDEO_SRC: Record<HeroVideoDevice, string> = {
  pc: '/img/udn75_bg_video_opening_pc.mp4',
  pad: '/img/udn75_bg_video_opening_pc.mp4', // TODO: 換成 pad 版剪輯
  mob: '/img/udn75_bg_video_opening_pc.mp4', // TODO: 換成 mob 版剪輯
};

// poster 首幀（RWD 預留）：空字串 ＝ 不設 poster。
export const HERO_VIDEO_POSTER: Record<HeroVideoDevice, string> = {
  pc: '',
  pad: '',
  mob: '',
};

/**
 * 段落的 `end` 填此值 ＝「一路播到影片結束」。
 * 實際收尾時間不寫死在設定裡，改由 `<video>.duration` / `@ended` 決定
 * （見 HeroVideo 的 onTimeUpdate / onEnded）—— 換剪輯時 outro 不必跟著改秒數。
 *
 * 目前 outro 有明確秒數（40s）故未使用；若之後想「不寫死、跟著剪輯長度走」再填回 outro.end。
 */
export const HERO_VIDEO_END = Number.POSITIVE_INFINITY;

// ── 四階段秒數：要調時間點，改這裡 ──────────────────────────────────
//   main  main.start → main.end   主要內容，播一次 → 自動進 loop
//   loop  loop.start → loop.end   等待使用者下滑；到 end 自動跳回 start 循環
//   outro outro.start → outro.end 退場段；到 end（或影片播完）→ gone（影片淡出、露出白底）
//
// 段落請「相接」（前段 end ＝ 後段 start）：自動推進時 currentTime 已落在新段內，
// 不會多做一次 seek（跳動）。影片全長實測 40.02s。
//
// 秒數依 #首頁影片(ENG) 提供的時間點：正片 0–30、loop 30–33、退場 33 → 影片結束（40s）。
export const HERO_VIDEO_SEGMENTS: HeroVideoSegments = {
  main: { start: 0, end: 30 },
  loop: { start: 30, end: 33 },
  outro: { start: 36, end: 38.5 },
};

// pad / mob 剪輯段落不同時在此覆寫（未列的裝置沿用上方共用值）—— RWD 預留。
export const HERO_VIDEO_SEGMENTS_BY_DEVICE: Partial<
  Record<HeroVideoDevice, HeroVideoSegments>
> = {
  // pad: { main: { start: 0, end: 20 }, loop: { ... }, outro: { ... } },
};

/** 取某裝置的段落設定：有覆寫用覆寫，否則沿用共用值。 */
export function heroVideoSegments(device: HeroVideoDevice): HeroVideoSegments {
  return HERO_VIDEO_SEGMENTS_BY_DEVICE[device] ?? HERO_VIDEO_SEGMENTS;
}

/**
 * skip 按鈕淡入的時間點（影片時間軸秒數，設計稿 #BN skip：正片播放 3 秒後原地淡入）。
 * 淡出不另設秒數 —— 一離開正片（main → loop）就淡出，故跟著 main.end 走。
 */
export const HERO_SKIP_APPEAR_AT = 3;

// 等待影片「可播放」的上限（ms）：逾時就放行 HeroLoader，
// 避免慢速網路／大檔案把載入層永遠卡在 99%。
export const HERO_VIDEO_READY_TIMEOUT = 8000;
