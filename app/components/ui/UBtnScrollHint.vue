<!--
  下滑提示（Scroll hint）：22×12 的點陣 chevron，點一下往下捲一個視窗高。

  分工同 <UBtnSkip>：本元件只畫「圖示本體 ＋ 它自己的漂移動態」，並負責「點了要捲」這件事，
  **版位與顯不顯身留給呼叫點** —— 那些是各段落自己的狀態機的事
  （見 HeroVideo.vue 的 .sec1__hero-scroll：它只給座標與 v-if）。

  ⚠️ 呼叫點若把它放進 `pointer-events: none` 的圖層（hero 舞台就是這樣一層），
     **必須自己覆寫回 `pointer-events: auto`**，否則這顆按鈕點不到 —— 命中會一路穿過
     那些 none 的祖先掉到更上層的父元素去（實測 elementFromPoint 抓到的是 .sec1__inner）。
     同一個處方已用在 .sec1__hero-skip 的 .is-visible 上。
-->
<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 螢幕閱讀器用的說明（視覺上不顯示）；文案由呼叫點自 locales 傳入。
     *  稿上只有圖示、沒有文字 —— 但這個提示對讀不到圖形的使用者更重要，故掛 visually-hidden。 */
    label?: string;
  }>(),
  { label: '' },
);

// 視窗高的單一來源（--vh）。不用 window.innerHeight：後者在行動裝置上會隨網址列收合而變，
// 「往下捲一屏」的那把尺不該跟著抖（判準見 ~/composables/useViewportHeight 檔頭）。
const { vhPx } = useViewportHeight();

// 點擊 → 往下捲一個視窗高。
// ⚠️ 只捲、不寫任何段落狀態：hero 的退場是綁捲動進度的（見 HeroVideo 的 applyDissolve），
//    這一捲自然會驅動 scrub，不必也不該在這裡另外 setState。
// reduced-motion 改 'auto'（瞬移）：smooth 捲動本身就是一段動畫。
function onClick() {
  window.scrollBy({
    top: vhPx(1),
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
  });
}
</script>

<template>
  <!--
    type 寫死 button：本元件不做表單送出，也避免落在 <form> 內時誤觸 submit。
    aria-label / tabindex / inert 等都靠 fallthrough 落在這顆 <button> 上（同 <UBtnSkip>）。
  -->
  <button class="u-btn-scroll-hint" type="button" @click="onClick">
    <span v-if="label" class="visually-hidden">{{ label }}</span>

    <!--
      定位框：兩顆 chevron 都絕對定位疊在這個 22×12 的框裡，故它得是它們的定位基準。
      ⚠️ 刻意多包這一層、不把 position: relative 下在根節點：根節點的 position 要留給
         呼叫點（hero 那邊是 absolute + left/bottom）。兩份 scoped 樣式對同一個屬性
         各寫一個值，勝負取決於樣式注入順序 —— 不可靠（見 UBtnSkip 檔頭的同類警告）。
    -->
    <span class="u-btn-scroll-hint__box">
      <!--
        點陣 chevron：11 顆 2×2 實心方塊排成階梯狀，與稿逐點相同。
        與 <UBtnSkip> 的雙箭頭是同一個 component「提示下滑」，那邊是轉 90° 的
        12×22（指右），這裡是原方向的 22×12（指下）—— 座標互為轉置。
        同樣沿用該檔的處理：不引外部 svg 檔、直接畫 rect，shape-rendering 保住像素邊緣。

        ⚠️ 畫兩顆（稿上是一顆）：這是動態的一部分，不是版面上多了一個圖示 ——
        兩顆疊在同一個位置、跑同一條路徑，只差半個週期（見 --offset 的 delay），
        於是任一瞬間一顆在行程上半段、另一顆在下半段，看起來像一前一後的雙箭頭。
        少了第二顆就補不起每循環約 0.6s 的空檔（參考範例即是如此設計）。
        靜止時（prefers-reduced-motion）兩顆完全重合 ＝ 稿上那一顆。

        v-for 而非把 <svg> 抄兩份：路徑只寫一次，兩顆的差異全在 CSS。
        （<UBtnSkip> 那邊把座標寫進同一條 path 是因為兩箭頭不需各自動畫。）
      -->
      <svg
        v-for="i in 2"
        :key="i"
        class="u-btn-scroll-hint__icon"
        :class="{ 'u-btn-scroll-hint__icon--offset': i === 2 }"
        viewBox="0 0 22 12"
        shape-rendering="crispEdges"
        aria-hidden="true"
      >
        <path
          d="M0 0h2v2H0z M2 2h2v2H2z M4 4h2v2H4z M6 6h2v2H6z M8 8h2v2H8z M10 10h2v2H10z M12 8h2v2H12z M14 6h2v2H14z M16 4h2v2H16z M18 2h2v2H18z M20 0h2v2H20z"
        />
      </svg>
    </span>
  </button>
</template>

<style lang="scss" scoped>
// 一顆 chevron 的行程與週期。兩者是綁在一起的一組數字：
//   $drift 決定「跑多遠」，$cycle 決定「多久跑完」，
//   而 --offset 那顆的 delay 是 -半個週期 → 兩顆的間距恆為半個行程（8px）。
// ±8px ＝ 參考範例的 ±2/3 個箭頭尺寸，換算到本圖示的高 12px；
// 換算後兩顆重疊約 4px（1/3 個身高），與參考範例的重疊比例相當 —— 那正是
// 「一前一後、後面那顆像殘影」的來源。改任一個值都會動到這個關係。
$drift: 8px;
$cycle: 3s;

// 稿上三個斷點都是 22×12，故不隨斷點變化；色票＝稿上的 main/light gray #898989。
// 尺寸與色票由本元件持有，呼叫點只給座標 —— 兩邊各留一份就會在調整時脫鉤。
//
// 尺寸不寫在根節點而在 __box 上（見 template 的註解），根節點的框由它撐出來。
.u-btn-scroll-hint {
  display: block;
  padding: 0;
  color: var(--color-gray-light);
  background: none;
  border: 0;
  cursor: pointer;
}

// 22×12 ＝ 稿上圖示的框。兩顆 chevron 都絕對定位疊在這裡，
// 容器不會被子項的位移撐大或縮成 0 高 —— 於是呼叫點量到的底距始終是同一個框。
.u-btn-scroll-hint__box {
  position: relative;
  display: block;
  width: 22px;
  height: 12px;

  // 命中區外擴到 44×44：22×12 遠低於 44px 的觸控最小建議尺寸
  // （同 HeroStart 音效鈕以 ::after 補命中區的做法）。
  // ⚠️ 只外擴**命中範圍**，視覺框仍是 22×12 → 呼叫點的底距與置中都不受影響。
  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 44px;
    height: 44px;
    transform: translate(-50%, -50%);
    content: '';
  }
}

// 漂移動態：借 CodePen「SCSS Arrow Animation」的節奏（見下方 keyframes），
// 只借動態 —— 尺寸、色票皆維持設計稿原樣。
//
// 兩顆都絕對定位在 __box 的 0,0：它們要疊在同一個位置、跑同一條路徑，靠 delay 錯開，
// 而不是在版面上一上一下排開。
//
// 動畫掛在 <svg> 而非任何外層：呼叫點的外層正拿 transform 做水平置中，
// transform 不能疊加（同一屬性後者整條覆蓋前者），掛上去就會把置中弄掉。
.u-btn-scroll-hint__icon {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 22px;
  height: 12px;
  fill: currentColor;
  animation: u-btn-scroll-hint-drift $cycle linear infinite;

  // 停用動畫後停在 keyframes 之外的原樣態：無位移、opacity 1 的實色 #898989
  // ＝ 設計稿量到的靜態外觀（此時兩顆完全重合，看起來就是稿上那一顆）。
  // 刻意不比照動畫峰值的 .7 —— 不會動的那一版，該長成稿上的樣子，
  // 而不是某一格動畫的切片。
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

// 第二顆：同一條路徑、倒推半個週期起跑（＝ 參考範例的 animation-delay: $speed/-2）。
// 負延遲代表「一掛上就已經跑到一半」，故不必等一個週期才出現。
// ⚠️ 必須排在基底規則之後：兩者選擇器權重相同，靠順序才蓋得掉 animation 簡寫
//    帶入的 animation-delay: 0s。
.u-btn-scroll-hint__icon--offset {
  animation-delay: $cycle * -0.5;
}

// 從上方淡入、行經設計稿的原位、再往下淡出，一循環 $cycle
// （節奏與位移比例同參考範例）。
//
// 50% 這格刻意是 translateY(0)：那正是設計稿量到的位置（呼叫點量的那個底距）。故「走到稿上
// 原位的那一刻也是最亮的一刻」，漂移只發生在淡掉的頭尾，不會讓人覺得圖示位置跑掉了。
//
// 峰值 opacity 照參考範例的 .7（＝ #898989 疊在白底上約等於 #a7a7a7），不到稿上的實色 ——
// 最亮的一刻也留一點透明，整段呼吸才不會在中央「頓」一下。
// 10% / 90% 兩格只寫 opacity，transform 交給 0% → 50% → 100% 線性內插（同參考範例）。
@keyframes u-btn-scroll-hint-drift {
  0% {
    opacity: 0;
    transform: translateY(-$drift);
  }

  10%,
  90% {
    opacity: 0;
  }

  50% {
    opacity: 0.7;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY($drift);
  }
}
</style>
