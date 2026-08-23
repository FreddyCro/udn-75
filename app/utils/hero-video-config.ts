// hero 影片（section 1 第一屏）的「設定台」。
//
// 純資料模組（無 Vue runtime），Nuxt auto-import；由 useHeroVideo / HeroVideo
// 共用同一份。這裡集中兩件事：
//   1. 影片來源（mob / pad / pc 三段，RWD 預留）
//   2. 三階段（main / outro / gone）在影片時間軸上的秒數
// 要換片或調時間點只改這裡，元件不必動。
//
// 三個裝置各有一支剪輯，main / outro 都在同一支裡，長度實測皆為 40.73s
// → 段落秒數三個裝置共用（下方 HERO_VIDEO_SEGMENTS_BY_DEVICE 不必覆寫）。
// 畫面尺寸不同：pc 1920×1080（橫）、pad 1024×1364（直）、mob 720×1280（直）。
// 實際會播到的只有 0–33 與 36–38.5 兩段（中間 3 秒與 38.5s 之後都不播，見下方段落表）。

import type { HeroCoreAnchor } from './hero-core-handoff';

export type HeroVideoDevice = 'mob' | 'pad' | 'pc';

/** 有影片的階段（對應 HeroState 前兩個；gone 已無影片，不占時間軸）
 *
 *  2026-08-22：`loop` 已移除。原本 30–33 是「等使用者下滑」的循環段，而新流程是
 *  **正片順播到退場**（見下方段落表），沒有等待階段可言。 */
export type HeroVideoPhase = 'main' | 'outro';

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

// poster 首幀：空字串 ＝ 不設 poster。
//
// 每支影片的第一幀（白底＋中央橘色 core，與 HeroStart 的畫面一致），由
// `node scripts/hero-assets.mjs --poster` 產生，WebP 只有 2–4 KB。
//
// ⚠️ 沒有 poster 時 `<video>` 在 canplay 之前**什麼都不畫**。正常情況下那段有 HeroLoader
//    蓋著看不出來，但一旦 HERO_VIDEO_READY_TIMEOUT／HERO_MAIN_STALL_FUSE_MS 燒斷
//    （慢速手機上會，見 architecture/LIU_FEEDBACK_5.md:10），載入層已經退場而影片還沒好，
//    使用者看到的就是一片白。poster 讓那條失敗路徑退成「靜止的 core」而不是空畫面，
//    而且與 start gate 的畫面連續。
//
// ⚠️ 尺寸與各自的來源影片同解析度（pc 1920×1080 / pad 1024×1364 / mob 720×1280），
//    換剪輯時要一起重跑腳本，否則 poster 會是上一版的畫面。
export const HERO_VIDEO_POSTER: Record<HeroVideoDevice, string> = {
  pc: '/img/udn75_bg_video_opening_pc_poster.webp',
  pad: '/img/udn75_bg_video_opening_pad_poster.webp',
  mob: '/img/udn75_bg_video_opening_mob_poster.webp',
};

/**
 * 段落的 `end` 填此值 ＝「一路播到影片結束」。
 * 實際收尾時間不寫死在設定裡，改由 `<video>.duration` / `@ended` 決定
 * （見 HeroVideo 的 onTimeUpdate / onEnded）—— 換剪輯時 outro 不必跟著改秒數。
 *
 * 目前 outro 有明確秒數（38.5s）故未使用；若之後想「不寫死、跟著剪輯長度走」再填回 outro.end。
 */
export const HERO_VIDEO_END = Number.POSITIVE_INFINITY;

// ── 段落秒數：要調時間點，改這裡 ────────────────────────────────────
//   main  main.start → main.end   正片，播一次 → **自動接退場**（順播）
//   outro outro.start → outro.end 退場段；到 end（或影片播完）→ 解鎖，等捲動溶解
//
// 2026-08-22（使用者裁決）：原本 main 只到 30、30–33 是「等使用者下滑」的 loop 循環段。
// 新流程沒有等待階段 —— 正片一路播到 33（loop 段當正片尾巴播一次，不再循環），
// 接著 seek 到 36 播退場，**整段都還鎖著**，退場播完才解鎖（見 ~/utils/hero-scroll-lock）。
// 於是設計師「不要因為捲太快而看不到 outro」這條需求第一次真正成立。
//
// ⚠️ main → outro 之間那 3 秒（33 → 36）**刻意不播**：這是剪輯要求（退場要從 36s 那一幀
//    開始），不是漏填 —— 別「順手」把它改成相接。seek 由 HeroVideo 的 watch(heroState) 做。
//
// 秒數：正片 0–33（含原 loop 段）、退場 36–38.5 → gone（影片其餘部分不播）。影片全長 40.02s。
export const HERO_VIDEO_SEGMENTS: HeroVideoSegments = {
  main: { start: 0, end: 33 },
  outro: { start: 36, end: 38.5 },
};

/** 退場鎖的保險絲寬限（ms）：鎖著的退場段若卡住不動，逾時就放行解鎖。
 *
 *  2026-08-16 曾把這類保險絲（`HERO_OUTRO_STALL_GRACE_MS` / `HERO_OUTRO_MAX_MS`）整組刪掉，
 *  理由是「outro 不鎖之後，影片卡住只是影片卡住，不會連帶鎖死頁面」。2026-08-22 退場
 *  重新上鎖，那個理由失效，故重新加一根 —— 但只有一根、只看牆上時間，不做進度偵測。
 *  逾時 ＝ 退場段長度 ＋ 本值。SKIP 的人不受影響（他們直接放棄那段保護，見 useHeroVideo）。 */
export const HERO_OUTRO_LOCK_GRACE_MS = 2500;

// pad / mob 剪輯段落不同時在此覆寫（未列的裝置沿用上方共用值）—— RWD 預留。
export const HERO_VIDEO_SEGMENTS_BY_DEVICE: Partial<
  Record<HeroVideoDevice, HeroVideoSegments>
> = {
  // pad: { main: { start: 0, end: 20 }, outro: { ... } },
};

/** 取某裝置的段落設定：有覆寫用覆寫，否則沿用共用值。 */
export function heroVideoSegments(device: HeroVideoDevice): HeroVideoSegments {
  return HERO_VIDEO_SEGMENTS_BY_DEVICE[device] ?? HERO_VIDEO_SEGMENTS;
}

/**
 * skip 按鈕淡入的時間點（影片時間軸秒數）。
 * 淡出不另設秒數 —— 一離開正片（main → outro）就淡出，故跟著 main.end 走。
 *
 * 設計稿 #BN skip 標的是 3 秒；2026-08-22 使用者裁決改為 **2 秒**（開場的強制觀看時間
 * 隨順播延長到 35.5 秒，逃生口該更早出現）。
 */
export const HERO_SKIP_APPEAR_AT = 2;

// 等待影片「可播放」的上限（ms）：逾時就放行 HeroLoader，
// 避免慢速網路／大檔案把載入層永遠卡在 99%。
export const HERO_VIDEO_READY_TIMEOUT = 8000;

/** 「鎖在正片卻沒有影片可看」的保險絲逾時（ms，見 HeroVideo 的 armStallFuse）。
 *
 *  ⚠️ **必須明顯大於 `HERO_VIDEO_READY_TIMEOUT`**：那支逾時的語意只是「載入層別再等了」，
 *  影片在那之後才開始播是慢速網路的**正常**結果。兩者取同值（且註冊得比它晚）的話，
 *  `markReady()` 會先跑、把這根絲清掉 ⇒ 它永遠不會觸發 —— 2026-08-22 code review 抓到的
 *  就是這個。這裡刻意留一大段餘裕：真的到 15 秒還不能播，解鎖遠比繼續鎖著好。 */
export const HERO_MAIN_STALL_FUSE_MS = 15000;

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

// 影片已經捲出視窗才進 gone（退場播完解鎖後、影片還在畫面上時捲很遠就會這樣 ——
// 見 .claude/memory/hero-body-lock-rules.md）：畫面上沒有可對齊的目標，
// 改讓 core 從畫面上緣滑到自己的落點。
// 走的距離約半個視窗高（交棒只有幾十 px），故比 HERO_CORE_HANDOFF 慢。
export const HERO_CORE_DROP_IN = {
  duration: 0.9,
  ease: 'power2.out',
} as const;

// ── 退場溶解吃掉的捲動距離（× 視窗高）────────────────────────────────
// 沿革：1.2 ＋ 固定 200px → 1（2026-08-21）→ 1.6（2026-08-22 上午，理由是「給退場影片
// 播放時間」）→ 1.2（2026-08-22 下午，實機看過覺得久）→ **0.6**（2026-08-23，同一個
// 抱怨的下一階：「退場到引言的 scroll 距離太長」）。到引言可讀位置的總行程
// ＝ vh($exit + $intro-at − HERO_INTRO_READ_AT) ＝ vh(0.85)，1080 視窗上 918px（原 1566px）。
//
// ⚠️ 這段距離**與影片播放進度無關**：順播改動之後退場段是在還鎖著的時候播完的
//    （見上方段落表與 ~/utils/hero-scroll-lock），解鎖那一刻由 Hero 的自動捲動用固定
//    1.1s 滑完它。所以這個值現在只管三件事：① 文件長度（到引言可讀位置 ＝ vh($exit + 0.25)）、
//    ② 桌機的空捲動（0.6 之後 $sticky-floor 在任何視窗高都不作用，見該處推導）、
//    ③ 手動捲動的手感與 scale 1 → 1.06 相對滾輪的變化速率。
// ⚠️ ③ 是 0.6 帶來的唯一副作用：OUTRO_HOLD_SCALE（0.06，見 ~/utils/hero-dissolve）攤在
//    一半的距離上，每格滾輪的縮放變化快一倍。實機看過覺得「被推」而不是「被按住」的話，
//    調的是那個值、不是這裡。同理 DISSOLVE_LEAVE（0.005 × vh(0.6) ≈ 3px）與
//    HERO_INTRO_AUTO_SCROLL.duration（1.1s 滑更短的距離會偏慢動作）——
//    三者都刻意保持原值，等實機確認後再動。
// ⚠️ 這個值必須與 SCSS 的 $exit 相同（定義在 01.hero/_hero-geometry.scss）—— 這邊算
//    ScrollTrigger 的 end，那邊算佔位高度與 .sec1__inner 的黏著保底。兩邊不一致，
//    溶解結束的位置就不會落在 $intro-at 上。SCSS 變數無法從 JS 讀取，這是本專案已知
//    且接受的雙寫（同 CORE.dotSize 與 OrangeCore.vue 的關係）。改一邊就要改另一邊。
// ⚠️ 再往上加之前先確認黏著範圍：桌機引言只撐出 488px ＋ runway，不夠的部分是靠
//    $sticky-floor 補的，而補出來的高度會變成轉場滿版後的額外捲動距離。
export const HERO_DISSOLVE_VH = 0.6;

// ── 退場播完 → 自動捲到引言的「可讀位置」──────────────────────────────
// 2026-08-22 使用者要求：退場段播完（解鎖那一刻）不要讓使用者自己滑那段退場行程，
// 直接把畫面帶到引言讀得到的地方。
//
// 落點寫成「引言上緣要落在畫面的幾成高」，而不是寫死一個 scrollY —— 引言上緣的文件位置
// 由 Hero 量測（＝ hero 佔位高），故這個值換視窗、換斷點、改 $exit 都不必跟著調。
//   0.85（＝ SCSS 的 $intro-at）是**硬切那一格**的構圖：只露兩三行，是設計核准的畫面，
//        但當成停下來閱讀的位置太擠。
//   0.60 是使用者截圖比對出來的閱讀位置：三段引言都在畫面內。
//
// ⚠️ 這個值**必須 ≤ $intro-at（0.85）**：落點 = 引言上緣文件位置 − vh(本值)，若大於
//    $intro-at，落點就會落在退場終點 vh(HERO_DISSOLVE_VH) 之前 ⇒ 溶解走不完、影片留在
//    畫面上。Hero 的 scrollToIntroReading() 另有一道 clamp 兜著，但別靠它。
export const HERO_INTRO_READ_AT = 0.6;

/** 自動捲動的時長與曲線。autoKill 交給 ScrollToPlugin —— 使用者一動就中止（見 Hero.vue）。 */
export const HERO_INTRO_AUTO_SCROLL = {
  duration: 1.1,
  ease: 'power2.inOut',
} as const;

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
