// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
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
      APP_MODE: "",
      APP_ASSETS_PATH: "",
    },
  },

  app: {
    baseURL: (() => {
      const nuxtUrl = process.env.NUXT_URL;
      if (!nuxtUrl) return "/";
      try {
        return new URL(nuxtUrl).pathname;
      } catch {
        return "/";
      }
    })(),
  },

  // Pre-bundle CJS-only dependency in dev to avoid ESM default export issues.
  // @udn-digital-center/common-components 內部 import 的 vue-scrollto 為 CJS，
  // 需在此預打包成 ESM（並把 vue-scrollto 裝成直接相依），否則 dev 會報
  // "does not provide an export named 'default'"。
  vite: {
    optimizeDeps: {
      include: ["vue-scrollto"],
    },
  },
});
