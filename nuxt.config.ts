import { basename } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { dedupeFontFace } from './build/dedupe-font-face';
import { aliasDemotedPageChunks } from './build/preload-page-chunks';
import { textZoomNormalize } from './build/text-zoom-normalize';
import { stripImagePrefetch } from './build/strip-image-prefetch';
import { shouldInlineAsset } from './build/inline-svg-assets';

/**
 * 量測 in-app 瀏覽器的 text zoom 倍率 s，寫進 `--tz-measured`。
 * 完整緣由見 build/text-zoom-normalize.ts 的檔頭，消費端在 assets/styles/base.scss。
 *
 * ⚠️ 掛在 bodyOpen（不是 head）：量測需要 layout，而 <head> 階段還沒有 body ——
 *    掛在 head 時探針只能塞進 <html>，那是規格未定的位置。bodyOpen 已經有 body、
 *    但還在 SSR 內容之前，仍然早於首次繪製 → 不會看到字級跳動。
 *
 * 量法：`font-size: 100px; line-height: 1` 的區塊，高度 ＝ 1 × computed font size ＝ 100 × s。
 * 這條路徑不經過字型度量，所以字型還沒載入也準（換字型不會改變答案）。
 * 順手記下 10 個全形字的實寬（＝ 10em，需要 CJK 字型）當交叉檢查，寫進 data-tz 供 QA 目視。
 */
const TZ_PROBE = `(function(){try{
var host=document.body||document.documentElement,p=document.createElement('div');
p.style.cssText='position:absolute;left:-9999px;top:0;width:max-content;font-size:100px;line-height:1;white-space:pre;visibility:hidden';
p.textContent='中中中中中中中中中中';
host.appendChild(p);
var box=p.getBoundingClientRect();host.removeChild(p);
var byLine=box.height/100,byAdvance=box.width/1000;
var s=byLine>0?byLine:1;if(s<1)s=1;if(s>2)s=2;
var st=document.createElement('style');
st.textContent=':root{--tz-measured:'+s+'}';
document.head.appendChild(st);
document.documentElement.setAttribute('data-tz',byLine.toFixed(3)+'/'+byAdvance.toFixed(3));
}catch(e){}})();`;

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
  //
  // weights 寫成 `'300 500'`（**一個含空白的字串**）＝ 跟 Google 要一支涵蓋 300–500 的
  // 可變字型，而不是三支靜態字重。機制：unifont 的 prepareWeights 看到 weight 含空白、
  // 且該家族有 wght 軸，就轉成 css2 的 `wght@300..500`，回傳 `font-weight: 300 500`。
  // ⚠️ 一定要是「一個含空白的字串」。寫成 ['300', '500'] 會被當成兩個靜態字重，
  //    而且悄悄少掉 400。
  //
  // ⚠️ 這一項省的是 **bytes，不是 request 次數**。原本以為靜態字重是「切片數 × 字重數」、
  //    可變字型能把字型 request 除以三 —— 實測推翻了：舊設定下 300/400/500 的 105 個
  //    切片 URL 完全相同（@nuxt/fonts 本來就只下載一份可變字型、宣告三次），瀏覽器對
  //    同一個 URL 只發一次 request。新舊各量一次，首頁字型 request 都是 36、抓到的檔案
  //    交集也是 36。實際收穫：產物 CSS 676 KB → 350 KB，其中每頁都載、會阻塞繪製的
  //    default.css 是 516 KB → 199 KB。完整量測見
  //    architecture/2026-09-04-request-reduction-design.md §7.x。
  //
  // Noto Serif TC 用 `provider: 'none'`（＝不要用任何 provider 解析這個家族）：
  // 它來自 common-components 的 CSS，@nuxt/fonts 掃到 font-family 就自動去 Google 解析、
  // 注入 108 條 @font-face 並下載 108 支 woff2；但真正引用它的三個 class
  // （.nmd-header / .nmd-menu / .nmd-service-title）在本站渲染出來的 HTML 裡一次都沒出現。
  // 它本來就不佔 request（沒被使用的家族瀏覽器不會下載），拿掉是為了省 CSS 體積與
  // 108 支永遠用不到的部署產物。_fonts 從 227 支降到 119 支全部來自這一項。
  fonts: {
    families: [
      { name: 'Noto Sans', provider: 'google', weights: ['300 500'] },
      { name: 'Noto Sans TC', provider: 'google', weights: ['300 500'] },
      { name: 'Noto Serif TC', provider: 'none' },
    ],
  },

  // 讓區網設備可以使用，例如手機
  // devServer: {
  //   host: "0.0.0.0",
  //   port: 3000,
  // },

  ssr: true,

  // ── 減少每位訪客打到 origin 的 request（正式站有限流，見 architecture/2026-09-04-request-reduction-design.md）
  experimental: {
    // /_nuxt/builds/meta/<id>.json：純靜態站用不到（沒有 route rules、不需要偵測新版）。
    // 而且它用 ofetch 抓，預設對 429 會立刻重試一次，被限流時等於自己再補一刀。
    appManifest: false,
    // _payload.json：全站沒有 useAsyncData / useFetch，檔案只有 69 bytes，純多一個 request
    // （連帶那條 <link rel="preload" as="fetch">）。連續閱讀頁還會因六個 #hash 連結抓同一份 3 次。
    payloadExtraction: false,
    // chunk 抓不到時不要自動整頁 reload（429 連鎖），交給 plugins/chunk-error.client.ts 節流。
    emitRouteChunkError: 'manual',
    defaults: {
      nuxtLink: {
        // 預設是連結一進視窗就 prefetch 目標頁的 JS + CSS（+ payload）。header 選單 7 個連結
        // 一載入就多 34 個 request。改成 hover / touchstart 才抓。
        prefetchOn: { visibility: false, interaction: true },
      },
    },
  },

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
    head: {
      // in-app 字級量測，必須早於首次繪製 —— 見上方 TZ_PROBE 的說明。
      script: [{ innerHTML: TZ_PROBE, tagPosition: 'bodyOpen' }],
    },

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

    // textZoomNormalize 掛在 PostCSS —— 那是唯一能同時涵蓋 SCSS 產出、Tailwind v4 產出，
    // 且 dev 與 build 都生效的位置（Vite 在前處理器之後才跑 PostCSS）。
    // ⚠️ 用 hook 附加而不是直接寫 `vite.css.postcss`：後者會整份覆蓋掉 Nuxt 預設放進來的
    //    plugins（autoprefixer 等），等於默默關掉 prefix。
    'vite:extendConfig': (config) => {
      const mutable = config as { css?: { postcss?: string | { plugins?: unknown[] } } };
      const css = (mutable.css ??= {});
      if (typeof css.postcss === 'string') return; // 指向外部 postcss 設定檔時不介入（本專案沒有）
      const postcss = (css.postcss ??= {}) as { plugins?: unknown[] };
      postcss.plugins = [...(postcss.plugins ?? []), textZoomNormalize()];
    },

    'build:manifest': (manifest) => {
      const removed = stripImagePrefetch(
        manifest as unknown as Record<string, { assets?: string[] }>,
      );
      if (removed) console.info(`[strip-image-prefetch] 移除 ${removed} 筆圖片 prefetch hint`);
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
      // 只內嵌白名單的小 SVG（logo、箭頭、AI spark），其餘一律輸出實體檔 ——
      // 本專案圖片多半靠 runtimeConfig 的 APP_ASSETS_PATH 在 runtime 組路徑（見 UPic/UVid），
      // 需要實體檔案存在。白名單與理由見 build/inline-svg-assets.ts。
      assetsInlineLimit: (filePath) => shouldInlineAsset(filePath),
      rollupOptions: {
        output: {
          // 首頁 11 支 modulepreload 有 8 支小於 6 KB（最小 91 bytes），每支都是一個 request。
          // 讓 rollup 把小於 20 KB 的 chunk 併進引用者。只影響切割，不影響 preload-page-chunks 的別名邏輯。
          experimentalMinChunkSize: 20_000,
        },
      },
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
