<!--
  共用按鈕：給了 href 就是 <a>，沒給就是 <button type="button">。

  分工是「相同的設定寫死、會變的走 CSS 變數」：
  盒模型／字級／字距／hover 機制寫在 .u-btn，寬高與六個顏色全是變數，
  由呼叫點用自己的 BEM class 在各自的 scoped SCSS 裡填（見下方變數清單）。

  為什麼是變數而不是 props：Vue 會把呼叫點的 scoped 屬性掛到本元件的根節點上，
  所以 `.agenda__action { --u-btn-w: 414px }` 這種寫法選得到；而因為填的是變數、
  不是 width，永遠不會跟本檔的規則搶特異度 —— RWD 也就能繼續用專案的 rwd-* mixin，
  不必把三個斷點塞進 props。

  ⚠️ 呼叫點傳進來的 class 會落在**根節點**，也就是真正的 <a>／<button> 身上。
     .forum-event__cta 是 ForumCorePath 的量測錨點（utils/forum-node-path 的
     W12／R3／S3），靠這個性質才能沿用原本的 class 與盒子幾何 —— 換掉元件標籤
     或多包一層 wrapper，那條橘核心設計線就會偏掉或整條消失。
-->
<script setup lang="ts">
import type { UBtnVariant } from '~/types/ui';

const props = withDefaults(
  defineProps<{
    /** 配色預設值組；呼叫點仍可用 --u-btn-* 覆蓋任一個顏色 */
    variant?: UBtnVariant;
    /** 給了就渲染成 <a>，沒給就是 <button> */
    href?: string;
  }>(),
  { variant: 'primary', href: undefined },
);

const tag = computed(() => (props.href ? 'a' : 'button'));
</script>

<template>
  <!-- type 只在 <button> 時輸出（<a> 上是 undefined → 不渲染）。
       fallthrough attrs 會覆蓋 template 上的同名綁定，故呼叫點想改 type 仍改得掉。 -->
  <component
    :is="tag"
    class="u-btn"
    :class="`u-btn--${variant}`"
    :href="href"
    :type="tag === 'button' ? 'button' : undefined"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
// 本檔走 mobile-first（rwd-min），依 assets/styles/mixins.scss 檔頭對新樣式的約定。
// 字級刻意不是單調遞增：mob 20 → pad 18 → pc 22（設計稿如此）。
//
// font-weight 刻意不宣告，維持繼承 —— 原本四個呼叫點都沒宣告，一宣告就是視覺差異。
// 唯一例外是 --outline 在 pad／mob 的 300，那是現有實作就有的。
.u-btn {
  // 尺寸：預期由呼叫點填。這裡的值只是保險，漏填時不會塌成 0。
  --u-btn-w: auto;
  --u-btn-h: 70px;

  // inactive 三色
  --u-btn-bg: transparent;
  --u-btn-color: currentcolor;
  --u-btn-border: transparent;

  // hover 三色：預設 fallback 回 inactive 那組 → 不填就等於沒有 hover 變化。
  // 同一元素上的 var() 取的是 --u-btn-bg 級聯後的最終值，故 modifier 覆寫
  // --u-btn-bg 時，這裡的 fallback 會跟著走，不會鎖在 transparent。
  --u-btn-bg-hover: var(--u-btn-bg);
  --u-btn-color-hover: var(--u-btn-color);
  --u-btn-border-hover: var(--u-btn-border);

  display: grid;
  place-items: center;
  width: var(--u-btn-w);
  height: var(--u-btn-h);
  // 透明邊框視覺上等於沒有：box-sizing 已由 base.scss 全域設成 border-box，
  // 且背景預設鋪到 border box，故加這 1px 不會改變盒高、也不會露出底色。
  // 有了它，outline 與實心款才能共用同一個盒子、互相 hover 切換不跳位。
  border: 1px solid var(--u-btn-border);
  padding: 0; // <button> 的預設內距
  background: var(--u-btn-bg);
  color: var(--u-btn-color);
  font-family: inherit; // <button> 不會自動繼承字體
  font-size: 20px;
  line-height: 36px;
  letter-spacing: 0.1em;
  text-align: center;
  text-decoration: none;
  // letter-spacing 會在最後一字後多留一格，補回它的一半才視覺置中。
  text-indent: 0.05em;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  @include rwd-min('tablet') {
    font-size: 18px;
  }

  @include rwd-min('pc') {
    font-size: 22px;
  }

  // :focus-visible 一併吃，比照專案其他互動元件（如 HeroStart 的 cube）。
  &:hover,
  &:focus-visible {
    border-color: var(--u-btn-border-hover);
    background: var(--u-btn-bg-hover);
    color: var(--u-btn-color-hover);

    // 放大只給 pc 以上（pad／mob 是觸控，hover 不成立）。
    // transform 不改 layout 盒子，ForumCorePath 的量測錨點不受影響。
    @include rwd-min('pc') {
      transform: scale(1.03);
    }
  }

  // --accent 只定義在 Forum.vue 的 .sec2 上，故一律帶 --color-orange 當 fallback，
  // 日後搬到別的 section 也不會沒色。

  // 「立即報名」：橘底白字 → hover 深灰底（＝ Figma pad／mob 的 click 變體）。
  &--primary {
    --u-btn-bg: var(--accent, var(--color-orange));
    --u-btn-color: #fff;
    --u-btn-bg-hover: var(--color-gray);
  }

  // 「下載完整議程」：框線款。pc 稿是橘框橘字，pad／mob 稿改深灰框深灰字 Light。
  // hover 反轉成橘底（＝ Figma pad／mob 的 click 變體）。
  &--outline {
    --u-btn-color: var(--color-gray);
    --u-btn-border: var(--color-gray);
    --u-btn-bg-hover: var(--accent, var(--color-orange));
    --u-btn-color-hover: var(--color-white-light);
    --u-btn-border-hover: var(--accent, var(--color-orange));

    font-weight: 300;

    @include rwd-min('pc') {
      --u-btn-color: var(--accent, var(--color-orange));
      --u-btn-border: var(--accent, var(--color-orange));

      // 回到基底的「不宣告、繼承」狀態（pc 稿沒有 Light）。
      font-weight: inherit;
    }
  }

  // 報告導流：深灰底白字，與議程的橘色報名鈕拉開層級。
  // ⚠️ Figma 沒有這顆的 hover 稿，先反轉成橘底，待對稿後調 --u-btn-bg-hover。
  &--gray {
    --u-btn-bg: var(--color-gray);
    --u-btn-color: #fff;
    --u-btn-bg-hover: var(--accent, var(--color-orange));
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    // 關掉 transition 只會讓縮放變成瞬間跳動，動態本身要一併拿掉。
    // 寫在同層 media 內、且排在原 hover 規則之後，特異度相同故後者勝出。
    &:hover,
    &:focus-visible {
      transform: none;
    }
  }
}
</style>
