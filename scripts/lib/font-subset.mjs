/**
 * 站台字型子集的共用規則：要收哪些字、怎麼分批、unicode-range 怎麼算。
 *
 * 為什麼獨立成一支共用模組：scripts/build-font-subset.mjs 用它決定要跟 Google 要什麼、
 * 產出什麼；test/font-subset.spec.ts 用它重新算一次來跟 manifest 對帳（抓「文案改了但
 * 忘記重跑」）。兩邊各寫一份規則遲早會分岔——共用同一份函式，規則只有一個真值。
 *
 * 背景：@nuxt/fonts 自架的是 Google 原本切好的 105 片 unicode-range 切片，一位訪客
 * 實測會抓 35–44 片（約 1.6 MB）。但全站實際只用到 2,094 個字元。改成「只包含站上
 * 真的出現過的字」的子集後，同樣的畫面只要 4 個 request。
 *
 * ⚠️ 站上**沒有**任何保底字型檔（nuxt.config 三個家族都是 `provider: 'none'`）。子集漏了
 *    哪個字，該字就掉到系統字型：看得見、但粗細字寬跟正文對不上，而且沒有任何錯誤訊號。
 *    守門完全靠這裡的 coverageReport()——見它的檔頭。
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { collectText, readGlyphSources } from './collect-glyphs.mjs';

/**
 * Google Fonts css2 `text=` 的單批上限。
 *
 * ⚠️ 實測是 **800 個字元**，而且超過時**不會回錯誤**——它會靜默忽略 `text=`、
 *    退回完整的 105 片切片清單（HTTP 200、CSS 看起來很正常）。所以 build 腳本必須
 *    驗「回來的 CSS 只有一個 url()」，不能只看 status code。
 *    （二分搜實測：800 ok、801 起就變 105 片。）
 *
 * 用 700 留 12.5% 餘裕，文案增刪時不會剛好卡在邊界。
 */
export const BATCH_MAX = 700;

/**
 * CJK 起點。U+2E80 以後是康熙部首／注音／CJK 標點／漢字／全形符號，
 * 這些西文版 Noto Sans 都沒有，只有 Noto Sans TC 出得了。
 */
export const CJK_START = 0x2e80;

/**
 * 要產的兩支子集家族。家族名**刻意沿用原本的名字**（'Noto Sans TC' / 'Noto Sans'），
 * 不另取 'xxx Subset'。
 *
 * 為什麼：站上已經沒有任何其他同名的 @font-face（nuxt.config 三個家族都是
 * `provider: 'none'`），所以不會有「同名時後宣告者覆蓋前者」的順序問題——那正是
 * 一開始改用別名的理由，現在前提消失了。
 *
 * 沿用原名的好處是**所有既有的 font-family 宣告原封不動就會指到子集**：
 * base.scss 的 html 堆疊、common-components 那 12 條自己宣告 font-family 的規則
 * （含影響全站每個 `<p>` 的全域規則）都不必改，也就不會動到任何一處的字體順序。
 *
 * ⚠️ 曾經走過別名那條路，結果是：為了讓套件那些規則也吃到子集，得在 base.scss 補一份
 *    選擇器覆寫，而覆寫會把該處的堆疊換成我們寫的版本——實測子頁 `.sp-p` 的第一順位
 *    因此從 'Noto Sans'（西文版）變成 TC，段落裡的英數字身跟著換掉。沿用原名沒有這個問題。
 */
export const FAMILIES = [
  {
    /** Google Fonts 上的家族名，同時也是我們宣告的家族名 */
    google: 'Noto Sans TC',
    slug: 'noto-sans-tc',
    /** 全部字元都要：TC 也得有 ASCII，西文字型缺字時才不會跳到系統字（見 nuxt.config 註解） */
    pick: () => true,
  },
  {
    google: 'Noto Sans',
    slug: 'noto-sans',
    /** 西文版只收非 CJK；送 CJK 過去 Google 也給不出來 */
    pick: (cp) => cp < CJK_START,
  },
];

/** Figma 規格 300–500，跟 nuxt.config 的 `weights: ['300 500']` 一致（可變字型單軸） */
export const WEIGHT = '300 500';

/** 依碼位切批。輸入已依碼位排序時，每批的 unicode-range 會是連續區段、最精簡。 */
export function splitBatches(chars, size = BATCH_MAX) {
  const out = [];
  for (let i = 0; i < chars.length; i += size) out.push(chars.slice(i, i + size));
  return out;
}

const hex = (n) => n.toString(16).toUpperCase().padStart(4, '0');
const one = (a, b) => (a === b ? `U+${hex(a)}` : `U+${hex(a)}-${hex(b)}`);

/** 碼位陣列 → CSS unicode-range 字串（連續碼位併成區段）。 */
export function unicodeRange(codepoints) {
  const sorted = [...new Set(codepoints)].sort((a, b) => a - b);
  if (!sorted.length) return '';
  const parts = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (const cp of sorted.slice(1)) {
    if (cp === prev + 1) {
      prev = cp;
      continue;
    }
    parts.push(one(start, prev));
    start = cp;
    prev = cp;
  }
  parts.push(one(start, prev));
  return parts.join(', ');
}

/** unicode-range 字串 → 碼位 Set（測試用來反推涵蓋範圍，跟來源字元對帳）。 */
export function parseUnicodeRange(range) {
  const out = new Set();
  for (const part of range.split(',')) {
    const m = /^U\+([0-9A-F]+)(?:-([0-9A-F]+))?$/i.exec(part.trim());
    if (!m) throw new Error(`[font-subset] 無法解析 unicode-range：${part}`);
    const a = parseInt(m[1], 16);
    const b = m[2] ? parseInt(m[2], 16) : a;
    for (let cp = a; cp <= b; cp++) out.add(cp);
  }
  return out;
}

/** 依 FAMILIES 的 pick 規則，把收集到的字元分給各家族。 */
export function charsFor(family, text) {
  return [...text].filter((c) => family.pick(c.codePointAt(0)));
}

/** 產物位置（相對專案根）。build 守門、測試、產生器三邊共用。 */
export const CSS_REL = 'app/assets/styles/generated/font-subset.css';
export const FONT_DIR_REL = 'app/assets/fonts';

/** 解析產出的 CSS → 每個 @font-face 的 { family, file, codepoints }。 */
export function parseFaces(css) {
  return [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => {
    const body = m[1];
    const pick = (re) => re.exec(body)?.[1]?.trim();
    const family = pick(/font-family:\s*'([^']+)'/);
    const file = pick(/src:\s*url\('([^']+)'\)/);
    const range = pick(/unicode-range:\s*([^;]+);/);
    if (!family || !file || !range) {
      throw new Error(`[font-subset] @font-face 缺欄位：${body.slice(0, 120)}`);
    }
    return { family, file: file.replace('../../fonts/', ''), codepoints: parseUnicodeRange(range) };
  });
}

/**
 * 對帳「站上出現的字」與「子集實際涵蓋的字」。
 *
 * 這是整套機制唯一的守門：漏字的表現是該字掉到系統字型 —— 看得見、但粗細字寬跟正文
 * 對不上，**沒有任何錯誤訊號**。三個地方共用這支函式，規則只有一個真值：
 *   ・scripts/check-font-subset.mjs（`pnpm generate` / `pnpm build` 前擋下來，不可繞過）
 *   ・test/font-subset.spec.ts（CI 與本機 `pnpm test`）
 *
 * 只驗「有沒有漏」，不驗「有沒有多」——子集比實際需要多收字元只是多幾 KB，無害。
 *
 * @returns {{ ok: boolean, missing: Array<{family: string, ch: string, cp: number}>,
 *             faces: Array<object>, glyphCount: number, reason?: string }}
 */
export function coverageReport(root) {
  const cssPath = join(root, CSS_REL);
  if (!existsSync(cssPath)) {
    return { ok: false, missing: [], faces: [], glyphCount: 0, reason: `找不到 ${CSS_REL}` };
  }
  const faces = parseFaces(readFileSync(cssPath, 'utf8'));
  const covered = new Map();
  for (const f of faces) {
    if (!covered.has(f.family)) covered.set(f.family, new Set());
    for (const cp of f.codepoints) covered.get(f.family).add(cp);
  }

  const text = collectText(readGlyphSources(root));
  const missing = [];
  for (const family of FAMILIES) {
    const set = covered.get(family.google);
    if (!set) {
      return { ok: false, missing: [], faces, glyphCount: [...text].length, reason: `CSS 裡沒有 '${family.google}' 的 @font-face` };
    }
    for (const ch of text) {
      const cp = ch.codePointAt(0);
      if (family.pick(cp) && !set.has(cp)) missing.push({ family: family.google, ch, cp });
    }
  }
  return { ok: missing.length === 0, missing, faces, glyphCount: [...text].length };
}
