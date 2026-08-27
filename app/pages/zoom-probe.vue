<script setup lang="ts">
/**
 * ⚠️ 用完就刪 —— LINE in-app（Android WebView text zoom）跑版探測頁，不是產品程式碼。
 *
 * 目的：一頁問完三件事
 *   1. 這台手機在 LINE 裡的實際 text zoom 倍率 s（自我校準，不需要 Chrome 對照組：
 *      CJK 漢字的 advance 恆等於 1em，所以 10 個「中」在 font-size:100px 下的實寬
 *      在 s=1 時精確是 1000px，量到 1150 就是 s=1.15）。
 *   2. 哪些長度單位會跟著放大的字一起長（em / rem / ch / ex / ic / lh / max-content）
 *      —— 決定 footer 的欄寬該用什麼單位寫。
 *   3. `-webkit-text-size-adjust: none / 100%` 能不能一行關掉整頁的放大。
 *
 * 下方六個變體用真的 NmdAuthor 元件，只換外層的 --maxWidth，眼睛直接比哪個沒爆。
 */
import { NmdAuthor } from '@udn-digital-center/common-components';
import strFooter from '@/locales/footer.json';

definePageMeta({ layout: false });

const LONG = strFooter.credits.find((c) => c.title === '活動策畫行銷')?.names ?? '';

// 取幾列有代表性的：空白斷點／兩名＋頓號／三名／最長名單
const ROWS = [
  { title: '網頁策展、製作', names: '聯合報新聞部 視覺設計中心' },
  { title: '網頁、視覺設計', names: '柳佳妘、蘇韋豪' },
  { title: '監製', names: '范凌嘉、王茂臻、官振萱' },
  { title: '活動策畫行銷', names: LONG },
];

// 對稿 mob 是 120px（＝ 15px 字級下的 8 個全形字）
const VARIANTS: { key: string; label: string; css: string; divide?: boolean }[] = [
  { key: 'V1', label: '8em（現況）', css: '--maxWidth: 8em' },
  { key: 'V2', label: '120px（修復前）', css: '--maxWidth: 120px' },
  { key: 'V3', label: '8ic（漢字 advance）', css: '--maxWidth: 8ic' },
  // Noto Sans TC 的「0」advance 實測 0.555em → 14.4ch 在 15px 下正好 120px
  { key: 'V4', label: '14.4ch（「0」寬）', css: '--maxWidth: 14.4ch' },
  { key: 'V5', label: 'calc(120px * var(--tz))', css: '--maxWidth: calc(120px * var(--tz, 1))' },
  { key: 'V6', label: 'auto 1fr（保底不溢出）', css: '--maxWidth: 1fr' },
  // V7：反過來把字級除以 s → 渲染回設計字級，欄寬就不必動。這才是「跟 Chrome 完全一樣」。
  { key: 'V7', label: '字級 ÷ tz ＋ 欄寬 120px', css: '--maxWidth: 120px', divide: true },
];

type Row = { label: string; base: number; none: number; pct: number; expect: string };

const rows = ref<Row[]>([]);
const scale = ref(0);
const scaleNone = ref(0);
const info = ref<string[]>([]);

/** 在指定祖先下量一個探針的實寬（px）。 */
function w(host: HTMLElement, css: string, text = '') {
  const el = document.createElement('div');
  el.style.cssText = `position:absolute;left:0;top:0;font-size:100px;line-height:1;white-space:pre;${css}`;
  el.textContent = text;
  host.appendChild(el);
  const width = el.getBoundingClientRect().width;
  el.remove();
  return width;
}

const CJK10 = '中'.repeat(10);

/** 一組完整量測（給「預設 / tsa:none / tsa:100%」三個祖先各跑一次）。 */
function suite(host: HTMLElement) {
  return {
    渲染實寬: w(host, 'width:max-content', CJK10), // 10 全形字，s=1 時 = 1000
    數字實寬: w(host, 'width:max-content', '0'.repeat(10)),
    '1em': w(host, 'width:1em'), // s=1 時 = 100
    '1rem': w(host, 'width:1rem'), // s=1 時 = 16（root 預設字級）
    '10ic': w(host, 'width:10ic'), // s=1 時 = 1000
    '10ch': w(host, 'width:10ch'),
    '10ex': w(host, 'width:10ex'),
    '1lh': w(host, 'width:1lh'), // line-height:1 → s=1 時 = 100
  };
}

const EXPECT: Record<string, string> = {
  渲染實寬: '1000',
  數字實寬: '—',
  '1em': '100',
  '1rem': '16',
  '10ic': '1000',
  '10ch': '—',
  '10ex': '—',
  '1lh': '100',
};

onMounted(() => {
  const mk = (css: string) => {
    const el = document.createElement('div');
    el.style.cssText = `position:absolute;left:-99999px;top:0;width:0;height:0;${css}`;
    document.body.appendChild(el);
    return el;
  };
  const plain = mk('');
  const none = mk('-webkit-text-size-adjust:none;text-size-adjust:none');
  const pct = mk('-webkit-text-size-adjust:100%;text-size-adjust:100%');

  const a = suite(plain);
  const b = suite(none);
  const c = suite(pct);

  rows.value = Object.keys(a).map((k) => ({
    label: k,
    base: a[k as keyof typeof a],
    none: b[k as keyof typeof b],
    pct: c[k as keyof typeof c],
    expect: EXPECT[k] ?? '—',
  }));

  scale.value = a.渲染實寬 / 1000;
  scaleNone.value = b.渲染實寬 / 1000;

  // V5 用：量到的倍率寫進 :root，讓欄寬跟著字一起長
  document.documentElement.style.setProperty('--tz', String(scale.value || 1));

  const cs = getComputedStyle(plain);
  info.value = [
    `getComputedStyle(font-size) = ${cs.fontSize}（沒設就是繼承值）`,
    `innerWidth = ${window.innerWidth} / DPR = ${window.devicePixelRatio}`,
    `screen = ${window.screen.width}×${window.screen.height}`,
    `UA = ${navigator.userAgent}`,
  ];

  [plain, none, pct].forEach((el) => el.remove());
});

const verdict = computed(() => {
  const s = scale.value;
  if (!s) return '量測中…';

  const get = (label: string) => rows.value.find((r) => r.label === label)?.base ?? 0;
  const ok = (v: boolean) => (v ? '✅ 跟著長' : '❌ 不跟');
  // 有標準值的直接比（s=1 時 em=100 / rem=16 / lh=100）
  const byNominal = (v: number, nominal: number) => Math.abs(v / nominal - s) < 0.03;
  // 沒有標準值的用「同度量的實測寬」自我校準：10ic 對 10 全形字、10ch 對 10 個數字
  const byPair = (v: number, ref: number) => ref > 0 && Math.abs(v / ref - 1) < 0.03;

  const head = [
    `s = ${s.toFixed(3)}   （10 全形字實寬 ${get('渲染實寬').toFixed(0)} ÷ 1000）`,
    `innerWidth = ${typeof window === 'undefined' ? '?' : window.innerWidth}   DPR = ${
      typeof window === 'undefined' ? '?' : window.devicePixelRatio
    }`,
  ];

  if (Math.abs(s - 1) < 0.02) {
    return [
      ...head,
      '',
      '⚠️ s = 1，沒偵測到「只放大字」。兩種可能：',
      '   (a) 系統「字體大小」還沒調大 → 調大再重載',
      '   (b) 這個瀏覽器走整頁縮放（Chrome M113+）→ 正常，要看的是 innerWidth 變小',
    ].join('\n');
  }

  const killed = Math.abs(scaleNone.value - 1) < 0.02;
  return [
    ...head,
    '',
    `em  ${ok(byNominal(get('1em'), 100))}`,
    `rem ${ok(byNominal(get('1rem'), 16))}`,
    `lh  ${ok(byNominal(get('1lh'), 100))}`,
    `ic  ${ok(byPair(get('10ic'), get('渲染實寬')))}`,
    `ch  ${ok(byPair(get('10ch'), get('數字實寬')))}`,
    'max-content ✅ 跟著長（定義上必然）',
    '',
    `text-size-adjust:none 能否關掉放大：${killed ? '✅ 可以（一行全站解！）' : '❌ 沒用'}`,
  ].join('\n');
});
</script>

<template>
  <div class="probe">
    <h1 class="probe__h1">LINE in-app 字級放大探針</h1>
    <p class="probe__note">
      測法：把系統「字體大小」調到最大 → 用 <b>LINE</b> 開這頁截圖；再用 <b>Chrome</b> 開一次截圖對照。
    </p>

    <pre class="probe__verdict">{{ verdict }}</pre>

    <h2 class="probe__h2">1. 單位量測（探針字級一律 100px）</h2>
    <table class="probe__table">
      <thead>
        <tr>
          <th>項目</th>
          <th>s=1 應為</th>
          <th>預設</th>
          <th>tsa:none</th>
          <th>tsa:100%</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.label">
          <td>{{ r.label }}</td>
          <td class="probe__dim">{{ r.expect }}</td>
          <td>{{ r.base.toFixed(1) }}</td>
          <td>{{ r.none.toFixed(1) }}</td>
          <td>{{ r.pct.toFixed(1) }}</td>
        </tr>
      </tbody>
    </table>
    <ul class="probe__info">
      <li v-for="line in info" :key="line">{{ line }}</li>
    </ul>

    <h2 class="probe__h2">2. footer 名單六變體（真 NmdAuthor，只換 --maxWidth）</h2>
    <section v-for="v in VARIANTS" :key="v.key" class="probe__variant">
      <h3 class="probe__h3">{{ v.key }} — {{ v.label }}</h3>
      <div
        class="probe__stage"
        :class="{ 'probe__stage--divide': v.divide }"
        :style="v.css"
      >
        <NmdAuthor>
          <template v-for="row in ROWS" :key="row.title" #[row.title]>
            {{ row.names }}
          </template>
        </NmdAuthor>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.probe {
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: #222;

  &__h1 {
    margin: 0 0 8px;
    font-size: 20px;
  }

  &__h2 {
    margin: 32px 0 8px;
    padding-top: 12px;
    border-top: 2px solid #222;
    font-size: 17px;
  }

  &__h3 {
    margin: 0 0 4px;
    font-size: 15px;
    color: #b34700;
  }

  &__note {
    margin: 0 0 12px;
    color: #555;
  }

  &__verdict {
    margin: 0 0 16px;
    padding: 12px;
    background: #111;
    color: #7dff9b;
    font-size: 15px;
    font-family: ui-monospace, monospace;
    white-space: pre-wrap;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-family: ui-monospace, monospace;
    font-size: 13px;

    th,
    td {
      padding: 4px 6px;
      border: 1px solid #ccc;
      text-align: right;
    }

    th:first-child,
    td:first-child {
      text-align: left;
    }

    thead th {
      background: #eee;
    }
  }

  &__dim {
    color: #999;
  }

  &__info {
    margin: 8px 0 0;
    padding-left: 1.2em;
    font-size: 12px;
    color: #555;
    word-break: break-all;
  }

  &__variant {
    margin-bottom: 20px;
  }

  // 舞台限寬並畫出邊界：溢出／斷行變化一眼就看得到（mob 稿 375 扣左右 padding）
  &__stage {
    outline: 1px dashed #f00;
    background: #f1f1f1;

    .author-grid {
      padding-top: 8px;
      padding-bottom: 8px;
    }

    // V7：把 specified 字級先除掉 s，WebView 再乘回來 → 渲染出設計字級
    &--divide .author-grid {
      font-size: calc(15px / var(--tz, 1));
    }
  }
}
</style>
