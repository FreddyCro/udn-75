// hero 影片（section 1 第一屏）的「設定台」。
//
// 純資料模組（無 Vue runtime），Nuxt auto-import；由 useHeroVideo / HeroVideo
// 共用同一份。這裡集中兩件事：
//   1. 影片來源（mob / pad / pc 三段，RWD 預留）
//   2. 四階段（main / loop / outro / gone）在影片時間軸上的秒數
// 要換片或調時間點只改這裡，元件不必動。
//
// 三個裝置各有一支剪輯，main / loop / outro 都在同一支裡，長度實測皆為 40.73s
// → 段落秒數三個裝置共用（下方 HERO_VIDEO_SEGMENTS_BY_DEVICE 不必覆寫）。
// 畫面尺寸不同：pc 1920×1080（橫）、pad 1024×1364（直）、mob 720×1280（直）。
// 實際會播到的只有 0–33 與 36–38.5 兩段（中間 3 秒與 38.5s 之後都不播，見下方段落表）。

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
// ⚠️ 這條表直接決定開場要等多久（pc 9.8MB / pad 7.0MB / mob 4.3MB）—— 手機若指到 pc 那支，
//    光是把影片拉到「可播放」就可能把載入層卡在 99% 直到 HERO_VIDEO_READY_TIMEOUT。
//    SSR 期間 device 一律先當 pc（見 HeroVideo 的 hydration mismatch 註解），故 pad / mob 裝置
//    一定會經歷「先掛 pc src → 掛載後換成該裝置的 src」；HeroVideo 刻意把 preload 壓在
//    metadata、等掛載後才升級成 auto，就是為了讓那段「掛錯來源」的期間不要真的去拉 pc 那支。
export const HERO_VIDEO_SRC: Record<HeroVideoDevice, string> = {
  pc: '/img/udn75_bg_video_opening_pc.mp4',
  pad: '/img/udn75_bg_video_opening_pad.mp4',
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
 * 目前 outro 有明確秒數（38.5s）故未使用；若之後想「不寫死、跟著剪輯長度走」再填回 outro.end。
 */
export const HERO_VIDEO_END = Number.POSITIVE_INFINITY;

// ── 四階段秒數：要調時間點，改這裡 ──────────────────────────────────
//   main  main.start → main.end   主要內容，播一次 → 自動進 loop
//   loop  loop.start → loop.end   等待使用者下滑；到 end 自動跳回 start 循環
//   outro outro.start → outro.end 退場段；到 end（或影片播完）→ gone（影片淡出、露出白底）
//
// 段落預設「相接」（前段 end ＝ 後段 start）：自動推進時 currentTime 已落在新段內，
// 不會多做一次 seek（跳動）。影片全長實測 40.02s。
//
// ⚠️ loop → outro 是**刻意的例外**：loop.end 33 → outro.start 36，中間那 3 秒不播，
//    觸發退場時由 HeroVideo 的 watch(heroState) seek 過去。這是剪輯要求（退場要從 36s
//    那一幀開始），不是漏填 —— 別「順手」把它改成相接。其餘段落改動時仍請維持相接。
//
// 秒數：正片 0–30、loop 30–33（循環）、退場 36–38.5 → gone（影片其餘部分不播）。
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
// 怎麼量：直接從影片檔抽出 outro.end 那一幀，例如
//   ffmpeg -ss 38.5 -i public/img/udn75_bg_video_opening_pc.mp4 -frames:v 1 outro-end.png
// 量那顆橘塊的中心與邊長，各除以**該支**影片的畫面尺寸
// （pc 1920×1080、pad 1024×1364、mob 720×1280）：
//   x = 中心x ÷ 畫面寬   y = 中心y ÷ 畫面高   size = 邊長 ÷ 畫面寬
//
// 預設值＝畫面正中心、邊長換算後在 1280 寬視窗上剛好 26px（＝ orange-core-config 的
// CORE.dotSize）。影片剪輯本來就把 core 收在正中心的話，這組預設不必動，交棒位移為 0。
export const HERO_OUTRO_CORE_ANCHOR: Record<HeroVideoDevice, HeroCoreAnchor> = {
  pc: { x: 0.5, y: 0.5, size: 39 / 1920 },
  // pad / mob 是各自獨立的直式剪輯（非 pc 的轉檔），core 的落點與邊長理論上與 pc 不同，
  // 但 size 的分母是各自的畫面寬 → 若剪輯都把 core 收在正中心、且橘塊佔畫面寬的比例相同，
  // 這組預設就會是對的。TODO: 抽出 38.5s 那一幀確認（見上方「怎麼量」）。
  pad: { x: 0.5, y: 0.5, size: 39 / 1920 },
  mob: { x: 0.5, y: 0.5, size: 39 / 1920 },
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

// ── 退場溶解吃掉的捲動距離（× 視窗高）────────────────────────────────
// 拿掉捲動鎖之後，**唯一還給退場影片時間的就是這段距離**：使用者捲得多快，
// 退場就被截斷得多厲害（已裁決的「捲動優先」，見設計文件第三節的對照表）。
// 2026-08-21 改為 1（＝ 使用者要的「滑完 100vh 就收掉」），前一版是 1.2 ＋ 固定 200px。
//
// ⚠️ 這個值必須與 HeroVideo.vue 的 SCSS 變數 $exit 相同 —— 前者算 ScrollTrigger
//    的 end，後者算佔位高度。兩邊不一致，溶解結束的位置就不會落在 $intro-at 上。
//    SCSS 變數無法從 JS 讀取，這是本專案已知且接受的雙寫（同 CORE.dotSize 與
//    OrangeCore.vue 的關係）。改一邊就要改另一邊。
export const HERO_DISSOLVE_VH = 1;

// B 階段：引言的原地淡入（＋ orange core 同時從畫面中心出現）。
//
// 兩階段的分工（見 architecture/2026-08-21-hero-two-phase-exit-design.md）：
//   A  0 → vh(HERO_DISSOLVE_VH)   影片黏在畫面上播退場，走完**硬切**消失
//   B  影片消失的那一刻起，時間驅動   引言在原地淡入，core 同時淡入
//
// ⚠️ **時間驅動而非捲動驅動**（2026-08-21 使用者裁決「270 拿掉」）：B 階段不吃任何額外
//    捲動距離，故引言不必 sticky 停留，`.sec1__intro` 的版面完全不動 —— 也因此
//    transitionST / OrangeCorePath 的 endEl / 後面三章的落點都不受影響。
//    「原地」由 A 階段的幾何保證：影片消失那一刻引言已經停在 $intro-at 上。
//    代價是使用者若在淡入期間繼續捲，引言會邊淡邊移動（0.5s 內的位移，可接受）。
export const HERO_INTRO_REVEAL = {
  duration: 0.5,
  ease: 'power2.out',
} as const;
