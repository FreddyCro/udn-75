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

  css: ['~/assets/styles/base.scss'],

  // Pre-bundle CJS-only dependency in dev to avoid ESM default export issues.
  // @udn-digital-center/common-components 內部 import 的 vue-scrollto 為 CJS，
  // 需在此預打包成 ESM（並把 vue-scrollto 裝成直接相依），否則 dev 會報
  // "does not provide an export named 'default'"。
  vite: {
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
          additionalData: `
          `,
          // @use "@/assets/styles/mixins.scss" as *;
          // @use "@/assets/styles/variables.scss" as *;
        },
      },
    },
  },
});
