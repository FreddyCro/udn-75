import { basename } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { dedupeFontFace } from './build/dedupe-font-face';
import { aliasDemotedPageChunks } from './build/preload-page-chunks';

// `pages:extend` 蒐集到的頁面名（＝ app/pages/<name>.vue 的 <name>），
// 給 `build:manifest` 驗證「這個 chunk 真的是某個頁面的」用 ——
// 光看 chunk name 是不夠的（`index` 這種名字到處都有，見 build/preload-page-chunks.ts）。
// 兩個 hook 都在同一次 build 內、`pages:extend` 先跑，故用模組層變數傳遞就夠。
const pageNames = new Set<string>();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/fonts'],

  // Figma 規格：300 / 400 / 500。
  // @nuxt/fonts 在 build 時把字體檔下載到本地自架，不依賴外部 CDN，
  // 並自動產生帶 unicode-range 的分段 @font-face。
  //
  // 兩份都要宣告：CSS fallback 是「逐字符」比對，第一順位有該碼位的 glyph 才輪不到第二順位。
  // 英數走西文版 Noto Sans、中文落到 Noto Sans TC（見 assets/styles/base.scss 的 html 字體堆疊）。
  // ⚠️ 兩邊 weights 必須一致 —— 缺哪個字重，該字重的英數會被瀏覽器合成或退到鄰近字重，
  //    中英就會看起來不同粗。
  fonts: {
    families: [
      { name: 'Noto Sans', provider: 'google', weights: [300, 400, 500] },
      { name: 'Noto Sans TC', provider: 'google', weights: [300, 400, 500] },
    ],
  },

  // 讓區網設備可以使用，例如手機
  // devServer: {
  //   host: "0.0.0.0",
  //   port: 3000,
  // },

  ssr: true,

  // section 元件用「數字前綴資料夾排序 + 語意檔名」：資料夾 01./02./… 直接放在
  // components/ 下（無 sections/ 包一層），故在檔案總管會排在最前面、依序排列。
  // pathPrefix: false 讓元件名只取檔名、忽略資料夾前綴（如 04.media），
  components: [
    { path: '~/components/01.hero', pathPrefix: false },
    // 01a.symbol：符號星空 / 人臉序列（Hero 與 Forum 之間的獨立黑底段落）。
    // 用字母後綴而非新數字（如 01.5）：'.'(0x2E) < 'a'(0x61) 故排在 01.hero 之後，
    // 開頭數字 01 < 02 故排在 02.forum 之前 → 檔案總管順序 ＝ 頁面順序。
    // （01.5.symbol 會因 '5' > '.' 而排到 01.hero 前面，故不用。）
    { path: '~/components/01a.symbol', pathPrefix: false },
    { path: '~/components/02.forum', pathPrefix: false },
    { path: '~/components/03.blessing', pathPrefix: false },
    { path: '~/components/04.media', pathPrefix: false },
    { path: '~/components/05.subpage', pathPrefix: false },
    // ui/：跨 section 共用的無語意元件（UBtn…）。同樣要 pathPrefix: false，
    // 否則會被最後那筆 '~/components'（預設 pathPrefix: true）命名成 <UiUBtn>。
    { path: '~/components/ui', pathPrefix: false },
    '~/components',
  ],

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
      // ⚠️ /subpage 必須明列。它是手機版的連續閱讀頁，唯一的入口是 MediaList 在 <768
      //    才產生的連結（見該檔的 linkFor）—— crawlLinks 是靜態掃 HTML，掃不到那條
      //    client 端才成立的網址，漏了就是部署後 404，而且沒有任何建置警告。
      routes: ['/subpage'],
    },
  },

  runtimeConfig: {
    public: {
      APP_MODE: '',
      APP_ASSETS_PATH: '',
    },
  },

  app: {
    // 換頁轉場「fade through」：out-in 讓舊頁先完全淡出、再淡入新頁，
    // 兩段不重疊 → 不會有兩份頁面同時在 DOM 裡造成高度跳動與 GSAP 重複量測。
    // 對應 CSS 在 ~/assets/styles/base.scss（.page-enter-* / .page-leave-*）。
    pageTransition: { name: 'page', mode: 'out-in' },

    // layout 轉場必須開著：首頁（default）↔ 子頁（subpage）換的是 layout，整棵 layout
    // 子樹會被銷毀重建，連包住 NuxtPage 的 <Transition> 也是新實例 → 新頁屬於它的
    // 「初次渲染」，Vue 預設不動畫初次渲染，pageTransition 完全不會跑。這層關掉的話
    // 首頁↔子頁就是硬切。（兩層不會疊加：layout 換掉時內層 page transition 本來就不跑。）
    //
    // 這層只用 page-fade（純 opacity）：layout root 底下有 position: fixed 的 AppHeader
    // 與 SubpageAnchor，帶 scale 會讓它們改以變形層為定位基準而跳位。
    layoutTransition: { name: 'page-fade', mode: 'out-in' },

    baseURL: (() => {
      const nuxtUrl = process.env.NUXT_URL;
      if (!nuxtUrl) return '/';
      try {
        return new URL(nuxtUrl).pathname;
      } catch {
        return '/';
      }
    })(),
  },

  css: [
    '~/assets/styles/tailwind.css',
    '~/assets/styles/base.scss',
    '~/assets/styles/subpage.scss',
  ],

  // Pre-bundle CJS-only dependency in dev to avoid ESM default export issues.
  // @udn-digital-center/common-components 內部 import 的 vue-scrollto 為 CJS，
  // 需在此預打包成 ESM（並把 vue-scrollto 裝成直接相依），否則 dev 會報
  // "does not provide an export named 'default'"。
  // build:manifest：補回首頁 route chunk 遺失的 manifest 別名，恢復它的 modulepreload。
  // 成因與做法見 build/preload-page-chunks.ts —— 那支 chunk 有 664 KB，少一條 hint
  // 就是多一整跳的序列瀑布。
  hooks: {
    // 頁面清單的真值來源。⚠️ 只收扁平的 app/pages/<name>.vue —— 別名的組法是
    // `pages/<name>.vue`，巢狀頁面（pages/a/b.vue）組不出來，故一併排除、不亂認領。
    'pages:extend': (pages) => {
      for (const page of pages) {
        if (!page.file?.endsWith('.vue')) continue;
        if (!/[\\/]pages[\\/][^\\/]+\.vue$/.test(page.file)) continue;
        pageNames.add(basename(page.file, '.vue'));
      }
    },

    'build:manifest': (manifest) => {
      aliasDemotedPageChunks(
        manifest as unknown as Parameters<typeof aliasDemotedPageChunks>[0],
        { log: (msg) => console.info(msg), pageNames },
      );
    },
  },

  vite: {
    // dedupeFontFace 必須排在 tailwind 之後：它是 enforce: 'post' + generateBundle，
    // 看到的是所有 CSS 處理（含 @nuxt/fonts 注入與 minify）都跑完的最終產物。
    plugins: [tailwindcss(), dedupeFontFace()],
    build: {
      // 關掉小資源 inline（預設 4096 bytes 以下會被轉成 data URI 內嵌進 JS/CSS）。
      // 本專案圖片多半靠 runtimeConfig 的 APP_ASSETS_PATH 在 runtime 組路徑（見 UPic/UVid），
      // 需要實體檔案存在；設 0 可確保 assets 內的小圖（如 SVG）一律輸出成獨立靜態檔。
      assetsInlineLimit: 0,
    },
    optimizeDeps: {
      // 預先 pre-bundle，避免 dev 期間「runtime 才發現依賴」觸發整頁 reload。
      // vue-scrollto 為 CJS-only，預先 bundle 成 ESM 以提供 default export
      // （common-components 內部元件會 import 它）。
      // common-components / topojson-client 是延遲載入（AppHeader / useTaiwanMap），
      // Vite 初掃描不到，故明確列入。
      include: ['vue-scrollto', '@udn-digital-center/common-components'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          // common-components 的每個 index.scss 是各自的編譯進入點，且用相對路徑 @import，
          // quietDeps 不涵蓋這種情況，故直接關閉 import 棄用類別。
          // （自家 assets/styles 用 @use，不受影響；保留 quietDeps 壓其餘 deps 警告。）
          quietDeps: true,
          silenceDeprecations: ['import'],
          // 只放「不產生 CSS 輸出」的 @use（mixin / function / 變數），
          // 才能安全地 prepend 進每個 SCSS 進入點而不重複輸出樣式。
          additionalData: `@use "@/assets/styles/mixins.scss" as *;\n`,
        },
      },
    },
  },
});
