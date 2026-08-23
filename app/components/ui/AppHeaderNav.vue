<script lang="ts" setup>
/**
 * 錨點列（≥1280）。底線 hover／active 由中心往左右展開。
 *
 * 首頁與子頁共用同一列：首頁就地捲動（emit select），子頁走 NuxtLink 導航回首頁對應段落。
 * 子頁也要渲染的理由 —— 漢堡在 ≥1280 是 display:none，錨點列若又只在首頁渲染，
 * 子頁 PC 的 header 就只剩 logo ＋ 音效 ＋ share，完全沒有導覽。
 */
import type { HeaderAnchor } from '~/types/header';
import { gaClickMenu } from '~/utils/tracking-event';

defineProps<{
  anchors: HeaderAnchor[];
  activeTarget: string;
}>();

const emit = defineEmits<{ select: [target: string] }>();

// 連結的 hover／click 音效。useSfx() 一定要在 setup 期間取（它此刻要讀 runtimeConfig，
// 見 useSfx.ts）；音效池由 app.vue 的 <AppSfx> 持有，聲音開關關著時 play() 靜默。
const { play } = useSfx();

const route = useRoute();
const isHome = computed(() => route.path === '/');

// 錨點文字在稿上是 outline 過的 vector（Figma 3104:84736 的三個 botton 群組）。
// 用 mask 而非 <img>：這一列的文字色隨 header 主題換（--hd-fg：白底灰字／黑底、橘底白字），
// 且轉場開窗時同一份 markup 會以反白層再渲染一次（見 AppHeader 的 layers）。
const artStyle = useArtMask();

// 首頁：攔下瀏覽器的預設跳轉，改走 scrollToTarget（它會補掉 fixed header 的高度）。
//
// GA 的 term 走 anchor.ga（symposium／benediction／newmedia）而不是 target
// （forum／blessing／media）—— 事件表與段落 id 不同名，見 types/header.ts 的說明。
// ⚠️ 這一列在 <1280 是 display:none，但**仍會渲染**（見檔頭說明），所以 GA 只在真的被點到
//    時才送 —— 與漢堡選單共用同一個事件與同一組 term（決策：PC 錨點列也算 click_menu），
//    要切裝置維度在 GA 端做。
function onHomeSelect(anchor: HeaderAnchor, e: MouseEvent) {
  // 修飾鍵點擊＝開新分頁的意圖，一律放行給瀏覽器。
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  emit('select', anchor.target);
  play('sfx01');
  gaClickMenu(anchor.ga);
}

// 子頁：導航交給 NuxtLink，本函式只負責守修飾鍵（與 onHomeSelect 對齊，
// 也與 AppHeader.onLogoClick、AppHeaderMenu.onHomeSelect / onAwaySelect 一致）——
// ⌘/Ctrl 點擊＝開新分頁，不算本頁互動，不出聲。
function onAwaySelect(anchor: HeaderAnchor, e: MouseEvent) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  play('sfx01');
  gaClickMenu(anchor.ga);
}
</script>

<template>
  <nav class="app-header-nav">
    <!-- 首頁用原生 <a>，不用 NuxtLink：NuxtLink 內建的 click handler 會**先於**本元件的
         @click 執行，且它是在那個時間點才檢查 e.defaultPrevented —— 我們的 preventDefault
         還沒跑，攔不住它。結果是網址列被塞進 /#target，再由 Nuxt 的 scrollBehavior 捲到
         沒有補償 --header-height 的原始位置。就地捲動一律走 scrollToTarget。 -->
    <template v-if="isHome">
      <a
        v-for="anchor in anchors"
        :key="anchor.target"
        class="app-header-nav__link"
        :class="{ 'app-header-nav__link--active': activeTarget === anchor.target }"
        :href="`#${anchor.target}`"
        @mouseenter="play('sfx01')"
        @click="onHomeSelect(anchor, $event)"
      >
        <span class="app-header-nav__art" :style="artStyle(anchor.art.pc)" />
        <!-- 真文字只有這一份（SR／SEO 的唯一來源），不做第二份複本 -->
        <span class="visually-hidden">{{ anchor.title }}</span>
      </a>
    </template>

    <!-- 子頁：真的要換頁，交給 NuxtLink（client-side 導航，並吃到 viewport prefetch）。 -->
    <template v-else>
      <NuxtLink
        v-for="anchor in anchors"
        :key="anchor.target"
        class="app-header-nav__link"
        :class="{ 'app-header-nav__link--active': activeTarget === anchor.target }"
        :to="`/#${anchor.target}`"
        @mouseenter="play('sfx01')"
        @click="onAwaySelect(anchor, $event)"
      >
        <span class="app-header-nav__art" :style="artStyle(anchor.art.pc)" />
        <span class="visually-hidden">{{ anchor.title }}</span>
      </NuxtLink>
    </template>
  </nav>
</template>

<style lang="scss" scoped>
.app-header-nav {
  display: none; // <1280 改用漢堡選單

  @include rwd-min('pc') {
    display: flex;
    align-items: center;
    gap: 32px;
  }
}

// 稿上的量（Figma 3104:84736，換算成 header 內的絕對座標）：
//   文字墨跡框 15px 高，框心 43 ＝ 主列（3–83）的中心 → 素材垂直置中即對稿。
//   底線 y 60 高 2、寬 39，而「論壇」墨跡寬 35 → 底線比墨跡左右各寬 2px。
// padding 11.5 ＝ 底線上緣 60 − 墨跡底緣 50.5；上下對稱才不會把素材推離中心。
// 順帶把點擊區從 15px 撐成 38px（原本靠 font-size 的行盒撐，改素材後行盒沒了）。
.app-header-nav__link {
  position: relative;
  flex-shrink: 0;
  padding: 11.5px 0;
  color: var(--hd-fg);
  text-decoration: none;
  // 時長吃 header 繼承下來的 --hd-color-dur（預設 0.3s），不寫死：逐幀漸變期間
  // AppHeader 會把它歸零，否則這一列文字會獨自慢半拍落後於底色，理由見該變數的註解。
  transition: color var(--hd-color-dur, 0.3s) ease;

  &::after {
    content: '';
    position: absolute;
    right: -2px;
    bottom: 0;
    left: -2px;
    height: 2px;
    background-color: var(--hd-accent);
    transform: scaleX(0); // transform-origin 預設 center → 由中心往兩側展開
    transition: transform 0.2s ease;
  }

  // 稿上的 active／hover 只有那條橘色底線 —— Figma 圖層名就叫「當前錨點＆hover 效果」，
  // 內容是一條 line，三顆錨點的文字同為 #686868（＝--color-gray）。
  // 故 active 不換文字色，一律吃 --hd-fg（白底灰字／黑底橘底白字）。
  &:hover::after,
  &--active::after {
    transform: scaleX(1);
  }
}

// 錨點文字（稿字形素材）。素材當形狀、顏色吃 currentColor ＝ 連結的 --hd-fg，
// 故主題換色與那段 color transition（--hd-color-dur）一併生效，反白層也自動正確。
// 寬高逐顆掛在 inline style（三顆稿寬不同：35／72／90.46），見 useArtMask。
.app-header-nav__art {
  display: block;
  background-color: currentColor;
  mask: var(--art) no-repeat center / 100% 100%;
  -webkit-mask: var(--art) no-repeat center / 100% 100%;
}

@media (prefers-reduced-motion: reduce) {
  .app-header-nav__link::after {
    transition: none;
  }
}
</style>
