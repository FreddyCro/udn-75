<!--
  單一論壇場次區塊（論壇一~三），純 props 驅動、無動態。
  版位一律以 pc 設計稿 1280 座標系標註（x 直接對應 CSS px，y 以本區標眉頂端為 0）。
  本元件的子區塊（__tag / __title / __head / __date / __venue / __meta / __speakers / __cta …）
  是 ForumCorePath 設計線的錨點，見 ~/utils/forum-node-path 的 FORUM_PATH_NODES。
  ⚠️ 改 class 名或增刪這些區塊，線會量不到必要錨點而**整條消失**（刻意的 fail-loud）；
     只是改內容長短則不必動它 —— 節點是量出來的，會自己跟著走。
  ⚠️ 但**改版位**（某個區塊相對它的錨點元素移動了）就要回頭校 `forum-node-path.ts` ——
     那邊的 `dy` / `t` 是對著「當時渲染出來的位置」量的常數，版位一動就同步偏掉。
     2026-08-10 修講者組的 margin collapse（照片上移 102）時，W5／W7 就是這樣被帶偏的。
-->
<script setup lang="ts">
import type { ForumEvent, ForumLine, ForumTextArt } from '~/types/forum';
import { gaClickButton } from '~/utils/tracking-event';

const props = withDefaults(
  defineProps<{
    event: ForumEvent;
    /**
     * 講者照的藍塊狀態，三態：
     *   undefined → 這一場不做這個效果，**遮罩連 DOM 都不渲染**（論壇三沒有講者、論壇四不做）
     *   false     → 藍塊蓋住整張照片（inactive）
     *   true      → 藍塊帶著橘色上緣往下退出（active）
     *
     * 一個值管同場所有講者照 —— 論壇二的兩張卡同時開始刷，不做逐張錯開。
     * 場次與事件 key 的對照在 ~/utils/forum-photo-reveal。
     */
    photoReveal?: boolean;
  }>(),
  // ⚠️ 這個 default 是必要的，不是贅寫。Vue 對宣告成 Boolean 型別的 prop 有 absence
  //    casting：沒傳且**沒有 default** 時值會被轉成 false，三態就塌成兩態 ——
  //    論壇四會變成「有遮罩且蓋住」，講者照直接消失在藍塊底下。
  //    明寫 default 讓 hasDefault 為真，resolvePropValue 便不再轉（見 Vue 的 props.ts）。
  { photoReveal: undefined },
);

const dateParts = computed(() => props.event.date.split('/'));

// 那一撇有三種狀態，全部由資料決定（見 ForumEvent type 的 slash）：
//   'core'          → 不畫字元，改由橘核心經過時逐段補上（論壇二）
//   true            → 畫實體 `/`（論壇四是階梯式卻有斜線，故明寫）
//   省略            → 階梯式不畫、其餘畫
// 兩個 computed 而非一個三元判斷：template 有兩個互斥的節點要掛，各讀各的才不會看漏。
const isCoreSlash = computed(() => props.event.slash === 'core');
const hasSlash = computed(() => {
  const s = props.event.slash;
  if (s === 'core') return false;
  return s ?? props.event.layout !== 'stair';
});

/**
 * 日期大字的逐行素材 ＋ 真文字。
 *
 * 稿把日期整行 outline 掉了（**星期的圓框也在同一條 path 裡**），所以這一組不能像
 * 其他群組那樣逐格替換 —— 一行就是一筆素材，行的構成照現行 grid 的列切：
 *   2 行 → 「2026」／「09/09 三」　　3 行 → 「2026」／「09」／「15 三」（階梯式）
 *
 * 幾行由 dateArt 的筆數決定（＝稿有幾列），不由 layout 推 —— 資料說幾行就幾行。
 * 真文字則一律從 year / date / weekday 組出來：文案只存一份，校稿只動那三個欄位。
 * 某個斷點沒填素材時 <UArtLine> 會退回活文字（那時圓框不會出現，看得出來 ——
 * 刻意的 fail-loud，不另做一套 CSS 圓框備援）。
 */
const dateLines = computed<ForumTextArt[]>(() => {
  const [mm = '', dd = ''] = dateParts.value;
  const tail = `${dd} ${props.event.weekday}`;
  const texts =
    props.event.dateArt.length === 3
      ? [props.event.year, mm, tail]
      : [props.event.year, `${mm}${hasSlash.value ? '/' : ' '}${tail}`];
  return texts.map((text, i) => ({ text, art: props.event.dateArt[i] ?? {} }));
});

// 那一撇的畫出比例由論壇段路徑的進度驅動（窗口由 ForumCorePath 依幾何算出）。
// 四場都會呼叫這個 composable，但只有 isCoreSlash 那一場真的把值綁到 DOM 上。
const { forumSlashDraw } = useOrangeCoreProgress();

// 「立即報名」的點擊音效（同 Agenda／AgendaReport 的兩顆 CTA）。useSfx() 一定要在 setup
// 期間取（它此刻要讀 runtimeConfig，見 useSfx.ts）；音效池由 pages/index.vue 的 <AppSfx>
// 持有，聲音開關關著時 play() 靜默。
const { play } = useSfx();

// 講者版式全部是「照片左／文字右」，差別只在數字與標籤位置，由 --quote／--stair／--youth
// 三個 layout modifier 分（見下方 SCSS）。
// ⚠️ 2026-08-17 之前這裡有一個 `isSpeakerCards = speakers.length > 1`，用來切「並排卡片」
//    版式。設計改成單人之後那個判斷會靜默翻成 false、整組卡片樣式消失 —— 版式**只能由
//    layout 決定，不能由人數決定**，故整個拿掉，不要因為日後又變兩人就加回來。

// ForumLine 的純文字。姓名可能是素材物件，但照片的 alt 需要字串 ——
// 直接綁物件會印出 [object Object]。
const lineText = (line: ForumLine) => (typeof line === 'string' ? line : line.text);
</script>

<template>
  <article class="forum-event" :class="`forum-event--${event.layout}`">
    <div class="forum-event__head">
      <p class="forum-event__tag">
        <span class="forum-event__tag-no">{{ event.no }}</span>
        <span class="forum-event__tag-name">{{ event.tag }}</span>
      </p>

      <p v-if="event.brand" class="forum-event__brand">
        <UArtLine :line="event.brand" />
      </p>

      <!-- 逐行交給 <UArtLine>：字串照舊輸出文字，物件則換成稿字形 SVG（論壇一）。
           見 architecture/2026-08-12-forum1-text-art-design.md。
           ⚠️ 素材模式要靠祖先的 --art-base（見下方 SCSS）才算得出寬度。 -->
      <h3 class="forum-event__title">
        <UArtLine v-for="(line, i) in event.title" :key="i" :line="line" />
      </h3>

      <p v-if="event.subtitle" class="forum-event__subtitle">
        <UArtLine v-for="(line, i) in event.subtitle" :key="i" :line="line" />
      </p>

      <p v-if="event.body" class="forum-event__body">{{ event.body }}</p>

      <!-- TODO 報名連結未定，暫用 # 佔位（同 AppHeader 的待補外連）。
           盒子與配色由 <UBtn> 畫，本檔的 .forum-event__cta 只給尺寸與版位。
           點擊音效：帶 cta 的場次目前是論壇二與論壇四，兩者共用這顆按鈕 —— 不按場次分，
           頁面上五顆 CTA（本顆 ×2、議程 ×2、報導 ×1）行為一致。UBtn 沒宣告 emits，
           故 @click 會落在真正的 <a> 上（同 Agenda／AgendaReport 的寫法）。
           ctaHidden：報名未開放時佔位隱藏（見 types/forum.ts 的欄位說明）。
           aria-hidden ＋ tabindex="-1" 是配套 —— visibility: hidden 已經把它移出無障礙樹
           與定位順序，這兩個屬性只是明寫意圖；fallthrough attrs 會落在真正的 <a> 上。 -->
      <UBtn
        v-if="event.cta"
        :id="event.ctaId"
        variant="primary"
        class="forum-event__cta"
        :class="{ 'forum-event__cta--hidden': event.ctaHidden }"
        :aria-hidden="event.ctaHidden ? 'true' : undefined"
        :tabindex="event.ctaHidden ? -1 : undefined"
        href="#"
        @mouseenter="play('sfx01Short')"
        @click="play('sfx01Short'); gaClickButton('signup', event.ctaGaTerm ?? '')"
      >
        {{ event.cta }}
      </UBtn>
    </div>

    <!-- 日期／地點／引言：三場的排列差很多，故整層攤平成設計稿座標，各群組自行定位。 -->
    <div class="forum-event__meta">
      <!-- pc 稿是右對齊、欄寬 454。素材用「整組共用畫布」切（每列同寬 ＝ 群組寬 454.006
           ≒ 下方 SCSS 的欄寬 454），墨跡落在稿的真實 x，所以右對齊靠畫布本身成立 ——
           不必為素材另外改 text-align／align-items（text-align 對絕對定位的 img 無效）。 -->
      <p v-if="event.quoteEn" class="forum-event__quote">
        <UArtLine v-for="(line, i) in event.quoteEn" :key="i" :line="line" />
      </p>

      <!-- data-forum-anchor：ForumCorePath 依這個值（＝場次名）選錨點，不靠文件順序索引，
           故增刪／重排場次不會讓設計線靜默錨到別場身上。 -->
      <div class="forum-event__date" :data-forum-anchor="event.no">
        <!-- 逐行素材（見上方 dateLines）：一行一筆，星期的圓框烤在素材裡。
             行盒仍由 --date-lh 撐出，故整塊的高度與改動前一致 —— 那是設計線的
             W1／W2、S1~S3、R1／R2 的錨點，高度一動整條線就偏。 -->
        <UArtLine
          v-for="(line, i) in dateLines"
          :key="i"
          :line="line"
          class="forum-event__date-line"
        />
        <!-- 那一撇（論壇二）：不是字元，是一筆橫跨兩階的直線，由橘核心經過時逐段畫出。
             外框不套 transform —— ForumCorePath 讀它的右上／左下對角當脊線兩端；
             若把 scaleY 掛在外框上，畫出前 rect 會塌成一點、窗口就算不出來。
             內層 <i> 才是那一撇本身。--slash-draw 於 Task 4 綁上，此步先留預設 0。 -->
        <span v-if="isCoreSlash" class="forum-event__date-coreslash" aria-hidden="true">
          <i :style="{ '--slash-draw': forumSlashDraw }" />
        </span>
      </div>

      <p class="forum-event__venue">
        <UArtLine v-for="(line, i) in event.venue" :key="i" :line="line" />
        <!-- 時間預設排在地點之後；論壇四的稿相反（時間在上），由 SCSS 用 order 換位。
             時間在 __venue 之內，故 --art-base 直接沿用它的（時間沒有自己的 font-size）。 -->
        <UArtLine
          v-if="event.time"
          :line="event.time"
          class="forum-event__time"
        />
      </p>
    </div>

    <div v-if="event.speakers?.length" class="forum-event__speakers">
      <p v-if="event.speakerLabel" class="forum-event__speaker-label">
        {{ event.speakerLabel }}
      </p>
      <div v-for="(sp, i) in event.speakers" :key="i" class="forum-event__speaker">
        <!-- 照片框：尺寸與版位全在這一層（見 SCSS），內層的實圖與 placeholder 只負責填滿它。
             photo 未填時顯示帶編號的 placeholder；填了路徑就自動換成實圖，不需改程式碼。
             講者照只有一張正方圖（無 _pc/_pad/_mob 後綴）→ srcset 收成單一組、use-prefix 關掉。 -->
        <span class="forum-event__photo-box" :class="{ 'is-revealed': photoReveal }">
          <UPic
            v-if="sp.photo"
            :src="sp.photo"
            :use-prefix="false"
            :srcset="['mob']"
            :alt="lineText(sp.name)"
            classname="forum-event__photo"
          />
          <span v-else class="forum-event__photo-slot" aria-hidden="true">{{ sp.photoNo }}</span>

          <!-- 藍塊：只在 photoReveal 不是 undefined 時渲染。
               「線量好那一刻元素才掛上」是刻意的 —— CSS transition 不會在首次渲染跑，
               所以不會出現「照片閃一下 → 藍塊由下往上蓋回去」的反向動畫。 -->
          <i
            v-if="photoReveal !== undefined"
            class="forum-event__photo-mask"
            aria-hidden="true"
          />
        </span>

        <p class="forum-event__speaker-name">
          <UArtLine :line="sp.name" />
          <UArtLine v-if="sp.nameZh" :line="sp.nameZh" />
        </p>
        <p v-if="sp.role" class="forum-event__speaker-role">{{ sp.role }}</p>
        <p v-for="(para, j) in sp.bio ?? []" :key="j" class="forum-event__bio">
          {{ para }}
        </p>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
// 設計稿的大標／日期／地點是 outline 過的 vector，Figma 量到的是「字面」外框；
// live text 的 top 量的是行框頂，兩者差 ＝ line-height ÷ 2 − 字面上緣（Noto Sans TC：CJK 0.405em、數字 0.315em）。
// 以下所有 top 都已扣掉這段差值，註解則寫設計稿原始座標，方便回頭對稿。
// 水平方向的字面內縮只有 3~5% em（≤7px），不另外補正，left/right 直接就是設計稿座標。

// 講者組頂端（padding-top）與段落結尾留白（padding-bottom）皆為設計稿值；
// 講者組走一般流排版，論壇一的長 bio 變長只會往下撐開，不會壓到上面的群組。
// --date-base / --date-lh 在此給預設值：三個版式 modifier 都會蓋掉它，
// 但資料漏填 layout 時（型別擋不到 runtime JSON）至少日期不會失去字級。
//
// ⚠️ 日期的字級寫成**無單位**的 --date-base，--date-size 再由它乘 1px 導出。
//    不是為了好看：稿字形素材的寬度基準 --art-base 必須無單位（<UArtLine> 用
//    calc(--art-w / --art-base * 1em) 算寬，帶了 px 整式無效、素材寬塌成 0），
//    而它又必須恆等於該區塊的 font-size。兩者共用同一個數字才不會各自漂移。
// 階梯式日期（論壇二）逐行的位移與行進距抽成變數：三斷點各給一組 px。
// 不改用 em 換算是為了不讓 pc 的值產生零點幾 px 的位移 —— 那條設計線靠它對位
// （見 architecture/forum-node-path.md）。
.forum-event {
  --date-base: 105;
  --date-size: calc(var(--date-base) * 1px);
  --date-lh: 98px;
  --stair-x1: 154px;
  --stair-x2: 324px;
  --stair-row1: 127px;
  --stair-row2: 114px;

  // 論壇二那一撇的外框（見 .forum-event__date-coreslash）。與 --stair-* 同類：
  // 稿的絕對值、逐斷點各一組 —— 它**不是** --date-size 的固定倍率
  // （實測 h ÷ --date-size：pad 1.623、mob 1.247，設計師逐斷點手調）。
  //
  // ⚠️ **w / h 必須等於 tan(26.7°) ＝ 0.503**（脊線的 rotate 寫死 26.7°，見下方 `i`）。
  //    外框的右上／左下兩角就是脊線的兩端，而 ForumCorePath 讀外框的 rect 推觸發窗口 ——
  //    比例不合的話「核心走的弧長」會比「脊線的長度」長，核心就跑在畫出頭前面。
  //    2026-09-06 修：pc 原本是 103×175 ＝ 0.589（30.5°），外框比脊線實際畫到的範圍
  //    寬 15px；實測核心在撇畫完那一刻已超前 3.9px，draw 飽和後隨即跳開 21.9px。
  //    w 改 88（＝175 × 0.503）、x 同步 +15 讓外框右緣不動 → 可見的撇一格都沒移。
  //    對照 pad 0.4964、mob 0.4995（差 0.73 / 0.34px，在次像素內，不動）。
  //    由 test/forum-slash-box-ratio.spec.ts 對帳。
  --coreslash-w: 88px;
  --coreslash-h: 175px;
  // x/y 的 pc 起手值（257/139）是從 pad 等比推的估計值（無 pc 稿 node id 可查）；
  // 目視微調過：上端要清開「9」的墨跡（肉眼平視看起來已經很接近，但貼緊放大會看到蹭到
  // 筆畫），下端落在「15」左方偏下。
  // ⚠️ **x 是左緣，而脊線錨在右緣（`i` 的 right: 0）** —— 決定撇的位置的是 x + w ＝ 351。
  //    改 w 就要反向補 x，否則撇會整條平移。2026-09-06 把 w 從 103 收到 88 時
  //    x 就是這樣從 248 補到 263 的。
  --coreslash-x: 263px;
  --coreslash-y: 166px;

  position: relative;

  // pad／mob：pc 那套「整段絕對定位到設計稿座標」的模型整組退回一般流排版，改由 flex 直排。
  @include rwd-max('pc') {
    display: flex;
    flex-direction: column;
  }

  &--quote {
    --date-base: 105;
    --date-lh: 98px;

    padding: 1097px 0 280px;

    @include rwd-max('pc') {
      --date-base: 86;
      --date-lh: 80px;

      padding: 32px 80px 80px;
    }

    @include rwd-max('tablet') {
      --date-base: 62;
      --date-lh: 58px;

      padding: 32px 26px 100px;
    }
  }

  &--stair {
    --date-base: 132;
    --date-lh: 124px;

    // pc 是絕對定位版式，講者組是唯一的流內子項 → padding-top 直接等於稿的講者塊頂端。
    // 1177 ＝ 稿 2652:55087 的「講者」y；270 ＝ 稿的講者塊下緣 1457 到段落下緣 1727。
    // 2026-08-17 之前是 1157 / 120：那時講者組頂端是「講者介紹」標籤列、且整組比現在高
    // 130（兩張卡）。兩組數字的總和相同，故論壇三的起點沒有因為這次改版而位移。
    padding: 1177px 0 270px;

    @include rwd-max('pc') {
      --date-base: 86;
      --date-lh: 80px;
      --stair-x1: 99px;
      --stair-x2: 215px;
      --stair-row1: 80px;
      --stair-row2: 80px;
      // 2026-08-23：整撇縮短 20%（69.3×139.6 → 55.44×111.68）。
      // ⚠ w/h 一起乘 0.8，**比例不變**（0.4964）→ 下方寫死的 `rotate(26.7deg)` 仍然正確。
      --coreslash-w: 55.44px;
      --coreslash-h: 111.68px;
      // 目視微調（同上）：170/87 → 190/96 → 175/105。
      // 190/96 時整撇偏右下（實測撇心 (305, 370)，而「09」右下角與「15」左上角的中點是
      // (283, 365)）。縮短 20% 會讓撇心自然往左上移 (−6.9, −14)，故 x 再減 15、y 再加 9。
      // ⚠ 這一撇的版位是唯一真值（Q7a/Q7b 掛在它身上），改完要做兩件事：
      //   ① 同步 spec 的 PAD_SLASH；
      //   ② **重推 forum-node-path 的 Q7 的 x** —— 它是「撇的延長線上」反推的，
      //      不會自己跟上（本次縮短 20% 就漏了，折角從 10° 撐到 21°）。
      --coreslash-x: 175px;
      --coreslash-y: 105px;

      // padding-bottom 221 ＝ 稿的講者塊下緣 1319.6 到論壇二段落下緣 1541（理由同 pc）。
      padding: 32px 80px 221px;
    }

    @include rwd-max('tablet') {
      --date-base: 78;
      --date-lh: 73px;
      --stair-x1: 77px;
      --stair-x2: 163px;
      --stair-row1: 73px;
      --stair-row2: 73px;
      --coreslash-w: 48.6px;
      --coreslash-h: 97.3px;
      // 目視微調（同上）：118/62 → 132/68，把上端從壓到「9」的筆畫移到它右下的空隙。
      // 2026-08-23 再往下 38：68 的位置整撇夾在「2026」與「09」之間（實測撇心 y 342.5、
      // 而「09」列與「15」列的交界在 381），視覺上不像「09/15」的那一撇。
      // ⚠ 這一撇的版位是**唯一的真值** —— 設計線的 P7a/P7b 掛在這個元素上（見
      //   forum-node-path 的 SLASH_SEL），那兩點會自己跟上，**不要**去 forum-node-path
      //   另抄一份座標。但 **P7 的 dy 不會自己跟上**（它是從撇的位置反推的），
      //   改完要重推它，並同步 test/forum-node-path.spec.ts 的 MOB_SLASH。
      --coreslash-x: 132px;
      --coreslash-y: 106px;

      padding: 32px 26px 140px;
    }
  }

  &--right {
    --date-base: 122;
    --date-lh: 114px;

    padding: 779px 0 40px;

    @include rwd-max('pc') {
      --date-base: 86;
      --date-lh: 80px;

      padding: 32px 80px 40px;
    }

    // mob 稿的議程緊接在日期組之後（間距 0）。padding 收成 0 之後仍差 6.9 ——
    // 那是日期行盒在墨跡下方的下懸，不用負值去追。
    @include rwd-max('tablet') {
      --date-base: 57;
      --date-lh: 56px;

      padding: 32px 26px 0;
    }
  }

  // 論壇四：日期只有兩行（2026／10-29，第二行往右錯開），地點與時間接在下面，整組切齊
  // 右緣；講者卡與論壇二完全相同，故那幾條規則用選擇器共用、不重寫。
  //
  // --date-lh 由稿的**兩行墨跡間距**反推（<UArtLine> 把墨跡置中於行盒）：
  //     行高 ＝ 間距 ＋ (上行墨跡高 ＋ 下行墨跡高) ÷ 2
  //   pc  間距 27.5 ＋ (70.495  + 75.9824) / 2 = 100.8 → 101
  //   pad 間距 20.5 ＋ (52.5168 + 56.6045) / 2 =  75.1 → 75
  //   mob 間距 15.6 ＋ (39.8962 + 43.001 ) / 2 =  57.0 → 57
  // ⚠️ --date-base 與畫布寬無關（素材寬 ＝ --art-w ÷ --art-base × 1em，而
  //    --art-base ≡ --date-base ≡ 字級 → 恆等於畫布的 px 寬），它只決定活文字退場時的字級。
  &--youth {
    --date-base: 105;
    --date-lh: 101px;
    --stair-x1: 115px;

    // 816 → 1018：同論壇二，pc 的 padding-top 就是稿的講者塊頂端（稿 2652:55136 的
    // 「講者」y=1018.2）。改版前 816 對應的是「講者介紹」標籤列的頂端。
    padding: 1018px 0 120px;

    @include rwd-max('pc') {
      --date-base: 82;
      --date-lh: 75px;
      --stair-x1: 92px;

      padding: 200px 80px 80px;
    }

    // padding-bottom 80 ＝ mob 稿的論壇四段尾留白。稿的「CTA 盒底 → 精彩活動標題盒頂」
    // 共 180，另外那 100 是精彩活動的段首，現已掛在 <ForumHighlights> 自己身上
    // （pc 32 / pad 64 / mob 100，見該檔的 .highlights）。
    // ⚠️ 兩邊是一組的：這裡改回 180 就會與那邊疊兩份。
    @include rwd-max('tablet') {
      --date-base: 58;
      --date-lh: 57px;
      --stair-x1: 66px;

      padding: 112px 26px 80px;
    }
  }
}

// 標眉～CTA 整落：設計稿都靠左 x=108，抽離文件流後底下的講者組不受其行數影響。
.forum-event__head {
  position: absolute;
  top: 0;
  left: 108px;

  @include rwd-max('pc') {
    position: static;
  }

  // 論壇四的標眉落在設計稿 y=200（不是 0），故 pc 要往下推；pad／mob 由 padding-top 負責。
  .forum-event--youth & {
    top: 200px;
  }

  // mob 的論壇二／論壇四把「立即報名」排到講者組之後（pad 稿仍緊接在內文下方）。
  // display: contents 讓標眉～CTA 直接成為 .forum-event 的 flex 子項，CTA 才能用 order 移到最後。
  @include rwd-max('tablet') {
    .forum-event--stair &,
    .forum-event--youth & {
      display: contents;
    }
  }
}

.forum-event__tag {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0;

  @include rwd-max('pc') {
    margin-bottom: 28px;
  }
}

.forum-event__tag-no {
  display: grid;
  place-items: center;
  width: 113px;
  height: 38px;
  background: var(--accent);
  color: #fff;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: 0.15em;
  // letter-spacing 會在最後一字後多留一格，補回它的一半才視覺置中。
  text-indent: 0.075em;

  // ⚠ pad 稿的論壇四標眉是 113×38／24px（＝pc 的值），與論壇一~三的 113×34／18px 不同，
  //   判定為稿把 pc 的標眉貼進 pad frame 沒縮，四場統一吃 34 / 18 ——
  //   同一頁面上四個標眉不該大小不一。
  @include rwd-max('pc') {
    height: 34px;
    font-size: 18px;
    line-height: 24px;
  }
}

.forum-event__tag-name {
  color: var(--accent);
  font-size: 24px;
  line-height: 32px;
  letter-spacing: 0.15em;

  @include rwd-max('pc') {
    font-size: 18px;
  }
}

// 「台積電」：設計稿字面 y=70、寬 161。
//
// ⚠️ 論壇四 pad 稿的 brand 反推字級約 38（素材 302 寬 ÷ 8 字 ＝ 37.75、字高 30.99），
//    與這裡的 49 不符 —— 稿與程式的既有落差，同標眉那條註解記的情形。
//    素材會照稿寬渲染，但行盒仍是 49 撐出來的 58.8，故幾何不變。
// ⚠️ 2026-08-26 起**沒有任何一場填 brand** —— 論壇二／四的「台積電文教基金會」照客戶要求拿掉，
//    其餘兩場本來就沒有。元件端的 v-if 與這組樣式刻意留著（文案是會改回來的東西），
//    素材 forum4-brand-{pc,pad}-1.svg／forum2-brand-mob-1.svg 也一併留在 public/。
//    要改回來只需把 brand 物件寫回 locales/section2.json，同時把下方 __title 的 margin-top
//    與 __body 的 padding-bottom 兩處補償一起還原（見那兩處的註解）。
.forum-event__brand {
  // 稿字形素材的寬度基準（見 <UArtLine>）：無單位，恆等於同一區塊的 font-size。
  --art-base: 56;

  margin: 21px 0 0;
  font-size: 56px;
  font-weight: 300;
  line-height: 1.2;

  @include rwd-max('pc') {
    --art-base: 49;

    margin: 0 0 24px;
    font-size: 49px;
  }

  @include rwd-max('tablet') {
    --art-base: 35;

    margin-bottom: 20px;
    font-size: 35px;
  }
}

// 大標：論壇二／三為 5~6 個 CJK 字、字面寬 520／621，反推 96px ＋ 0.1em 字距、行距 118。
// 論壇一是長英文名，設計稿字面寬 709，故縮到 74px ＋ 0.02em。
.forum-event__title {
  // 稿字形素材的寬度基準（見 <UArtLine>）：無單位，恆等於同一區塊的 font-size。
  // 這一組是論壇二／三／四共用的基底；論壇一（--quote）在下面另有一組。
  --art-base: 96;

  display: flex;
  flex-direction: column;
  margin: 0;
  font-weight: 300;
  font-size: 96px;
  line-height: 118px;
  letter-spacing: 0.1em;

  @include rwd-max('pc') {
    --art-base: 67;

    font-size: 67px;
    line-height: 78px;
  }

  // ⚠️ mob 稿的大標列距實測約 54（論壇二 53.75／論壇三 54.32／論壇四 54.27），
  //    這裡是 56 —— 既有的 2px 落差。刻意不改：動 line-height 會改行盒高度，
  //    連帶偏掉 forum-node-path 的 dy（見 architecture/forum-node-path.md）。
  @include rwd-max('tablet') {
    --art-base: 48;

    font-size: 48px;
    line-height: 56px;
  }

  .forum-event--quote & {
    // 稿字形素材的寬度基準：<UArtLine> 用 calc(--art-w-<斷點> / --art-base * 1em) 算寬。
    // ⚠️ **恆等於同一區塊的 font-size，且無單位** —— 帶了 px 整個 calc() 無效、素材寬塌成 0。
    //    逐斷點各給一次（不是共用 pc 的值再等比縮放）：三個斷點的稿是不同的 SVG，
    //    素材原生寬各自不同，只有「該斷點的字級」才是正確的換算基準。
    --art-base: 74;

    margin-top: 10px;
    font-size: 74px;
    line-height: 1.22;
    letter-spacing: 0.02em;

    @include rwd-max('pc') {
      --art-base: 54;

      margin-top: 0;
      font-size: 54px;
    }

    // 35：設計稿這行剛好切齊 362 的內容寬，再大一級就會斷成兩行。
    @include rwd-max('tablet') {
      --art-base: 35;

      font-size: 35px;
    }
  }

  // 2026-08-26：論壇二／四的品牌行（「台積電文教基金會」）拿掉之後，大標直接接在標眉下方。
  // pc 的 14 ＝ 稿的標眉盒底 38 → 大標墨跡頂 70，再扣掉半行距 17.65（(118 − 82.7) ÷ 2）。
  // pad／mob 維持 0：那兩個斷點的間距由標眉自己的 margin-bottom 28 撐開（稿是 20，差 8 ——
  // 那條 margin 四場共用，動它會連帶偏掉論壇一／三，故不動）。
  .forum-event--stair &,
  .forum-event--youth & {
    margin-top: 14px;

    @include rwd-max('pc') {
      margin-top: 0;
    }
  }

  .forum-event--right & {
    margin-top: 12px;

    @include rwd-max('pc') {
      margin-top: 0;
    }
  }
}

// 副標（論壇一）：設計稿字面 y=155.7、行距 62.9。
.forum-event__subtitle {
  // 同 .forum-event__title 的說明：無單位，逐斷點恆等於同一區塊的 font-size。
  --art-base: 50;

  display: flex;
  flex-direction: column;
  margin: 7px 0 0;
  font-size: 50px;
  font-weight: 300;
  line-height: 63px;
  letter-spacing: 0.02em;

  @include rwd-max('pc') {
    --art-base: 43;

    margin-top: 28px;
    font-size: 43px;
    line-height: 51px;
  }

  @include rwd-max('tablet') {
    --art-base: 32;

    margin-top: 16px;
    font-size: 32px;
    line-height: 41px;
  }
}

// 內文：設計稿 y=378（論壇二）／302（論壇三），欄寬 623，剛好三行。
.forum-event__body {
  width: 623px;
  margin: 16px 0 0;
  color: var(--color-gray-light);
  font-size: 24px;
  line-height: 44px;
  text-align: justify;

  // pad：論壇二稿 461。論壇三另有自己的 407（見下方版式限定規則）。
  @include rwd-max('pc') {
    width: auto;
    max-width: 461px;
    margin-top: 32px;
    font-size: 20px;
    line-height: 36px;
  }

  @include rwd-max('tablet') {
    max-width: none;
    font-size: 18px;
  }

  // 品牌行（「台積電文教基金會」）2026-08-26 移除後，讓出來的高度要原地補回去 ——
  // 稿是整落往上收，但那會把 CTA 連同其後的日期／講者一起拉高，而 CTA 是橘核心設計線
  // W12／R3／S3 的量測錨點（見 ~/utils/forum-node-path）。
  //
  // 補的量 ＝ 舊的「標眉盒底 → 大標盒頂」距離 − 新的距離：
  //   pc  74.2 ＝ (21 上邊距 ＋ 56×1.2 行盒) − 14（大標新的 margin-top）
  //   pad 82.8 ＝ (49×1.2 行盒 ＋ 24 下邊距) − 0；標眉的 28 前後都在，故不計
  //   mob 62   ＝ (35×1.2 行盒 ＋ 20 下邊距) − 0
  // ⚠ mob 的 __head 是 display: contents（見上方）→ 這幾個都是 flex 子項、**邊距不合併**；
  //   pc／pad 是一般流，故上面才要算合併後的值。
  //
  // 論壇二 pc／pad 的那一份**不在這裡** —— 空位夾在內文與「立即報名」之間太顯眼，
  // 已改掛到 .forum-event__cta 的 margin-bottom（按鈕貼回內文、空位落到按鈕之後）。
  // mob 留在這裡：那個斷點的 CTA 被 order: 1 排到講者組之後，補在按鈕上救不回
  // 日期／講者的位置。
  .forum-event--stair & {
    @include rwd-max('tablet') {
      padding-bottom: 62px;
    }
  }

  // 論壇四同日再改一次：大標從一行換成兩行（「跨世代共問／AI時代共答」，與論壇二同一組
  // 素材），第二行自己就吃掉了品牌行讓出的空間，故補償要按斷點各自扣回去：
  //   pc  74.2 − 118（第二行 ＝ 1 個 118 行盒）＜ 0 → 歸零。缺的 43.8 由 CTA 往下吸收，
  //       落點回到稿的 466（實作 468，那 2 是 __body 的 margin-top 16 對稿 14 的既有差）。
  //       ⚠ pc 的 __head 是絕對定位 → 段落總高不變，位移的只有 CTA 一顆（設計線的 R3）。
  //   pad 82.8 − 78（78 ＝ pad 的行盒）＝ 4.8 → CTA 以下完全不動。
  //   mob 維持 62：舊的「青年永續築夢論壇」在 338 的內容欄本來就折成兩行（2×56 ＝ 112），
  //       換成兩行素材後高度一模一樣，沒有多出來的量要扣。
  .forum-event--youth & {
    padding-bottom: 0;

    @include rwd-max('pc') {
      padding-bottom: 4.8px;
    }

    @include rwd-max('tablet') {
      padding-bottom: 62px;
    }
  }

  // 論壇四的內文比論壇二寬：pc 785（稿）、pad／mob 則是內容欄滿寬。
  // ⚠ pad／mob 一定要把 width 寫回 auto —— 這一層的特異度（0,2,0）比基底的 rwd 區塊
  //   （0,1,0）高，不覆寫的話 pc 的 785px 會一路帶到窄斷點去爆版。
  .forum-event--youth & {
    width: 785px;

    @include rwd-max('pc') {
      width: auto;
      max-width: none;
    }
  }

  // 論壇三的 pad 內文比論壇二窄：稿 407（4 行 × 36 ＝ 144 高）。
  // ⚠ 這一層是 0,2,0，會壓過基底 rwd 區塊（0,1,0）裡的值 —— 包含 tablet 那條
  //   `max-width: none`。少了下面這個重設，mob 會被 407 綁死（同 __body 對
  //   論壇四踩過的那個坑）。
  .forum-event--right & {
    @include rwd-max('pc') {
      max-width: 407px;
    }

    @include rwd-max('tablet') {
      max-width: none;
    }
  }
}

// CTA：設計稿 y=542。盒子與配色都在 <UBtn>（variant="primary"），這裡只給尺寸與版位。
//
// ⚠️ 這個 class 是 ForumCorePath 的量測錨點（~/utils/forum-node-path 的 W12／R3／S3，
//    讀它的 rect 定位）—— 盒子幾何一動，那條橘核心設計線就跟著偏。
.forum-event__cta {
  --u-btn-w: 371px;
  --u-btn-h: 80px;

  margin: 32px 0 0;

  @include rwd-max('pc') {
    --u-btn-w: 296px;
    --u-btn-h: 70px;
  }

  // mob：滿版且排到最後（見 .forum-event__head 的 display: contents）。
  @include rwd-max('tablet') {
    --u-btn-w: 100%;

    order: 1;
  }

  // 論壇四的按鈕在 pc 稿是 440 寬（pad／mob 與論壇二同尺寸）。
  // 改吃 CSS 變數後這裡只覆蓋 pc 那一個值就夠 —— 原本得把 pad／mob 的寬度再寫一次，
  // 是因為 width 會被 `.forum-event--youth .forum-event__cta`（0,2,0）壓過基底的
  // rwd 區塊（0,1,0）；現在用 rwd-min('pc') 限定在 pc 區間，與基底的 rwd-max('pc')
  // 不重疊，特異度陷阱就消失了（同 __body 仍有的那個坑）。
  .forum-event--youth & {
    @include rwd-min('pc') {
      --u-btn-w: 440px;
    }
  }

  // 論壇二：品牌行讓出的高度掛在**按鈕下方**（原本補在 __body 的 padding-bottom，
  // 2026-08-26 改到這裡）。這樣「立即報名」貼回內文，空位落在按鈕之後 ——
  // __head 的總高不變，故 CTA 以下的日期／地點／講者全部留在原位。
  // 量值與 __body 那組同源（見該處推導）：pc 74.2、pad 82.8。
  // ⚠ mob 不在此列：CTA 在那個斷點被 order: 1 排到講者組之後，補在這裡會把空位加到
  //   整段的尾巴、救不回日期／講者，故 mob 的那 62 仍留在 __body。
  // ⚠ __head 在 pad 是 flex 子項（獨立的格式化脈絡）→ 這個 margin 不會塌出 __head 之外，
  //   高度確實補得回來；pc 的 __head 是絕對定位，本來就不影響任何東西。
  .forum-event--stair & {
    @include rwd-min('pc') {
      margin-bottom: 74.2px;
    }

    @include rwd-min('tablet') {
      @include rwd-max('pc') {
        margin-bottom: 82.8px;
      }
    }
  }
}

// 佔位隱藏（報名未開放）：只關掉可見性，盒子與所有 margin 照舊 ——
// ForumCorePath 的 W12／R3／S3 量得到同一個 rect，論壇二掛在按鈕下方的
// margin-bottom 也還在，故橘核心設計線與 CTA 以下的版位完全不動。
// visibility 同時讓它不可點、不可 focus，故不必再補 pointer-events。
.forum-event__cta--hidden {
  visibility: hidden;
}

// 定位層本身不佔高度，內部三組各自吃設計稿座標。
.forum-event__meta {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  @include rwd-max('pc') {
    position: static;
    width: auto;
  }

  // 論壇二的日期與地點在 pad／mob 稿是左右交錯疊在一起的，故這層仍當定位框。
  .forum-event--stair & {
    @include rwd-max('pc') {
      position: relative;
      margin-top: 100px;
    }

    // mob：稿的間距 70（內文盒底 → 地點墨跡頂），實作的地點墨跡比盒頂低 6.5 → 63.5。
    @include rwd-max('tablet') {
      margin-top: 63.5px;
    }
  }

  // 論壇四：日期／時間／地點是一整落右切齊的直排，pad／mob 接在 CTA 之後。
  .forum-event--youth & {
    @include rwd-max('pc') {
      position: relative;
      margin-top: 111px;
    }

    // mob：稿的間距 60（內文盒底 → 日期墨跡頂），實作的日期墨跡比盒頂低 8 → 52。
    @include rwd-max('tablet') {
      margin-top: 52px;
    }
  }

  // 論壇一的這層以英文引言開頭（緊接副標），故留白掛在引言與日期身上，不掛這層。
  // mob 的論壇三跟論壇二一樣是交錯疊放（地點在右上、日期在左下），pad 則是右切齊的直排。
  .forum-event--right & {
    @include rwd-max('pc') {
      margin-top: 60px;
    }

    @include rwd-max('tablet') {
      position: relative;
      margin-top: 80px;
    }
  }
}

// 英文引言（論壇一）：設計稿 x=718 / 字面 y=720.9，欄寬 454 切齊右緣 1172、右對齊。
.forum-event__quote {
  // 稿字形素材的寬度基準（見 <UArtLine>）：無單位，恆等於同一區塊的 font-size。
  --art-base: 40;

  position: absolute;
  top: 470px;
  left: 718px;
  display: flex;
  flex-direction: column;
  width: 454px;
  margin: 0;
  font-size: 40px;
  font-weight: 300;
  line-height: 50px;
  text-align: right;

  // pad／mob 稿把引言收回副標下方、改靠左。
  @include rwd-max('pc') {
    --art-base: 28;

    position: static;
    width: auto;
    margin-top: 32px;
    font-size: 28px;
    line-height: 35px;
    text-align: left;
  }

  @include rwd-max('tablet') {
    --art-base: 22;

    margin-top: 28px;
    font-size: 22px;
    line-height: 28px;
  }
}

// 日期大字：ForumCorePath 的錨點元素（見檔頭）。
// 字級由設計稿數字字框反推（論壇一寬 234.9／高 73.6，論壇二、三為其 1.253／1.165 倍）；
// 設計稿字體的數字比 Noto Sans TC 寬，故取寬、高兩種反推值的折衷。
// ⚠️ 換上稿字形素材後，--date-base 只剩兩個作用：撐行盒（line-height 另給）與當
//    --art-base；畫面上的字寬完全由素材決定。反推值仍留著 —— 素材缺件時會退回活文字。
//    唯一實測與稿不符的是**論壇二 mob**：稿的字面高 42.4 反推字級約 60，這裡是 78
//    （素材照稿寬渲染，故看起來會比行距鬆）。要修得連 --stair-*／--date-lh 一起重推。
// 版位：論壇一字面 (108, 587.4)、論壇二 (301, 769)、論壇三右緣切齊 1172、字面 y=434。
//
// 內容是**逐行的稿字形素材**（見 template 的 dateLines）。仍是 grid 而非 flex：
// 階梯式（論壇二）的三列行高由 grid-template-rows 給（127／114／auto），
// 那三個值決定整塊的高度 ＝ 設計線 S1~S3 的錨點，不能交給行盒自己長。
.forum-event__date {
  // 稿字形素材的寬度基準（見 <UArtLine>）：無單位，恆等於本區塊的 font-size ——
  // 兩者共用 --date-base 就是為了這個等式（見檔案上方 .forum-event 的說明）。
  --art-base: var(--date-base);

  position: absolute;
  display: grid;
  grid-template-columns: repeat(4, max-content);
  width: max-content;
  font-size: var(--date-size);
  font-weight: 300;
  line-height: var(--date-lh);

  // pad／mob 退回流排版，但仍要當那一撇的定位基準 → relative 而非 static。
  // relative 且不給位移時的排版結果與 static 完全相同（本身已是 grid，不影響子項）。
  // __venue 是它的**兄弟**、不是子項，故它的絕對定位基準不受影響。
  //
  // ⚠️ 「不給位移」要靠下面每個 variant 各自 `inset: auto` 才成立 —— 本規則放不了：
  //    variant 的 `.forum-event--x .forum-event__date`（0,2,0）贏過這裡的
  //    `.forum-event__date`（0,1,0），而 media query 不加權重。少了那道重設，
  //    pc 稿的 top/left 會被 relative 當成**相對位移**吃下去（論壇四是 left:714px）
  //    → 日期大字被推出視窗右外側，body.scrollWidth 撐到 1063px、整頁被縮成電腦尺寸。
  @include rwd-max('pc') {
    position: relative;
  }

  .forum-event--quote & {
    top: 571px;
    left: 108px;

    // pad／mob 稿改切齊右緣，且緊接在英文引言之後。
    @include rwd-max('pc') {
      inset: auto; // 見上方 position:relative 的說明
      margin: 88px 0 0 auto;
    }
  }

  // 階梯式：三行逐行往右下，位移 ＝ 設計稿字面 x 差（09 ＋154、15 ＋324）與 y 差（127.3、114.5）。
  .forum-event--stair & {
    top: 749px;
    left: 301px;
    grid-template-columns: repeat(2, max-content);
    grid-template-rows: var(--stair-row1) var(--stair-row2) auto;

    // pad／mob 稿把階梯挪回左緣，地點則絕對定位到右上角（見 __venue）。
    @include rwd-max('pc') {
      inset: auto; // 見上方 position:relative 的說明
      margin-top: 46px;
    }

    @include rwd-max('tablet') {
      margin-top: 50px;
    }
  }

  .forum-event--right & {
    top: 415px;
    right: 108px;

    @include rwd-max('pc') {
      inset: auto; // 見上方 position:relative 的說明
      margin-left: auto;
    }

    // mob 稿改成兩階：2026 靠左，月／日那行再往右下錯開（位移 62.94，烤在素材畫布裡）。
    @include rwd-max('tablet') {
      margin: 92px 0 0;
    }
  }

  // 論壇四：維持基底的兩行格線（2026 ／ 10-29 四），第二行往右錯開（pc 116.5／pad 86.9／
  // mob 66，烤在素材畫布裡）。刻意不走 --stair 那組規則 —— 那會把「10」與「29」拆成兩行。
  //
  // pc 的 left 706 ＝ 內容欄右界 1172 − 畫布寬 466（稿的整組就是右切齊）。
  // ⚠️ top 702 沿用改版前的值 —— 新稿的節點座標是容器相對的，量不到它在 1280 稿上的絕對 y。
  //    行高 98 → 101 讓第一行墨跡在盒內下移 1.6px，整組位置不動（本層 pc 是絕對定位）。
  .forum-event--youth & {
    top: 702px;
    left: 706px;

    // pad／mob：整組切齊右緣（稿的日期組右緣 ＝ 內容欄右界）。
    @include rwd-max('pc') {
      inset: auto; // 見上方 position:relative 的說明
      margin-left: auto;
    }

    // mob 的畫布寬 362 ＝ 414 稿的滿內容欄，視窗一窄就撐出欄外。
    // ⚠️ 基底的 `width: max-content` ＋ `max-content` 欄寬會讓 <UArtLine> 的
    //    `max-width: 100%` **咬不住** —— 那個 100% 是 grid area（恆等於素材原生寬 362），
    //    不是內容欄。實測 375 手機：素材右緣落在 388，「10/29 四」的尾巴被切掉。
    //    改成「格線填滿內容欄 ＋ 單一 minmax(0, 1fr) 欄」後 100% 才等於內容欄，
    //    素材依 aspect-ratio 等比縮（375 → 89%、320 → 70%），且畫布右緣本來就是欄右緣
    //    → 縮完仍自動切齊右緣，不必再補水平對齊。
    //    414 真機（無實體捲軸）內容欄正好 362 → 不觸發，維持 100%。
    @include rwd-max('tablet') {
      width: auto;
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

// 日期的一「行」。每行橫跨整條格線（欄數在 __date 上，2 或 4，對這裡都一樣）。
//
// ⚠️ align-self: start 是必要的，不是預設值的贅寫。grid item 預設 stretch，會被拉成
//    **grid 列的高度**；階梯式的列高是 127／114（見 __date 的 grid-template-rows），
//    與行盒的 124 不同 → 素材（::after 的 top: 50%）會在錯的盒子裡置中，
//    實測第一行往下 1.5px、第二行往上 5px。start 讓盒子回到自己的行盒高度。
// ⚠️ 沒有水平對齊規則（justify-self）也沒有 --stair-x* 位移 —— 論壇一三四的錯位與
//    對齊邊**烤在素材畫布裡**（整組共用畫布），CSS 再對齊一次就會位移兩次。
//    論壇二例外，見下面那條。
.forum-event__date-line {
  grid-column: 1 / -1;
  align-self: start;
}

// 論壇二的階梯：素材是「各列貼齊自己的墨跡」，錯位留在 CSS 這邊。
// 值就是原本掛在 __date-mm / __date-dd 上的那兩個，實測即稿的字面 x 差
// （pc 154／323.914 對上 154／324、pad 98.85／215.25 對上 99／215）。
.forum-event--stair .forum-event__date-line:nth-child(2) {
  margin-left: var(--stair-x1);
}

.forum-event--stair .forum-event__date-line:nth-child(3) {
  margin-left: var(--stair-x2);
}

// 論壇二 09/15 的那一撇：不是字元 —— 稿上 206.1 高，是 --date-size（105）的兩倍。
// 稿的 Vector 是等寬直線（四角端邊與長邊內積 ≈ 0 → 端點切口垂直於脊線，即 butt cap），
// 與垂直軸夾角 26.7°；三個斷點的 w/h 都是 0.50，故角度寫死、尺寸吃逐斷點的 --coreslash-*。
//
// 外框（本層）：**刻意不套任何 transform** —— 它的右上／左下兩角正好是脊線的兩端，
// ForumCorePath 讀它的 rect 推導觸發窗口（見該檔的 syncSlashWindow）。
// transform 掛在外框上會讓 rect 隨畫出比例塌掉，窗口就算不出來。
.forum-event__date-coreslash {
  position: absolute;
  top: var(--coreslash-y);
  left: var(--coreslash-x);
  width: var(--coreslash-w);
  height: var(--coreslash-h);
  pointer-events: none;

  // 那一撇本身＝外框的對角線（長 ＝ √(w² + h²)，由 hypot 算不出來，故用 h / cos26.7° 表示）。
  // transform-origin 釘在**右上**（核心是往左下走的，那裡是進入端）→ scaleY 讓它往左下長出來，
  // 往回捲自然收回。顏色吃 currentcolor：畫完之後它與 09 / 15 同色，就是日期的一部分。
  // 脊寬取稿的 7.637 ÷ 105（pc）＝ --date-size 的 0.0727 —— 這一項確實隨字級走。
  i {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: calc(var(--date-size) * 0.0727);
    height: calc(var(--coreslash-h) / 0.8934); // 0.8934 ＝ cos(26.7°)
    background: currentcolor;
    transform: translateX(50%) rotate(26.7deg) scaleY(var(--slash-draw, 0));
    transform-origin: 50% 0;
  }
}

// 地點時間組：字級由設計稿 CJK 字面寬反推（每字 43.4／47.5／51.9），行距取設計稿字面行進距。
// 論壇一在日期下方靠左，論壇二在日期上方、論壇三在日期下方，兩者都切齊右緣 1172。
// pad／mob 三場的字級一致（30／28），差別只在版位：論壇一、三跟著日期切齊右緣往下排，
// 論壇二則絕對定位在日期階梯的右上角（兩者在設計稿上是交錯疊放的）。
.forum-event__venue {
  position: absolute;
  display: flex;
  flex-direction: column;
  margin: 0;
  font-weight: 300;

  // 字級都寫在各版式底下：pc 的 .forum-event--x .forum-event__venue 特異度較高，
  // 寫在這一層的 rwd 字級會被它蓋掉。
  .forum-event--quote & {
    // 稿字形素材的寬度基準（見 <UArtLine>）：無單位，恆等於同一區塊的 font-size。
    // __time 是本層的子項、沒有自己的 font-size，故它直接繼承這個值。
    // ⚠️ pad 刻意沒有 —— pad 稿把地點兩行併成一行，與這裡的兩個 span 對不起來
    //    （見 ForumEvent type 的 venue 說明），那個斷點維持活文字。
    --art-base: 43;

    top: 776px;
    left: 108px;
    font-size: 43px;
    line-height: 58px;

    @include rwd-max('pc') {
      position: static;
      align-items: flex-end;
      margin: 12px 0 0 auto;
      font-size: 30px;
      line-height: 44px;
      text-align: right;
    }

    @include rwd-max('tablet') {
      --art-base: 28;

      margin-top: 8px;
      font-size: 28px;
      line-height: 39px;
    }
  }

  .forum-event--stair & {
    // 同 --quote 的說明。pad／mob 稿的地點組與 pc 不同，故只有 pc 有素材：
    //   pad 稿 —— 場地名拆成「集思台大／會議中心」兩行，字級約 41（墨跡四字 179 寬）。
    //   mob 稿 —— 場地名同樣拆兩行、字級約 31，廳名與時間另成一組小字（墨跡高
    //             16.7／15.8 ⇒ 約 19）；本層是「三行同一字級」，兩者對不起來。
    // （2026-08-25 校對定版稿時實測；照稿做要先把 venue 改成逐斷點文案，見
    //   ForumEvent type 的 venue 說明。）
    // ⚠️ 稿的列距實測 63、這裡是 62 —— 既有的 1px 落差，同 mob 大標那組。不改：
    //    動 line-height 會改行盒高度、帶偏 forum-node-path 的 dy。
    --art-base: 47;

    top: 690px;
    right: 108px;
    align-items: flex-end;
    font-size: 47px;
    line-height: 62px;

    @include rwd-max('pc') {
      top: 0;
      right: 0;
      // 8.2em ＝ 設計稿地點欄的字數上限；不收窄會橫向壓到左側的日期階梯。
      max-width: 8.2em;
      font-size: 30px;
      line-height: 44px;
      text-align: right;
    }

    @include rwd-max('tablet') {
      font-size: 28px;
      line-height: 39px;
    }

    // 窄機（320–374.98）：稿的「地點釘右上、日期階梯在左下」交錯版式在這個寬度撞在
    // 一起 —— 320 實測兩者垂直重疊 67px（地點 10360–10477、日期 10410–10629）。
    // 交錯本來就靠「內容欄夠寬、階梯第一階夠窄」成立，寬度一縮就沒有空隙可讓。
    // 改成排在日期之後、維持右切齊（max-width 8.2em 沿用上一層，斷行不變）。
    @include rwd-max(375px) {
      position: static;
      margin: 12px 0 0 auto;
    }
  }

  .forum-event--right & {
    // 同 --quote 的說明。pad／mob 稿的場地名與 pc 不同（pc「集思台大會議中心」、
    // pad「台灣大學集思會館」、mob 拆三行），故只有 pc 有素材。
    --art-base: 52;

    top: 654px;
    right: 108px;
    align-items: flex-end;
    font-size: 52px;
    line-height: 70px;

    @include rwd-max('pc') {
      position: static;
      margin: 12px 0 0 auto;
      font-size: 30px;
      line-height: 44px;
      text-align: right;
    }

    // mob 稿與論壇二同款交錯：地點釘在右上角，日期在它左下方。
    @include rwd-max('tablet') {
      position: absolute;
      top: 0;
      right: 0;
      max-width: 8.2em;
      margin: 0;
      font-size: 28px;
      line-height: 39px;
    }
  }

  // 論壇四：接在日期兩行之下，整組切齊右緣。字級由稿反推 —— pc 的地點 10 個字寬 438.85
  // → 43.9/字；行距取兩行的實際間距（pc 70、pad 56、mob 35）。
  // 論壇四：地點（國立成功大學）與時間（2:00－4:00PM）接在日期兩行之下，三個斷點都有素材。
  //
  // 素材與日期共用同一張畫布（pc 466／pad 347.253／mob 362），墨跡在畫布內的 x 就是稿的
  // 位置 —— 稿的地點／時間是切齊「整組的左緣」而不是內容欄左緣（pad 內縮 3.4、pc 內縮 1），
  // 共用畫布才對得起來，故本層不另外做水平對齊（flex-end 對定寬子項無作用）。
  //
  // 行距同樣由稿的兩行墨跡間距反推（公式見 .forum-event--youth 的 --date-lh）：
  //   pc  22.9 ＋ (46.0759 + 41.4248) / 2 = 66.7 → 67
  //   pad 20.9 ＋ (34.4174 + 31.001 ) / 2 = 53.6 → 54
  //   mob 13.1 ＋ (24.9465 + 23.4258) / 2 = 37.2 → 37
  //
  // 與日期組的距離（稿量「日期第一行墨跡頂 → 地點墨跡頂」，扣掉兩邊墨跡在行盒內的內縮）：
  //   pc  203.98 − 2×101 − (67−46.0759)/2 + (101−70.495 )/2 =   6.8 → top 911（702 + 209）
  //   pad 152.24 − 2×75  − (54−34.4174)/2 + ( 75−52.5168)/2 =   3.7 → margin-top 4
  //   mob 163.26 − 2×57  − (37−24.9465)/2 + ( 57−39.8962)/2 =  51.8 → margin-top 52
  .forum-event--youth & {
    --art-base: 44;

    top: 911px;
    right: 108px;
    align-items: flex-end;
    font-size: 44px;
    line-height: 67px;
    text-align: right;

    @include rwd-max('pc') {
      --art-base: 35;

      position: static;
      margin: 4px 0 0 auto;
      font-size: 35px;
      line-height: 54px;
    }

    @include rwd-max('tablet') {
      --art-base: 28;

      margin-top: 52px;
      font-size: 28px;
      line-height: 37px;
    }
  }
}

// 時間一律排在地點之下 ＝ DOM 順序，故本層不需要任何規則。
//
// ⚠️ 2026-08-25 之前這裡有一條 `.forum-event--youth & { @include rwd-min('tablet')
//    { order: -1 } }`，把論壇四 pc／pad 的時間提到地點之上（當時的 pc 稿如此、mob 稿相反）。
//    新稿（2671:81939 / 2671:82584 / 2652:53055）三個斷點都是「國立成功大學 → 2:00－4:00PM」，
//    那條規則整個移除。要復原就是把它加回來，不必動 template。

// 講者組：論壇一設計稿 x=463 寬 709，論壇二 x=455 寬 528、論壇四 x=108 寬 567。
//
// 三場**同一個版式**（照片絕對定位在左上、標籤絕對定位、文字欄靠右），只有數字不同：
//
//   | | 照片 | 文字欄左緣 | __speaker padding-top | 標籤 top |
//   | 論壇一（quote）    | 268 |  312 | 102 | 59 |
//   | 論壇二四 pc        | 280 |  316 | 103 | 39 |
//   | 論壇二四 pad       | 233 |  269 |  81 | 17 |
//   | 論壇二四 mob       | 180 |  204 |  68 | 22 |
//
// ⚠️ 2026-08-17 之前論壇二／四是「兩張並排卡片」（照片在上、文字在下），由
//    `.forum-event__speaker--card` 驅動，而那個 class 又由 `speakers.length > 1` 決定。
//    設計改成單人後整套換掉 —— 版式改由 layout modifier 決定，**不要再用人數判斷**。
.forum-event__speakers {
  position: relative;

  .forum-event--quote & {
    width: 709px;
    margin-left: 463px;

    // pad／mob 稿改單欄直排：照片 → 講者介紹 → 姓名 → 介紹，順序見下方各元素的 order。
    @include rwd-max('pc') {
      display: flex;
      flex-direction: column;
      width: auto;
      margin: 60px 0 0;
    }

    @include rwd-max('tablet') {
      margin-top: 88px;
    }
  }

  // ⚠️ 這一層**不可以有 padding-top** —— 「講者介紹」標籤是 absolute、以本層的 padding box
  //    為基準，補上內距只會把照片推下去、標籤留在原地（實測 pc 錯開 20、論壇四錯開 202）。
  //    垂直位置一律交給外面：pc 給 .forum-event 的 padding-top，pad／mob 給本層的 margin。
  //    這也讓「本層的 rect ＝ 照片框的 rect」成立，設計線的 Q8~Q10／P8~P10 直接吃它。
  //
  // 論壇二：pc 稿 x=455 寬 528（280 ＋ 36 ＋ 212）；pad 稿 x=220（＝內容欄左緣 +140，
  // **不是**切齊右緣 —— 稿上距右緣還有 7）、寬 461（233 ＋ 36 ＋ 192）；mob 滿版。
  //
  // pad／mob 是流排版，margin 由「稿的墨跡間距」反推（稿的絕對 y 對不上實作，見
  // architecture/forum-node-path.md 第七節第 7 條）：
  //   pad 論壇二 稿間距 55.2，實作日期組墨跡收在 986.8、__meta 盒底 996.8 → 45
  //   mob 論壇二 稿間距 82.8，實作墨跡收在 777.7、__meta 盒底 793      → 68
  .forum-event--stair &,
  .forum-event--youth & {
    width: 528px;
    margin-left: 455px;

    @include rwd-max('pc') {
      width: 461px;
      margin: 45px 0 0 140px;
    }

    @include rwd-max('tablet') {
      width: auto;
      margin: 68px 0 0;
    }
  }

  // 論壇四的講者組與論壇二一模一樣，差別只有水平位置（pc 稿 x=108、pad 稿 x=80 ＝內容欄
  // 左緣）與文字欄寬（251，故整組 567／520）。
  // 必須寫在上面那組之後才蓋得過去（兩者特異度同為 0,2,0）。
  //   pad 稿間距 83，實作地點墨跡收在 1044.1、__meta 盒底 1057.8 → 69
  //   mob 稿間距 40（時間墨跡底 → 照片上緣），實作時間墨跡比 __meta 盒底高 46.3 → 31.7
  //     （2026-08-17 之前是 78 —— 那時沒有 mob 論壇四的版面稿可量，借用另外三處的 83）
  .forum-event--youth & {
    width: 567px;
    margin-left: 108px;

    @include rwd-max('pc') {
      width: 520px;
      margin: 69px auto 0 0;
    }

    @include rwd-max('tablet') {
      width: auto;
      margin: 31.7px 0 0;
    }
  }
}

// 標籤脫離流排版，才不會被論壇一「照片左、標籤右且下移 58.7」的錯位版式綁住。
.forum-event__speaker-label {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  font-size: 20px;
  line-height: 32px;
  letter-spacing: 0.15em;

  @include rwd-max('pc') {
    position: static;
  }

  @include rwd-max('tablet') {
    font-size: 16px;
  }

  .forum-event--quote & {
    top: 59px;
    left: 312px;

    // pad／mob 稿：標籤排在照片之後、姓名之前。
    @include rwd-max('pc') {
      order: 2;
      margin-bottom: 16px;
    }
  }

  // 論壇二／四：標籤是文字欄的第一行，落在照片右側（稿三斷點的 top／left 見 __speakers
  // 的對照表）。base 在 rwd-max('pc') 把它改回 static，這裡要蓋回 absolute。
  .forum-event--stair &,
  .forum-event--youth & {
    top: 39px;
    left: 316px;

    @include rwd-max('pc') {
      position: absolute;
      top: 17px;
      left: 269px;
    }

    // mob 稿的標籤字面高 34（＝ 20px 字級的行盒），不是論壇一 mob 的 16。
    @include rwd-max('tablet') {
      top: 22px;
      left: 204px;
      font-size: 20px;
      line-height: 34px;
    }

    // 窄機（320–374.98）：退回流排版，成為講者組的第一行（見 __speaker 的說明）。
    // 本層是 __speakers 的子項、照片在 __speaker 之內，兩者不同層 → 無法用 order
    // 互換，故順序是「講者介紹 → 照片 → 頭銜 → 姓名」。
    @include rwd-max(375px) {
      position: static;
      margin-bottom: 16px;
    }
  }
}

// 論壇一：照片絕對定位在左，文字欄從 x=312 起（設計稿 268 ＋ 44 欄距）。
// 論壇二／四同構，只是數字不同（對照表見 .forum-event__speakers）。
//
// ⚠ padding-top 102 ＝ 姓名相對講者組頂端的設計稿位移，**刻意寫成本層的 padding、
//   不是姓名的 margin-top**：這一層與 .forum-event__speakers 都沒有上邊框／上內距，
//   姓名又是唯一的頭一個流內子項（<picture> 內的 img 絕對定位後不產生行框），
//   margin-top 會一路 collapse 到 .forum-event 的 padding-top 才停 ——
//   結果是整個講者組下沉 102，連帶把絕對定位的照片與「講者介紹」標籤一起推下去
//   （姓名與 bio 反而剛好落在對的位置，所以看起來只有照片與標籤跑版）。
//   換成 padding 就同時擋掉 collapse、又不影響照片／標籤（絕對定位以 padding box 為基準，
//   top: 0 仍是本層上緣）。
.forum-event__speaker {
  position: relative;
  min-height: 268px;
  padding: 102px 0 0 312px;

  // 論壇一在 pad／mob 沒有自己的版位，讓照片／標籤／姓名／介紹直接參與講者組的直排。
  .forum-event--quote & {
    @include rwd-max('pc') {
      display: contents;
    }
  }

  // 論壇二／四：稿的順序是「頭銜 → 姓名」，但 DOM 是「姓名 → 頭銜」（論壇一的順序，
  // 且姓名要先於 bio）—— 改成 flex column 用 order 換位，不動 template。
  // ⚠ 不要改成 display: contents 讓子項直接參與 __speakers —— 那會讓本層 rect 全 0，
  //   mob 的 P9／P10 就量不到（見 architecture/forum-node-path.md 第四節）。
  .forum-event--stair &,
  .forum-event--youth & {
    display: flex;
    flex-direction: column;
    min-height: 280px;
    padding: 103px 0 0 316px;

    @include rwd-max('pc') {
      min-height: 233px;
      padding: 81px 0 0 269px;
    }

    @include rwd-max('tablet') {
      min-height: 180px;
      padding: 68px 0 0 204px;
    }

    // 窄機（320–374.98）：稿只畫到 414，那個 204 的左內距在這裡會把文字欄壓到
    // 320 − 26×2 − 204 ＝ **48.7px** —— 頭銜折成 8 行兩字、姓名（nowrap）直接溢出、
    // 標籤與頭銜疊 22px（實測 320 寬）。改成直排：照片與文字各自吃滿內容欄。
    // 版位同步改的還有 __photo-box（改流排版）與 __speaker-label（改 static）。
    // 稿沒有這個尺寸，這裡只求可讀，不對稿。
    @include rwd-max(375px) {
      min-height: 0;
      padding: 0;
    }
  }
}

// 照片框：尺寸、版位、flex／grid 指派全部收斂到這一層 —— 底下的實圖與 placeholder 因此
// 各只需要一條「填滿它」的規則。原本這組數字（268 / 233 / 250 / 210 / 180）散在
// :deep(.forum-event__photo) 的三組覆寫、.u-pic 的兩條 order／grid-row，外加
// .forum-event__photo-slot 鏡射一份，共六處。
//
// ⚠️ 靜態版式必須寫 position: relative —— 內層照片改絕對定位後，它的 containing block 是
//    「最近的定位祖先」；<picture>（.u-pic）不帶 position，所以基準會落在本層身上。
//    本層忘了定位的話照片會一路錨到 .forum-event__speakers 去。
// ⚠️ overflow: hidden 做兩件事：裁掉刷過去的藍塊（見 .forum-event__photo-mask），
//    以及擋掉 aspect-ratio 的 content-based 最小高度（<picture> 是 inline 的）。
// ⚠️ 本層是 ForumCorePath 那四個照片錨點（pc W5／W17、pad Q5、mob P5）的**新家**：
//    它們讀 `.forum-event__photo, .forum-event__photo-slot` 的 rect，而那兩者現在 inset: 0
//    於本層 → rect 等於本層的 rect。動本層的尺寸就等於動那四個節點的錨點，
//    見 architecture/forum-node-path.md。
.forum-event__photo-box {
  // 刷過去時那條橘色前緣的粗細。從稿的附圖量的：橘帶約佔照片寬 4.8%（268 → 約 13）。
  // ⚠️ 參考影片（Google Drive）讀不到，這三個數字是估計值 —— 要對稿就改這裡。
  --photo-mask-edge: 12px;

  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 268px;
  aspect-ratio: 1 / 1;
  overflow: hidden;

  @include rwd-max('pc') {
    --photo-mask-edge: 10px;
  }

  @include rwd-max('tablet') {
    --photo-mask-edge: 8px;
  }

  // 論壇一在 pad／mob 退回流排版：照片排第一個，與下方的「講者介紹」標籤留 28 間距。
  .forum-event--quote & {
    @include rwd-max('pc') {
      position: relative;
      order: 1;
      width: 233px;
      margin-bottom: 28px;
    }
  }

  // 論壇二／四：同樣是絕對定位在左上（沿用 base），只有尺寸不同。
  .forum-event--stair &,
  .forum-event--youth & {
    width: 280px;

    @include rwd-max('pc') {
      width: 233px;
    }

    @include rwd-max('tablet') {
      width: 180px;
    }

    // 窄機（320–374.98）：退回流排版，排在標籤之後、頭銜之前（見 __speaker 的說明）。
    // ⚠️ 不必重設 top／left —— base 的 0 / 0 在 relative 下就是「不位移」。
    @include rwd-max(375px) {
      position: relative;
      margin-bottom: 24px;
    }
  }
}

// UPic 把 classname 掛在內層 <img>，scoped 選不到，故用 :deep。
// 尺寸與版位都在 .forum-event__photo-box 上，這裡只負責填滿它 —— 故一條規則走完三個斷點
// 與兩種版式。外層 <picture> 塌成零高也不再有影響（盒子自帶尺寸）。
// height: 100% 要壓過 UPic 全域的 .u-pic-img { height: auto }：:deep 編出來是
// [data-v-x] .forum-event__photo（0,2,0），贏過 .u-pic-img（0,1,0）。
:deep(.forum-event__photo) {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// 照片 placeholder：與實圖同框（兩者都 inset: 0 於照片框），中央印編號方便日後對照補圖。
.forum-event__photo-slot {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border: 1px dashed var(--accent);
  color: var(--accent);
  font-size: 32px;
  letter-spacing: 0.1em;
}

// 藍塊：inactive 時蓋住整張照片，active 時帶著橘色前緣往下退出照片框外
// （由 .forum-event__photo-box 的 overflow: hidden 裁掉）。稿的說法是「色塊刷過」——
// 那條橘線就是橘核心撞上來把藍塊推下去的前緣。
//
// ⚠️ 橘線刻意**擺在照片框之外**（top 負一個線寬），故 inactive 是**純藍方塊、沒有橘線**
//    （＝稿上最右邊那一格）；橘線是一開始位移才從上方帶進來的，也在走完時一起被裁掉。
//    因此 translateY(100%) 就夠：本層比照片框高了正好一個線寬（top 負、bottom 0），
//    100% 會把藍塊與橘線一起送出框外。改成 inset: 0 的話 inactive 就會露出橘線。
// ⚠️ 一定要用 translateY，不能改 scaleY 或 height：scaleY 會把橘線一起壓扁（越刷越細），
//    height 動畫又不吃合成器。
// 0.6s cubic-bezier(0.22, 1, 0.36, 1) ＝ 稿寫的「timing function smooth」：起步快、尾端漸止，
// 對得上「橘方塊撞上來把藍塊推下去」的因果感。
.forum-event__photo-mask {
  position: absolute;
  inset: calc(-1 * var(--photo-mask-edge)) 0 0;
  border-top: var(--photo-mask-edge) solid var(--accent);
  background: var(--color-blue);
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}

.forum-event__photo-box.is-revealed .forum-event__photo-mask {
  transform: translateY(100%);
}

// 論壇一：姓名字面落在講者組頂端下方 112.7（那 102 的位移在 .forum-event__speaker 的
// padding-top，見該處說明）。卡片版式改排在頭銜之後（設計稿是頭銜在上）。
.forum-event__speaker-name {
  // 稿字形素材的寬度基準（見 <UArtLine>）：無單位，恆等於同一區塊的 font-size。
  // 四場姓名都有素材，且**逐斷點各一份**（論壇一見下方 --quote、論壇二／四見 --stair）。
  --art-base: 42;

  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: 42px;
  font-weight: 300;
  line-height: 56px;

  // 論壇一：姓名兩行都是稿字形素材（英文名 ＋ 中文名）。素材共用一張畫布（pc 396／
  // pad 303／mob 289 ＝ 稿上兩行墨跡的聯集寬），英文行的左側留白烤在 viewBox 的
  // 負 x 裡（pc −4／mob −2.2444），所以兩行直接靠左疊就等於稿。
  //
  // ⚠️ **三個斷點的 line-height 都刻意不動**（2026-08-25 補 pad／mob 素材時的決定）。
  //    素材斷點下行高唯一的視覺作用是「兩行墨跡的間距」（真文字已 visually-hidden）：
  //        間距 ＝ 行高 − (上行墨跡高 ＋ 下行墨跡高) ÷ 2  （<UArtLine> 把墨跡置中於行盒）
  //    照稿反推的行高與現值差一截，但**改了就要重調設計線**：
  //
  //      | 斷點 | 稿間距 | 現行行高 | 實測間距 | 照稿的行高 |
  //      | pc   | 22     | 56       | 18.7     | 59.3       |
  //      | pad  | 18     | 48       | 20.6     | 45.4       |
  //      | mob  | 15.6   | 44       | 18.8     | 40.8       |
  //
  //    pad／mob 動行高 → 姓名塊高度變 → `.forum-event__speakers` 高度變 →
  //      pad Q6（fraction 0.5781）／Q7（bottom +102）、mob P6（fraction 0.4704）全部偏。
  //    pc 動行高 → 墨跡在行盒內的內縮從 8.58 變 10.08 → 與 `.forum-event__speaker`
  //      那個 padding-top 102（＝「字面落在講者組頂端下方 112.7」）對不上，整組下移 1.5。
  //    ⇒ 保留 ≤3.3px 的間距落差，換設計線零改動。要對到稿就得連上面那些一起重推。
  .forum-event--quote & {
    @include rwd-max('pc') {
      --art-base: 32;

      order: 3;
      font-size: 32px;
      line-height: 48px;
    }

    @include rwd-max('tablet') {
      --art-base: 29;

      font-size: 29px;
      line-height: 44px;
    }
  }

  // 論壇二／四：稿把姓名 outline 掉了，2026-08-28 起接上素材（單行，共六檔
  // `forum2|4-name-<斷點>-1.svg`）。素材原生尺寸就是稿的字面框：pc 201.176×54.1141、
  // pad 190×51、mob 111×30；墨跡左緣 ＝ 文字欄左緣，故水平不必再對齊。
  //
  // 字級（＝ --art-base，素材寬的基準）與字距是拿**實際渲染的字面**回推的
  // （Noto Sans TC Light，canvas actualBoundingBox 量到 CJK 字面 ＝ 0.92em 高、
  // 每字 advance 1em、三字字面寬 2.92em）：
  //     字級 ＝ 字面高 ÷ 0.92          → 58.8 / 55.4 / 32.6 → 59 / 55 / 33
  //     字距 ＝ (字面寬 − 2.92×字級) ÷ 2 → 14.7 / 14.1 / 7.9 → 三個斷點都 ≈ 0.25em
  //   ⇒ 素材寬 ÷ 字級 ＝ 稿的字面框寬，接上素材後字級變成純粹的縮放基準。
  // ⚠️ 不要只用字面**寬**反推 —— 稿的字距有 0.25em，只看寬會推出 69px（差 10px）。
  //
  // margin-top 把行盒擺到「墨跡落在稿的位置」（pc 187 / pad 165 / mob 128，相對照片頂）。
  // <UArtLine> 把墨跡置中於行盒 ⇒ 墨跡頂 ＝ 頭銜行盒下緣 ＋ margin ＋ (行高 − 素材高) ÷ 2：
  //   pc  頭銜下緣 167、行高 80、素材高 54.1141 → 7
  //   pad 頭銜下緣 145、行高 74、素材高 51      → 8.5
  //   mob 頭銜下緣 116、行高 45、素材高 30      → 4.5
  // 這比活文字時的 4 / 5 / 3 各多 3 / 3.5 / 1.5 —— 不影響設計線：文字欄總高
  // （padding-top ＋ 頭銜 ＋ 本層）仍低於 `.forum-event__speaker` 的 min-height
  // 280 / 233 / 180，講者組的 rect 照舊等於照片框。
  //
  // order 2 讓它排在頭銜之後（稿是頭銜在上，DOM 是姓名在上）。
  // ⚠️ nowrap 與字距只在**素材缺檔退回活文字**時才有作用，但不可刪。稿的文字欄寬是照
  //    **頭銜**自動長出來的（論壇二 pc 212、pad 192），比帶 0.25em 字距的三字姓名還窄
  //    （221.3／206.3）—— 姓名會折成兩行，講者組因此比照片高 51／65，而
  //    `.forum-event__speakers` 的高度正是設計線 Q8~Q10／P8~P10 的錨點
  //    （見 architecture/forum-node-path.md）。
  //
  // 視窗 375–381（mob 稿是 414）：文字欄只剩 104～110，<UArtLine> 的 max-width: 100%
  // 會把素材等比縮到 ≥93.7%（活文字時代是直接溢出文字欄 20px）。稿沒有這個尺寸，不對稿。
  .forum-event--stair &,
  .forum-event--youth & {
    --art-base: 59;

    order: 2;
    margin-top: 7px;
    font-size: 59px;
    line-height: 80px;
    letter-spacing: 0.25em;
    white-space: nowrap;

    @include rwd-max('pc') {
      --art-base: 55;

      margin-top: 8.5px;
      font-size: 55px;
      line-height: 74px;
    }

    @include rwd-max('tablet') {
      --art-base: 33;

      margin-top: 4.5px;
      font-size: 33px;
      line-height: 45px;
    }
  }
}

// 頭銜。論壇二／四是文字欄的第二段（padding-top 已把它擺到稿的位置），
// 不再需要卡片版那條「固定 68 高讓兩張卡的姓名對齊」的規則。
//
// ⚠️ pre-line：稿的頭銜是**兩個文字段**（Figma 裡就是硬換行，不是自動折行），文案因此在
//    section2.json 裡帶 \n。不靠欄寬自動折 —— 論壇四的文字欄 251 寬，自動折會斷成
//    「台積電執行副總經理 暨共」／「同營運長」（實測），與稿不符。
.forum-event__speaker-role {
  order: 1;
  margin: 0;
  color: var(--color-gray-light);
  font-size: 20px;
  line-height: 32px;
  letter-spacing: 0.05em;
  white-space: pre-line;

  @include rwd-max('tablet') {
    font-size: 16px;
    line-height: 24px;
  }

  .forum-event--quote & {
    min-height: 68px;
    margin-top: 12px;

    @include rwd-max('pc') {
      order: 4;
    }
  }

  // 論壇二／四的窄機：文字欄 ＝ 可用寬 − 26×2 − 204（後者是 __speaker 的 padding-left），
  // 而頭銜最長那行「台積電執行副總經理」9 字帶 0.05em 字距 ＝ 9 × 1.05em ＝ 151.2px
  // —— 414 稿寬還有 158 塞得下，**407.2 以下就折成三行**（實測 407 → colW 151）。
  // 門檻因此不是 'mobile'(414) 而是 407.2，字級改成跟著欄寬流動：
  //     407 → 15.6、390 → 13.8、375 → 12.2，兩行的文案結構不動。
  //
  // ⚠️ 真正卡在 407.2 的是 min() 的 16px 上限，**不是媒體查詢**：欄寬夠時本式算出 >16
  //    就被夾回 16，等於沒作用。上界仍寫 424 是為了吸收桌機捲軸 —— 媒體查詢的 width
  //    與 `vw` 都**含**捲軸（實測 innerWidth 422 → 內容寬 407），故有捲軸時整個 MQ
  //    區間會往上位移一個捲軸寬（Windows 15~17px），寫死 408 就會在 408~422 漏掉。
  // ⚠️ 反過來，算式裡一定要扣 --scrollbar-width：元素的 padding 吃的是「不含捲軸」的
  //    內容寬（__speaker 那條「實測 320 寬 → 48.7」註解就是這個落差）。
  //    行動裝置是 overlay 捲軸 → 該變數為 0，此式自然退化成 100vw − 260。
  //    260 ＝ 256 ＋ 4 的安全邊（字面量測的四捨五入）。
  // ⚠️ 下界 375 不可省：374.98 以下 __speaker 已退回直排、文字吃滿內容欄（268 起），
  //    16px 本來就不折，而本式在 320 會一路算到 6.3px。
  // ⚠️ line-height 固定 24px、**不可跟著字級走** —— 講者組的高度必須維持 __speaker 的
  //    min-height 180（＝照片高），mob 的 T5／P10 掛的正是它的**下緣**
  //    （見 forum-node-path）。兩行 48 ＋ padding-top 68 ＋ 姓名 48 ＝ 164 < 180
  //    ⇒ 設計線零改動。反之折成三行時是 188，T5／P10 會被往下推 8px（本次順帶修掉）。
  .forum-event--stair &,
  .forum-event--youth & {
    @include rwd-min(375px) {
      @include rwd-max(424px) {
        font-size: min(
          calc((100vw - var(--scrollbar-width) - 260px) / 9.45),
          16px
        );
      }
    }
  }
}

.forum-event__bio {
  margin: 0;
  font-size: 18px;
  font-weight: 300;
  line-height: 36px;
  text-align: justify;

  & + & {
    margin-top: 36px;
  }

  @include rwd-max('pc') {
    font-size: 20px;
  }

  @include rwd-max('tablet') {
    font-size: 18px;
  }
}

// 論壇一：長 bio 橫跨照片欄與文字欄（設計稿寬 709、字面 y 為講者組頂端下方 316）。
// 負 margin 回推是「照片左、文字右」版式專用，卡片版式若吃到會左右各溢出數百 px，故限定 --quote。
.forum-event--quote .forum-event__bio {
  width: 709px;
  margin: 102px 0 0 -312px;

  @include rwd-max('pc') {
    order: 5;
    width: auto;
    margin: 32px 0 0;
  }
}

// 選擇器比上一條多一層才蓋得掉那個 102px：第二段之後只留段距。
.forum-event--quote .forum-event__bio + .forum-event__bio {
  margin-top: 36px;
}
</style>
