---
name: i18n-convention
description: How i18n / content text is structured in this UDN project (no i18n library, JSON externalization)
metadata:
  type: project
---

本專案（及參考專案 the-love-report）的「i18n」**不是多語系切換**，而是**文案外部化慣例**，沒有使用任何 i18n 套件（無 @nuxtjs/i18n、無 vue-i18n）。

慣例：
- 所有文字字串依 section / component 分檔，放在 `app/locales/*.json`。
- 元件直接 import：`import str from '~/locales/section-x.json'`，模板用 `{{ str.key }}`。
- 共用檔：`meta.json`（SEO，在 `app.vue` 用 `useSeoMeta` 消費）、`common.json`（header/nav）、`footer.json`（製作團隊名單）。
- `meta.json` 的圖片用 runtimeConfig `APP_ASSETS_PATH` 組路徑：`${ASSETS_PATH}/img/${meta.metaImage}`。

**Why:** 把中文文案與排版分離，方便編輯/校稿。
**How to apply:** 新增 section 時，在 `app/locales/` 建對應 JSON，元件直接 import 使用；不要引入 i18n 套件。
