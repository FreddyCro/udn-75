import type { AtRule, Plugin } from 'postcss';

/**
 * in-app 字級正規化：把全站的字級改寫成「除以 --tz」。
 *
 * ## 為什麼需要
 * Android WebView（LINE／FB／IG 的 in-app 瀏覽器）把系統「字體大小」當 **text zoom** 套用：
 * 只放大字、版面的 px 不動 → 固定寬容器內的文字擠爆、斷行位置跑掉。
 * Chrome for Android 自 M113 起改走**整頁縮放**，字與版面等比放大所以不壞 —— 這也是
 * 「in-app 看起來比 Chrome 大」的來源。iOS 的 WKWebView 不套用 Dynamic Type，不受影響。
 *
 * ## 為什麼只能用除法
 * 沒有任何 CSS 長度單位能追蹤放大後的字：text zoom 乘在 **computed** font size 上
 * （Blink 的 `FontBuilder::GetComputedSizeFromSpecifiedSize`），而 `em` / `rem` 是從
 * **specified** font size 解析的（`CSSToLengthConversionData::FontSizes`）。
 * `-webkit-text-size-adjust` 也沒用 —— 它只 gate text autosizer，不 gate text zoom。
 * 2026-08-27 於 Pixel 9a ╱ LINE 實機逐一驗過：`8em`、`14.4ch`、`text-size-adjust: none`
 * 全部無效，只有「把 specified 字級除掉倍率 s、讓 WebView 再乘回來」能與 Chrome 一致。
 *
 * ## 契約
 * - 倍率 s 由 `<head>` 的 inline script 量測後寫進 `--tz-measured`（見 nuxt.config.ts）。
 * - `--tz` 的取值與全站開關在 `app/assets/styles/base.scss`。
 * - **`--tz` 預設 1 → `calc(15px / 1)` 就是 15px**，非 in-app 環境（桌機、Chrome、iOS）
 *   渲染結果與改寫前完全相同。這也是回退方式：把 base.scss 那條 `--tz` 改回 1 即可。
 *
 * ## 為什麼放在 PostCSS 而不是改原始碼
 * dev 與 build 都生效；一次涵蓋 SCSS 產出、Tailwind v4 產出與 @nuxt/fonts 注入；
 * 之後新寫的 `font-size: 20px` 自動納入，不會因為有人忘記包 calc 而破功。
 */

/** 已經帶補償的值：重跑（PostCSS 8 會 re-visit 改過的節點）或原始碼自己寫了都不再動 */
const ALREADY = /var\(\s*--tz[\s,)]/;

/**
 * 相對字級（`1.2em` / `120%` / `2ex`…）：字級的繼承鏈本來就會自己對齊 —— 父層已經除過 s，
 * 子層再除一次會變成 s²。故一律跳過。
 */
const RELATIVE_FONT_SIZE = /\d\s*(?:em|rem|ex|ch|ic|cap|lh|rlh|%)(?![a-z%])/i;

/** 關鍵字字級沒有數值可除 */
const FONT_SIZE_KEYWORDS = new Set([
  'inherit',
  'initial',
  'unset',
  'revert',
  'revert-layer',
  'xx-small',
  'x-small',
  'small',
  'medium',
  'large',
  'x-large',
  'xx-large',
  'xxx-large',
  'smaller',
  'larger',
]);

/**
 * 值裡的 em 長度。
 * 不會誤中 `rem`：`1rem` 的 `em` 前面是 `r` 而非數字，`(-?\d*\.?\d+)em` 匹配不到。
 */
const EM_LENGTH = /(-?\d*\.?\d+)em\b/g;

/** 這些屬性的值不是長度，別亂碰 */
const SKIP_PROPS = new Set(['content', 'font-family', 'src', 'grid-template-areas']);

/**
 * 單一宣告的改寫規則（純函式，不需要改寫時原值回傳）。
 * 邏輯抽出來是為了測得到 —— 專案沒有頂層的 postcss 相依，測試跑不了 PostCSS pipeline，
 * 只能測純函式（與 build/dedupe-font-face.ts 同一個做法）。
 */
export function normalizeValue(
  prop: string,
  value: string,
  opts: { inFontFace?: boolean } = {},
): string {
  if (!value) return value;

  // 自訂屬性宣告不動：存的可能不是長度（`--maxWidth: 1fr`），而真正該補償的是
  // 「消費它的那條宣告」—— `font-size: var(--text-body)` 會在下面被接手。
  if (prop.startsWith('--')) return value;

  if (ALREADY.test(value)) return value;
  if (SKIP_PROPS.has(prop)) return value;
  if (value.includes('url(')) return value;

  // @font-face 裡的 size-adjust / src 之類與版面無關
  if (opts.inFontFace) return value;

  if (prop === 'font-size') {
    if (FONT_SIZE_KEYWORDS.has(value.trim().toLowerCase())) return value;
    if (RELATIVE_FONT_SIZE.test(value)) return value;
    // 外層括號讓 calc() / min() / clamp() / var() 這些複合值也能安全巢套
    return `calc((${value}) / var(--tz, 1))`;
  }

  // specified 字級被除小之後，`em` 長度會等比縮小（em 從 specified 算）→ 乘回來。
  // 現況集中在 letter-spacing（17 處）、width / max-width（7 處）等，全部都該跟著
  // 渲染出來的字走，而不是跟著被除小的 specified 值走。
  EM_LENGTH.lastIndex = 0;
  return value.replace(EM_LENGTH, (match, num: string) =>
    Number(num) === 0 ? match : `calc(${match} * var(--tz, 1))`,
  );
}

export function textZoomNormalize(): Plugin {
  return {
    postcssPlugin: 'text-zoom-normalize',

    Declaration(decl) {
      const parent = decl.parent;
      const inFontFace =
        parent?.type === 'atrule' && (parent as AtRule).name === 'font-face';
      const next = normalizeValue(decl.prop, decl.value, { inFontFace });
      if (next !== decl.value) decl.value = next;
    },
  };
}

textZoomNormalize.postcss = true;
