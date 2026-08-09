// hero 影片（section 1 第一屏）的「設定台」。
//
// 純資料模組（無 Vue runtime），Nuxt auto-import；由 useHeroVideo / HeroVideo /
// DevHeroVideoControls 共用同一份。這裡集中兩件事：
//   1. 影片來源（mob / pad / pc 三段，RWD 預留）
//   2. 四階段（main / loop / outro / gone）在影片時間軸上的秒數
// 要換片或調時間點只改這裡，元件不必動。
//
// 目前只有一支剪輯（實測 40.02s，main / loop / outro 都在同一支裡），mob 版是同一支的
// 低碼率轉檔（40.03s）→ 段落秒數三個裝置共用；pad 版尚未提供，先沿用 pc。

import type { HeroCoreAnchor } from './hero-core-handoff';

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
//
// ⚠️ 檔案大小差兩個量級（pc 70MB / mob 2.8MB），這條表直接決定開場要等多久 —— 手機若指到
//    pc 那支，光是把影片拉到「可播放」就會把載入層卡在 99% 直到 HERO_VIDEO_READY_TIMEOUT。
//    SSR 期間 device 一律先當 pc（見 HeroVideo 的 hydration mismatch 註解），故 mob 裝置一定
//    會經歷「先掛 pc src → 掛載後換成 mob src」；HeroVideo 刻意把 preload 壓在 metadata、
//    等掛載後才升級成 auto，就是為了讓那段「掛錯來源」的期間不要真的去拉 70MB。
export const HERO_VIDEO_SRC: Record<HeroVideoDevice, string> = {
  pc: '/img/udn75_bg_video_opening_pc.mp4',
  pad: '/img/udn75_bg_video_opening_pc.mp4', // TODO: 換成 pad 版剪輯（目前沿用 pc，70MB）
  mob: '/img/udn75_bg_video_opening_mob.mp4',
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

// ── 退場交棒：影片裡那顆 orange core 的落點 ────────────────────────────
// gone 那一刻 DOM 的 OrangeCore 要「長在影片裡那顆 core 的位置上」再滑回自己的落點，
// 兩顆才不會錯開（見 01.hero/Hero.vue 的 runCoreEntrance 與 ~/utils/hero-core-handoff）。
//
// 座標是**影片畫面**的正規化比例，不是螢幕比例 —— object-fit: cover 會等比放大並裁掉溢出
// 部分，換算交給 coverAnchorToScreen，故換視窗尺寸 / 換斷點都不必重量。
//
// 怎麼量：DevHeroVideoControls 切到「3.退場」，把影片停在交棒的那一幀（＝ outro.end），
// 截圖量那顆橘塊的中心與邊長，各除以影片畫面尺寸（pc 版 1920×1080）：
//   x = 中心x ÷ 1920   y = 中心y ÷ 1080   size = 邊長 ÷ 1920
//
// 預設值＝畫面正中心、邊長換算後在 1280 寬視窗上剛好 26px（＝ orange-core-config 的
// CORE.dotSize）。影片剪輯本來就把 core 收在正中心的話，這組預設不必動，交棒位移為 0。
export const HERO_OUTRO_CORE_ANCHOR: Record<HeroVideoDevice, HeroCoreAnchor> = {
  pc: { x: 0.5, y: 0.5, size: 39 / 1920 },
  pad: { x: 0.5, y: 0.5, size: 39 / 1920 }, // TODO: 換成 pad 版剪輯後重量
  mob: { x: 0.5, y: 0.5, size: 39 / 1920 }, // TODO: 換成 mob 版剪輯後重量
};

// 交棒動畫：DOM core 從影片那顆的位置／尺寸滑回自己的位置／26px。
// 略短於影片層的淡出（0.8s，見 HeroVideo 的 .sec1__hero-video）—— 讓 core 先歸位、
// 影片再淡完；反過來會先看到影片消失、core 才開始動。
export const HERO_CORE_HANDOFF = {
  duration: 0.55,
  ease: 'power2.out',
} as const;

// 影片已經捲出視窗才進 gone（倒帶回 loop 之後不重新上鎖，再往下滑就會這樣 ——
// 見 .claude/memory/hero-body-lock-rules.md 的例外條款）：畫面上沒有可對齊的目標，
// 改讓 core 從畫面上緣滑到自己的落點。
// 走的距離約半個視窗高（交棒只有幾十 px），故比 HERO_CORE_HANDOFF 慢。
export const HERO_CORE_DROP_IN = {
  duration: 0.9,
  ease: 'power2.out',
} as const;

// ── 退場段的保險絲 ────────────────────────────────────────────────────
// outro 期間頁面是鎖住的（見 useHeroVideo 的 shouldLockScroll）—— 影片若卡住（緩衝、
// seek 失敗、分頁被切走）就永遠等不到 gone、整頁鎖死。進 outro 時起算「該段應有長度
// ＋ 這個寬限」，逾時直接進 gone。
export const HERO_OUTRO_STALL_GRACE_MS = 3000;

/** duration 還讀不到（outro.end 填 HERO_VIDEO_END）時，退場段的絕對上限（ms） */
export const HERO_OUTRO_MAX_MS = 15000;
