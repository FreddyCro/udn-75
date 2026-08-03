import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

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
    // 02.symbol：符號星空 / 人臉序列（Hero 與 Forum 之間的獨立黑底段落）。
    // 與 02.forum 同為第二段的兩個子場景，故共用 02 前綴。
    { path: '~/components/02.symbol', pathPrefix: false },
    { path: '~/components/02.forum', pathPrefix: false },
    { path: '~/components/03.blessing', pathPrefix: false },
    { path: '~/components/04.media', pathPrefix: false },
    { path: '~/components/05.subpage', pathPrefix: false },
    '~/components',
  ],

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
    },
  },

  runtimeConfig: {
    public: {
      APP_MODE: '',
      APP_ASSETS_PATH: '',
    },
  },

  app: {
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

  css: ['~/assets/styles/tailwind.css', '~/assets/styles/base.scss'],

  // Pre-bundle CJS-only dependency in dev to avoid ESM default export issues.
  // @udn-digital-center/common-components 內部 import 的 vue-scrollto 為 CJS，
  // 需在此預打包成 ESM（並把 vue-scrollto 裝成直接相依），否則 dev 會報
  // "does not provide an export named 'default'"。
  vite: {
    plugins: [tailwindcss()],
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
