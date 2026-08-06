<!--
  ============================================================================
  HeartMetaballPatch — 三紋路固定 patch 漂移重疊（Section 4 現役底紋 / Canvas 2D）
  ============================================================================

  【與 HeartMetaball 的差異】（本檔為 Section 4 現役；HeartMetaball 為前一版，
   保留在 demo page 供對照，勿混用）
  同樣以「蓋章式 metaball 場 + 逐格隨機閾值」收邊，差別在**場內畫什麼**：

    面向        HeartMetaball（前一版）         HeartMetaballPatch（本檔）
    ─────────  ──────────────────────────────  ──────────────────────────────
    版面結構    中心圓角方形 + 外圍兩區         3 個矩形紋理 patch 拼貼
    紋理來源    變寬棋盤(1,2,3,6 帶) / 線段紋   1格棋盤 / 2格棋盤 / 線段紋
    紋理分佈    accentBlock 區塊逐塊換 variant  每 patch 一種紋理、固定不換
    構圖變化    區塊 variant 慢速換抽           patch 大幅漂移、可互換位置
    重疊交織    無（同一格只屬一區）            有（透空格讓位下層 → 雙紋交織）
    顆粒        cellSize 14px                   cellSize 4px（貼合設計稿）
    橘色配置    中心 base 色、外圍藍            圓形核心內慢速換抽變橘
    外緣收邊    場遮罩 + 中心區超橢圓羽化       場遮罩 + 每 patch 超橢圓羽化

  換言之：前一版是「一個團塊、內部分區換紋理」，本檔是「多塊紋理拼貼、彼此重疊
  交織」，更貼近設計稿「隨機組合效果（部分重疊＆不重疊、邊緣造型隨機）」。
  收邊／彗星尾／互動模式（pc 追游標、pad/mob 自走）兩版一致。

  【組成】
  1. patch 陣容固定（ROSTER）：每個 patch 固定尺寸、固定疊放順序（後者在上）；
     位置＝繞焦點「公轉」——各自的軌道半徑 orb（12~15 格）、角速度 fq（彼此
     不可公度）、起始相位差 120°，另加次諧波抖動讓軌跡不是正圓。
     → 相對位置持續變化、會互相穿越交換左右前後（需求：範圍大、明顯），
       但中心距離上限 = 兩軌道半徑和（≈32 格）遠小於 patch 半寬總和（≈62 格）
       → 三塊在任何時刻都保證相交、聯集不會破碎（需求：避免分太開）。
     公轉有界，故叢集名目半徑（→ 遮罩半徑、roamArea 內縮量）可一次算死。
     patch 本體以「超橢圓正規化半徑」羽化（同正式版中心區）：中心 keep=1、
     邊緣經 smoothstep 降到 0 + 抖動 hash 讓位 → 圓角方形、四邊溶解，
     不見方形直角。紋理錨定畫布絕對格座標，patch 移動時圖案不滑動。
  2. 逐格上色：由上往下找第一個「覆蓋該格且紋理實格」的 patch（透空格讓位下層
     → 重疊區兩紋理自然交織）；未被任何 patch 接手的格子不畫。
  3. 中心變橘（雙層慢速換抽・中心密集邊緣稀疏）：橘色是「以焦點為中心的機率
     場」，密度 p = orangeMax × (1-rn)^orangeGamma 連續衰減（rn=1 即
     orangeCells×CELL px 處歸零），沒有「內圈全滿」的平台區 → 中心密、邊緣疏。
     機率場再由兩層獨立的慢速換抽落成實際色塊：
       區塊層  accentBlock 格見方為單位、「區塊 × epoch」穩定 hash（switchPeriod、
               相位逐塊錯開）→ 橘色成小團塊、此起彼落地變橘/變回
       格層    逐格 dropout（orangeHole，另一個較慢的 epoch）→ 團塊內再挖空，
               不會出現實心橘色大面積
     另加逐區塊半徑抖動 ±15% → 橘色範圍邊界不是完美同心圓。兩層都綁 epoch，
     同 epoch 內每幀同值 → 不閃爍。
  4. 收邊（參考正式版・圓弧）：metaball 場（游標/漂移沿路蓋章 + 逐格隨機閾值）
     作為總遮罩，且持久球半徑「小於」叢集名目半徑 → 場的圓形等值線切進 patch
     外緣，矩形直邊只保留在內部、外緣被收成圓弧＋隨機閾值毛糙。持久球常駐，
     確保 patch 群永不被遮罩吃光（需求 2：不消失）。
     逐格閾值 = 穩定 hash × 慢速 epoch（edgePeriod，相位逐格錯開）：同 epoch 內
     每幀同值不閃爍，每隔約 edgePeriod 秒逐格錯落重抽 → 完全靜止時
     邊緣也會微微呼吸，不會定格。
  5. 跟游標（平滑）＋彗星尾（LIU_FEEDBACK_3 #2-2「像舊版一點」）：
     - 平滑跟隨：pointer 只記錄目標點，焦點每幀對它做 lerp（follow，已做
       frame-rate 正規化）→ 團塊是「跟」上來、不是瞬間貼齊；游標停下時緩緩收斂。
       章沿「緩動後的路徑」蓋 → 尾巴永遠在團塊身後。
     - 彗星尾：patch 群「以外」但落在拖尾章場內的格子，改用「依區塊抽一種紋理」
       補畫（三種紋理同家族、紋理一樣錨定絕對格座標）→ 身後留下馬賽克碎片，
       隨舊章壽命衰減而變稀、消失。三道防線確保「頭」不被尾巴填糊：
         a. 尾巴用的場**不含持久球** → 頭部圓形不會整片被點亮
         b. 門檻乘 TAIL_TH（>1）→ 尾巴比本體稀疏、只在剛蓋章的路徑附近
         c. gate：以持久球半徑為界 smoothstep 淡入 → 頭部圓形內完全不長尾巴，
            patch 拼貼構圖保持乾淨

  【Props】
    bgColor        畫布底色
    maxBalls       同時存活的 metaball 上限
    life           單顆 ball 壽命（秒）— 越長彗星尾越長
    cellSize       馬賽克格子尺寸（px）— 設計稿以 4px 為單位
    color          底色藍
    accentColor    強調色（橘）
    accentBlock    變橘區塊邊長（格數）
    switchPeriod   變橘慢速換抽週期（秒）
    orangeCells    橘色範圍半徑（距叢集中心格數，此處密度歸零）
    orangeMax      中心（rn=0）的變橘機率（0~1）
    orangeGamma    密度衰減指數 — 越大中心越集中、邊緣越快變稀疏
    orangeHole     橘色挖空比例（0~1）— 被抽中的格子再以此機率留藍
    patchScale     patch 整體縮放倍率
    driftRatio     漂移振幅（佔 patch 短邊比例）— 越大越散、太大會失去重疊
    driftSpeed     漂移速度倍率
    coreScale      持久球半徑倍率 — 越大遮罩核心越大、外緣溶解帶越往外
    edgePeriod     邊緣呼吸週期（秒）— 逐格閾值重抽間隔，越大呼吸越慢
    follow         跟隨游標的緩動係數（0~1）— 越小越黏滯、拖尾越長，1＝立刻貼齊
    tailAmount     彗星尾濃度（0~1）— 0 關閉尾巴，越大尾巴越實、拖越遠
    idleRoamRange  閒置自動遊走範圍（佔短邊比例）
    roamArea       閒置遊走活動範圍（正規化矩形）— 叢集含外緣不出帶、必要時縮小
    idleRoamSpeed  閒置遊走速度倍率
    idleBlobMin/Max 拖尾章半徑下/上限（佔短邊比例）
    autoRoam       強制只自動遊走、不綁游標
  ============================================================================
-->
<template>
  <section ref="wrapRef" class="metaballs" :style="{ background: bgColor }">
    <canvas ref="canvasRef" />
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 畫布底色 */
    bgColor?: string;
    /** 同時存活的 metaball 上限（ring buffer 大小） */
    maxBalls?: number;
    /** 單顆 ball 從出現到消失的總壽命（秒）：越長彗星尾越長 */
    life?: number;
    /** 馬賽克格子尺寸（CSS px）；設計稿紋理以 4px 為單位 */
    cellSize?: number;
    /** 底色藍 */
    color?: string;
    /** 強調色（橘）：中心區塊慢速換抽用此色 */
    accentColor?: string;
    /** 變橘區塊邊長（格數）：越大橘色色塊越大顆 */
    accentBlock?: number;
    /** 變橘慢速換抽的週期（秒）：各區塊相位錯開、此起彼落 */
    switchPeriod?: number;
    /** 橘色範圍半徑（距叢集中心的格數；rn=1 即此處密度歸零） */
    orangeCells?: number;
    /** 中心（rn=0）的變橘機率（0~1） */
    orangeMax?: number;
    /** 密度衰減指數：p = orangeMax × (1-rn)^orangeGamma
     *  → 1 為線性、越大中心越集中、邊緣越快變稀疏 */
    orangeGamma?: number;
    /** 橘色挖空比例（0~1）：被區塊層抽中變橘的格子，再以此機率留藍
     *  → 橘色團塊內部透空、不成實心（另用一組較慢的 epoch，不閃爍） */
    orangeHole?: number;
    /** patch 整體縮放倍率 */
    patchScale?: number;
    /** 公轉軌道半徑倍率（乘在 ROSTER 各自的 orb 上）：越大三塊分越開、
     *  太大會失去相交；1 = 預設軌道（12~15 格），保證三塊永遠大面積重疊 */
    driftRatio?: number;
    /** 公轉速度倍率 */
    driftSpeed?: number;
    /** 持久球半徑倍率：以 patch 叢集名目半徑為基準 */
    coreScale?: number;
    /** 邊緣呼吸週期（秒）：逐格閾值每隔約這麼久重抽一次（相位逐格錯開）
     *  → 靜止時邊緣也微微呼吸；越大呼吸越慢 */
    edgePeriod?: number;
    /** 跟隨游標的緩動係數（0~1，以 60fps 為基準做 frame-rate 正規化）：
     *  焦點每幀往游標靠近此比例 → 越小越黏滯、團塊拖得越後面，1＝立刻貼齊 */
    follow?: number;
    /** 彗星尾濃度（0~1）：patch 群以外、落在拖尾章場內的格子補畫紋理碎片的比例。
     *  0＝關閉尾巴（只剩 patch 拼貼）；越大尾巴越實、看起來拖越遠 */
    tailAmount?: number;
    /** 閒置自動遊走的範圍（佔畫面短邊比例） */
    idleRoamRange?: number;
    /** 閒置遊走活動範圍（相對畫布的正規化矩形 0~1）：未提供＝整畫布置中、幅度
     *  idleRoamRange；提供時 patch 叢集「含羽化外緣」被限制在矩形內（幅度內縮
     *  叢集半徑；帶塞不下時整體等比縮小），不會壓到範圍外的內容 */
    roamArea?: { x: number; y: number; width: number; height: number };
    /** 閒置遊走速度倍率 */
    idleRoamSpeed?: number;
    /** 拖尾章半徑下限（佔短邊比例） */
    idleBlobMin?: number;
    /** 拖尾章半徑上限（佔短邊比例） */
    idleBlobMax?: number;
    /** 強制「只自動遊走、不綁游標互動」（觸控環境自動啟用） */
    autoRoam?: boolean;
  }>(),
  {
    bgColor: '#ffffff',
    maxBalls: 64,
    life: 2.5,
    cellSize: 4,
    color: '#9FD6FF',
    accentColor: '#FF7F00',
    accentBlock: 3,
    switchPeriod: 3,
    orangeCells: 36,
    orangeMax: 1,
    orangeGamma: 1.8,
    orangeHole: 0.22,
    patchScale: 1,
    driftRatio: 1,
    driftSpeed: 1.6,
    coreScale: 1,
    edgePeriod: 2.5,
    follow: 0.2,
    tailAmount: 0.75,
    idleRoamRange: 0.3,
    idleRoamSpeed: 1,
    idleBlobMin: 0.08,
    idleBlobMax: 0.14,
    autoRoam: false,
  },
);

const wrapRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const wrap = wrapRef.value;
  const canvas = canvasRef.value;
  if (!wrap || !canvas) return;

  const ctx = canvas.getContext('2d')!;
  const CELL = props.cellSize;
  const MAX = props.maxBalls;
  const COLOR = props.color;
  const ACCENT = props.accentColor;
  const ACCENT_BLOCK = Math.max(1, Math.round(props.accentBlock));
  const SWITCH_PERIOD = Math.max(0.1, props.switchPeriod);
  const EDGE_PERIOD = Math.max(0.1, props.edgePeriod); // 邊緣呼吸週期（秒）
  const ORANGE_R = props.orangeCells * CELL; // 變橘衰減終點（px）
  const ORANGE_GAMMA = Math.max(0.1, props.orangeGamma); // 密度衰減指數
  const ORANGE_HOLE = Math.min(Math.max(props.orangeHole, 0), 1); // 挖空比例
  // 挖空層換抽週期：刻意與區塊層不可公度 → 兩層各自緩慢重抽、不同步
  const HOLE_PERIOD = SWITCH_PERIOD * 1.7;

  // 穩定的偽隨機（同輸入每幀同值 → 不閃爍）
  const hash = (x: number, y: number) => {
    const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
  // 三輸入版（多帶一個 epoch 維度）：用於「區塊 × 時間」決定變橘
  const hash3 = (x: number, y: number, z: number) => {
    const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return s - Math.floor(s);
  };

  // 平滑階梯：x≤a 回 0、x≥b 回 1，中間為 S 形漸變
  const smoothstep = (a: number, b: number, x: number) => {
    const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
    return t * t * (3 - 2 * t);
  };

  // ---------- 三種紋理：純函式 (tex, gx, gy) → 該格是否實心 ----------
  // 皆以畫布絕對格座標取樣 → patch 漂移時圖案錨定不滑動
  const DASH_SEG = 6; // 線段紋每段長（格）：斷點以段為單位抽
  const texOn = (tex: number, gx: number, gy: number): boolean => {
    if (tex === 0) return ((gx + gy) & 1) === 0; // 紋路1｜1格棋盤（4px）
    if (tex === 1) return (((gx >> 1) + (gy >> 1)) & 1) === 0; // 紋路2｜2格棋盤（8px）
    // 紋路3｜線段紋：偶數列鋪橫線、逐列相位偏移、每段約 28% 機率斷開
    if ((gy & 1) !== 0) return false;
    const shift = Math.floor(hash(gy * 3.31, 8.83) * DASH_SEG);
    const seg = Math.floor((gx + shift) / DASH_SEG);
    return hash(seg * 1.71, gy * 0.93) > 0.28;
  };

  // ---------- 固定 patch 陣容：尺寸/基準偏移/疊放順序都不變，只漂移 ----------
  // 需求 1：三種紋理各一塊（線段紋 ×1、1格棋盤 ×1、2格棋盤 ×1）。
  // 陣列順序 = 疊放順序（後者在上，漂移不改變上下關係）。
  //
  // 【為什麼是公轉而不是自由漂移】
  // 舊寫法是「固定基準偏移 + 自由 sin 漂移」，兩塊中心的最壞距離 = 偏移差 +
  // 兩振幅，會大過 patch 半寬總和 → 三塊有機會散開、聯集破碎（需求 4 補充：
  // 避免分太開）。改成各自繞焦點公轉：位移量一樣大、角速度不同 → 仍會互相
  // 穿越、交換左右前後，但中心距離上限 = 兩軌道半徑和（≈27 格），遠小於
  // patch 半寬總和（≈68 格）→ 永遠保持大面積重疊。
  //   orb    軌道半徑（格）；實際半徑再乘 driftRatio
  //   fq     角速度倍率（彼此不可公度 → 相對位置持續變化、不週期性復位）
  //   phase  起始相位（差約 120°，開場就均勻散開）
  const ROSTER = [
    { tex: 1, w: 72, h: 40, orb: 12, phase: 0.0, fq: 0.9 }, // 2格棋盤（底層）
    { tex: 0, w: 64, h: 44, orb: 15, phase: 2.09, fq: 1.17 }, // 1格棋盤
    { tex: 2, w: 60, h: 36, orb: 13, phase: 4.19, fq: 1.38 }, // 線段紋（頂層）
  ];
  const ORBIT_W = 0.32; // 公轉基礎角速度（rad/s，再乘 fq 與 driftSpeed）
  const WOBBLE = 0.18; // 次諧波抖動（佔軌道半徑）：讓軌跡不是正圓、有機一點
  // 垂直軌道倍率（相對水平）：垂直空間比水平窄，壓扁一點避免整叢集上下抽動
  const DRIFT_Y_MUL = 0.7;
  // patch 本體羽化（超橢圓，同正式版中心區）：以正規化半徑 rn 判定，中心 keep=1、
  // 邊緣（1-PATCH_FEATHER ~ 1）smoothstep 降到 0 + 抖動 hash 讓位 → 圓角方形、
  // 四邊溶解，不見方形直角。也同時是「聯集縮到遮罩以內」時的防線：
  // 露出來的 patch 邊永遠是溶解圓角，不會出現生硬直線
  const PATCH_FEATHER = 0.4; // 羽化帶寬（佔半徑比例）
  const SUPER_N = 4; // 超橢圓指數：4 ≈ 圓角方形（2=橢圓、越大越方）
  // 逐 patch 的實際軌道半徑（格，含次諧波抖動）：公轉是有界的，
  // 所以「叢集半徑」與「兩塊中心最大距離」都能在這裡一次算死
  const ORB = ROSTER.map((p) => p.orb * props.driftRatio * (1 + WOBBLE));
  // 叢集名目半徑（格）＝ 最遠 patch 邊緣。公轉有界 → 遮罩半徑（持久球）與
  // roamArea 內縮量共用同一個值，不必再分「含/不含漂移」兩套
  let clusterC = 0;
  ROSTER.forEach((p, i) => {
    clusterC = Math.max(
      clusterC,
      ORB[i]! + p.w / 2,
      ORB[i]! * DRIFT_Y_MUL + p.h / 2,
    );
  });
  const CLUSTER_PX = clusterC * props.patchScale * CELL;

  // 叢集焦點：pc 追游標（平滑緩動、不瞬間貼齊）、其餘閒置自走；
  // pointerX/Y = 游標原始位置（目標點），centerX/Y = 緩動後的實際焦點
  let pointerX = -9999;
  let pointerY = -9999;
  let centerX = -9999;
  let centerY = -9999;
  // spread 由 0 緩動到 1（掛載擴散現身）
  let spread = 0;
  // roamArea 帶塞不下叢集名目半徑時的等比縮小倍率（patch 與持久球同乘）
  let clusterScale = 1;

  let width = 0;
  let height = 0;
  let cols = 0;
  let rows = 0;

  const setSize = () => {
    width = wrap.clientWidth;
    height = wrap.clientHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = Math.max(width * dpr, 1);
    canvas.height = Math.max(height * dpr, 1);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(width / CELL);
    rows = Math.ceil(height / CELL);
  };
  setSize();

  // ---------- 蓋章式 metaball：沿移動路徑生成、隨壽命漸縮（同正式版） ----------
  type Stamp = { x: number; y: number; r0: number; born: number };
  const stamps: Stamp[] = Array.from({ length: MAX }, () => ({
    x: -9999,
    y: -9999,
    r0: 0,
    born: -Infinity,
  }));
  let stampIndex = 0;
  const lastSpawn = { x: -9999, y: -9999 };
  const SPAWN_DIST = 20; // 移動超過此距離才蓋下一章（越小尾巴越連續）

  const now = () => performance.now() / 1000;

  const addStamp = (x: number, y: number, rScaleMin: number, rScaleMax: number) => {
    const base = Math.min(width, height);
    const count = 1 + (Math.random() < 0.35 ? 1 : 0);
    for (let n = 0; n < count; n++) {
      const s = stamps[stampIndex]!;
      stampIndex = (stampIndex + 1) % MAX;
      const spreadPx = base * 0.05;
      s.x = x + (Math.random() - 0.5) * spreadPx * 2;
      s.y = y + (Math.random() - 0.5) * spreadPx * 2;
      s.r0 = base * (rScaleMin + Math.random() * (rScaleMax - rScaleMin));
      s.born = now();
    }
  };

  const spawn = (x: number, y: number) => {
    const dx = x - lastSpawn.x;
    const dy = y - lastSpawn.y;
    if (dx * dx + dy * dy < SPAWN_DIST * SPAWN_DIST) return;
    lastSpawn.x = x;
    lastSpawn.y = y;
    addStamp(x, y, props.idleBlobMin, props.idleBlobMax);
  };

  // ---------- 互動：pc 追游標；觸控 / 窄幅 / autoRoam 一律閒置自走 ----------
  const IDLE_DELAY = 1.2;
  let lastPointerAt = -Infinity;

  // pointer 只記錄「目標點」，實際焦點在 animate 裡逐幀緩動過去（平滑跟隨）；
  // 蓋章也改在 animate 沿緩動後的路徑做 → 尾巴永遠在團塊身後、不會超前
  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    lastPointerAt = now();
    pointerX = e.clientX - rect.left;
    pointerY = e.clientY - rect.top;
    // 首次進場（或從閒置切回）不做緩動，避免從畫布外/遠處掃一條長尾過來
    if (centerX < -9000) {
      centerX = pointerX;
      centerY = pointerY;
    }
  };
  const roamOnly =
    props.autoRoam ||
    window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(max-width: 1279.98px)').matches;
  const listenEl =
    (wrap.closest('[data-metaball-scope]') as HTMLElement | null) ?? wrap;
  if (!roamOnly) {
    listenEl.addEventListener('pointermove', onPointerMove);
    listenEl.addEventListener('pointerdown', onPointerMove);
  }

  // ---------- 彗星尾參數 ----------
  const FOLLOW = Math.min(Math.max(props.follow, 0.01), 1); // 跟隨緩動係數
  const TAIL = Math.min(Math.max(props.tailAmount, 0), 1); // 尾巴濃度
  const TAIL_TH = 1.5; // 尾巴門檻倍率（>1 → 比本體稀疏、只在剛蓋章處出現）
  const TAIL_BLOCK = 16; // 尾巴挑紋理的區塊邊長（格）
  // 單章的尾巴可見半徑約 0.8r（門檻 TAIL_TH 下的等值線），取 1.15r 當 bbox 保險
  const TAIL_REACH = 1.15;

  // ---------- render loop（IntersectionObserver 控制啟停） ----------
  let raf = 0;
  let running = false;
  let prevT = now();

  const animate = () => {
    if (!running) return;
    const t = now();
    const dt = Math.min(Math.max(t - prevT, 0), 0.1); // 分頁被節流時夾住
    prevT = t;
    const isIdle = t - lastPointerAt > IDLE_DELAY;

    // 閒置：焦點以多個不可公度頻率平滑遊走，沿路徑蓋章 → 彗星尾。
    // roamArea：遊走中心＝矩形中心，逐軸幅度＝半寬/半高內縮「可見半徑」；
    // 帶塞不下名目半徑時整體等比縮小（clusterScale）→ 叢集含外緣都不出帶。
    // 可見半徑 = max(patch 聯集半徑, 拖尾章可見半徑)——尾巴現在會被畫出來，
    // 內縮量必須一併涵蓋，否則碎片會溢出帶外壓到文字
    if (isIdle) {
      const base = Math.min(width, height);
      const area = props.roamArea;
      let cx0: number;
      let cy0: number;
      let ampX: number;
      let ampY: number;
      if (area) {
        const halfW = (width * area.width) / 2;
        const halfH = (height * area.height) / 2;
        clusterScale = Math.min(1, halfW / CLUSTER_PX, halfH / CLUSTER_PX);
        // 章半徑不隨 clusterScale 縮，故與 patch 半徑取大者當內縮量
        const tailR = TAIL > 0 ? base * (props.idleBlobMax * 0.8 + 0.05) : 0;
        const ext = Math.max(CLUSTER_PX * clusterScale, tailR);
        cx0 = width * (area.x + area.width / 2);
        cy0 = height * (area.y + area.height / 2);
        ampX = Math.max(0, halfW - ext);
        ampY = Math.max(0, halfH - ext);
      } else {
        clusterScale = 1;
        cx0 = width * 0.5;
        cy0 = height * 0.5;
        ampX = base * props.idleRoamRange;
        ampY = ampX;
      }
      const s = t * props.idleRoamSpeed;
      centerX =
        cx0 +
        (Math.sin(s * 0.13) * 0.5 +
          Math.sin(s * 0.21 + 1.7) * 0.3 +
          Math.sin(s * 0.07 + 4.1) * 0.2) *
          ampX;
      centerY =
        cy0 +
        (Math.cos(s * 0.11) * 0.5 +
          Math.cos(s * 0.19 + 0.7) * 0.3 +
          Math.sin(s * 0.05 + 2.3) * 0.2) *
          ampY;
      spawn(centerX, centerY);
    } else {
      clusterScale = 1;
      // 平滑跟隨：焦點每幀往游標 lerp（k 做 frame-rate 正規化，以 60fps 為基準）
      // → 團塊是「跟」上來而非瞬間貼齊；游標停下時緩緩收斂。章沿此路徑蓋。
      if (pointerX > -9000) {
        const k = 1 - Math.pow(1 - FOLLOW, dt * 60);
        centerX += (pointerX - centerX) * k;
        centerY += (pointerY - centerY) * k;
        spawn(centerX, centerY);
      }
    }

    // 掛載擴散：patch 叢集由 0 緩動到全尺寸
    spread += (1 - spread) * 0.12;

    // 計算每顆 stamp 的當前半徑（快進慢出），並求「尾巴帶」bounding box
    const live: { x: number; y: number; r: number }[] = [];
    let tMinX = Infinity;
    let tMinY = Infinity;
    let tMaxX = -Infinity;
    let tMaxY = -Infinity;
    for (let i = 0; i < MAX; i++) {
      const s = stamps[i]!;
      const age = t - s.born;
      const grow = Math.min(age / 0.15, 1);
      const decay = 1 - Math.min(Math.max((age - 0.3) / (props.life - 0.3), 0), 1);
      const r = s.r0 * grow * decay * decay;
      if (r <= 1) continue;
      live.push({ x: s.x, y: s.y, r });
      tMinX = Math.min(tMinX, s.x - r * TAIL_REACH);
      tMaxX = Math.max(tMaxX, s.x + r * TAIL_REACH);
      tMinY = Math.min(tMinY, s.y - r * TAIL_REACH);
      tMaxY = Math.max(tMaxY, s.y + r * TAIL_REACH);
    }

    // 持久球（常駐，非只閒置）：確保 patch 群永不被遮罩吃光（需求 2：不消失）。
    // 半徑刻意「小於」叢集名目半徑（×0.68）→ 場的圓形等值線切進 patch 外緣，
    // 矩形直邊只保留在內部、外緣被收成圓弧＋隨機閾值毛糙（圓弧收邊，參考正式版）。
    // 刻意「不」放進 live：尾巴用的場不含它，否則整顆頭會被尾巴紋理填滿。
    const headR =
      centerX > -9000 && width > 0
        ? CLUSTER_PX * 0.68 * props.coreScale * spread * clusterScale
        : 0;

    // ---------- 本幀的 3 個 patch 矩形（格座標）：基準偏移 + 逐 patch 漂移 ----------
    const focalGX = Math.round(centerX / CELL);
    const focalGY = Math.round(centerY / CELL);
    const ds = t * props.driftSpeed;
    const rects = ROSTER.map((p) => {
      // 公轉：逐 patch 角速度不同（fq）→ 相對位置持續變化、會互相穿越交換位置；
      // 但半徑有界 → 中心距離有上限，三塊永遠相交。次諧波 WOBBLE 讓軌跡不是正圓
      const a = ds * ORBIT_W * p.fq + p.phase;
      const rOrb = p.orb * props.driftRatio;
      const dx = (Math.cos(a) + Math.cos(a * 2.3 + p.phase) * WOBBLE) * rOrb;
      const dy =
        (Math.sin(a) + Math.sin(a * 1.7 + p.phase * 1.3) * WOBBLE) *
        rOrb *
        DRIFT_Y_MUL;
      const f = props.patchScale * spread * clusterScale;
      const w = Math.max(2, Math.round(p.w * f));
      const h = Math.max(2, Math.round(p.h * f));
      const cx = focalGX + Math.round(dx * f);
      const cy = focalGY + Math.round(dy * f);
      const x0 = cx - (w >> 1);
      const y0 = cy - (h >> 1);
      return {
        x0,
        x1: x0 + w,
        y0,
        y1: y0 + h,
        // 超橢圓羽化用：矩形中心（格）與半寬/半高
        cx: x0 + (w - 1) / 2,
        cy: y0 + (h - 1) / 2,
        hw: w / 2,
        hh: h / 2,
        tex: p.tex,
      };
    });

    // 掃描範圍 = patch 群 ∪ 尾巴帶。patch 格的上限就是 rects 本身，尾巴格的
    // 上限是各章的 TAIL_REACH 圈——都比「所有球 ×2.5r」的舊 bbox 緊，掃得更少
    let gx0 = cols;
    let gx1 = 0;
    let gy0 = rows;
    let gy1 = 0;
    for (const r of rects) {
      gx0 = Math.min(gx0, r.x0);
      gx1 = Math.max(gx1, r.x1);
      gy0 = Math.min(gy0, r.y0);
      gy1 = Math.max(gy1, r.y1);
    }
    if (TAIL > 0 && tMinX < Infinity) {
      gx0 = Math.min(gx0, Math.floor(tMinX / CELL));
      gx1 = Math.max(gx1, Math.ceil(tMaxX / CELL));
      gy0 = Math.min(gy0, Math.floor(tMinY / CELL));
      gy1 = Math.max(gy1, Math.ceil(tMaxY / CELL));
    }
    gx0 = Math.max(gx0, 0);
    gy0 = Math.max(gy0, 0);
    gx1 = Math.min(gx1, cols);
    gy1 = Math.min(gy1, rows);

    ctx.clearRect(0, 0, width, height);

    // 逐格：先查 patch（便宜的矩形/紋理測試），命中才算 metaball 場（貴），
    // 場強 ≥ 該格隨機閾值才畫 → patch 拼貼被場遮罩收邊、外緣有機溶解
    for (let gy = gy0; gy < gy1; gy++) {
      for (let gx = gx0; gx < gx1; gx++) {
        const cx = (gx + 0.5) * CELL;
        const cy = (gy + 0.5) * CELL;
        // 由上往下找第一個「覆蓋該格且紋理實格」的 patch；透空格讓位下層
        let hit = false;
        for (let pi = rects.length - 1; pi >= 0; pi--) {
          const r = rects[pi]!;
          if (gx < r.x0 || gx >= r.x1 || gy < r.y0 || gy >= r.y1) continue;
          // 超橢圓羽化：中心 keep=1、邊緣降到 0 + 抖動 hash 讓位
          // → patch 呈圓角方形、四邊溶解，不見方形直角
          const nx = Math.abs(gx - r.cx) / r.hw;
          const ny = Math.abs(gy - r.cy) / r.hh;
          const rn = Math.pow(
            Math.pow(nx, SUPER_N) + Math.pow(ny, SUPER_N),
            1 / SUPER_N,
          );
          const keep = 1 - smoothstep(1 - PATCH_FEATHER, 1, rn);
          if (keep <= 0) continue;
          if (
            keep < 1 &&
            hash(gx * 1.37 + pi * 7.7, gy * 2.11 + pi * 3.3) > keep
          )
            continue;
          if (!texOn(r.tex, gx, gy)) continue;
          hit = true;
          break;
        }
        // 彗星尾：不屬於任何 patch 的格子，改用「依 TAIL_BLOCK 區塊抽一種紋理」
        // 補畫（三種同家族、一樣錨定絕對格座標 → 與本體看起來同一套馬賽克），
        // 再以 tailAmount 逐格稀釋。是否畫得出來交給下面的場判定
        let tail = false;
        if (!hit) {
          if (TAIL <= 0) continue;
          // gate：尾巴只長在「頭」以外。頭部圓形內的 patch 透空處若也補上尾巴
          // 紋理，拼貼構圖會被填糊 → 以持久球半徑為界 smoothstep 淡入
          const gate =
            headR > 1
              ? smoothstep(
                  headR * 0.85,
                  headR * 1.35,
                  Math.hypot(cx - centerX, cy - centerY),
                )
              : 1;
          if (gate <= 0) continue;
          const tbx = Math.floor(gx / TAIL_BLOCK);
          const tby = Math.floor(gy / TAIL_BLOCK);
          const ttex = Math.floor(hash(tbx * 5.1 + 2.3, tby * 7.3 + 8.9) * 3);
          if (!texOn(ttex, gx, gy)) continue;
          if (hash(gx * 4.3 + 1.1, gy * 6.7 + 5.9) > TAIL * gate) continue;
          tail = true;
        }
        // 閾值 = 穩定 hash × 慢速 epoch（相位逐格錯開）：同 epoch 內每幀同值
        // 不閃爍；每隔約 EDGE_PERIOD 秒逐格錯落重抽 → 靜止時邊緣也微微呼吸
        const thEpoch = Math.floor(t / EDGE_PERIOD + hash(gx * 3.7, gy * 9.1));
        const th = 0.6 + hash3(gx + 5.2, gy + 8.4, thEpoch + 2.6);
        let field = 0;
        for (const b of live) {
          const dx = cx - b.x;
          const dy = cy - b.y;
          // 平移後的 inverse-square：在 d = 2.5r 處歸零（同正式版）
          const q = (b.r * b.r) / (dx * dx + dy * dy + 1) - 0.16;
          if (q > 0) field += q;
        }
        // 本體才吃持久球（尾巴只看拖尾章 → 頭部圓形不會被尾巴紋理填滿）；
        // 尾巴門檻乘 TAIL_TH → 只出現在剛蓋章的路徑附近，隨章衰減而變稀、消失
        if (tail) {
          if (field < th * TAIL_TH) continue;
        } else {
          if (headR > 1) {
            const dx = cx - centerX;
            const dy = cy - centerY;
            const q = (headR * headR) / (dx * dx + dy * dy + 1) - 0.16;
            if (q > 0) field += q;
          }
          if (field < th) continue;
        }
        // 顏色：預設藍；橘色 = 以焦點為中心的機率場，兩層慢速換抽落成色塊。
        // 密度連續衰減（無平台區）→ 中心密集、邊緣稀疏；半徑逐區塊抖動 ±15%
        // → 邊界不是完美同心圓
        const bx = Math.floor(gx / ACCENT_BLOCK);
        const by = Math.floor(gy / ACCENT_BLOCK);
        const rJit = 0.85 + hash(bx * 3.9 + 5.7, by * 5.3 + 1.9) * 0.3;
        const rn = (Math.hypot(cx - centerX, cy - centerY) / ORANGE_R) * rJit;
        const p = rn >= 1 ? 0 : props.orangeMax * Math.pow(1 - rn, ORANGE_GAMMA);
        // 區塊層：accentBlock 見方為單位、區塊 × epoch 穩定 hash、相位逐塊
        // 錯開（switchPeriod）→ 橘色成小團塊、此起彼落地變橘/變回
        const bPhase = hash(bx * 7.1 + 1.3, by * 7.1 + 2.7);
        const epoch = Math.floor(t / SWITCH_PERIOD + bPhase);
        let accent = p > 0 && hash3(bx, by, epoch + 0.5) < p;
        // 格層挖空：被抽中的格子再逐格 dropout（自己的較慢 epoch、相位逐格
        // 錯開）→ 橘色團塊內部透空，不會有實心橘色大面積
        if (accent && ORANGE_HOLE > 0) {
          const hPhase = hash(gx * 1.9 + 4.4, gy * 2.7 + 6.1);
          const hEpoch = Math.floor(t / HOLE_PERIOD + hPhase);
          if (hash3(gx * 0.7 + 3.1, gy * 1.3 + 9.7, hEpoch + 4.2) < ORANGE_HOLE)
            accent = false;
        }
        ctx.fillStyle = accent ? ACCENT : COLOR;
        ctx.fillRect(gx * CELL, gy * CELL, CELL, CELL);
      }
    }

    raf = requestAnimationFrame(animate);
  };

  const observer = new IntersectionObserver(([entry]) => {
    const shouldRun = entry?.isIntersecting ?? false;
    if (shouldRun && !running) {
      running = true;
      animate();
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  });
  observer.observe(wrap);

  const resizeObserver = new ResizeObserver(setSize);
  resizeObserver.observe(wrap);

  onBeforeUnmount(() => {
    running = false;
    cancelAnimationFrame(raf);
    observer.disconnect();
    resizeObserver.disconnect();
    listenEl.removeEventListener('pointermove', onPointerMove);
    listenEl.removeEventListener('pointerdown', onPointerMove);
  });
});
</script>

<style scoped>
.metaballs {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.metaballs canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
