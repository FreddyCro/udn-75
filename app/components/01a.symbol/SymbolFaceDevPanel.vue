<script setup lang="ts">
// <SymbolFace> 的參數儀表板（只在 demo 頁掛載，正式站沒有這支）。
//
// 版型與配色取自設計師選定的 temp/gemini-code-*.html：左畫布 / 右側欄 380px、
// #1e1e1e 底、#77c6e0 為標題與數值色、滑桿為主的欄位、glitch 用卡片。
//
// 兩條回傳路徑，對應 SymbolFace 的兩個方法：
//   ・emit('live')  —— 顏色類欄位，每次 input 都送，SymbolFace 只換 ramp texture 與 uniform。
//     設計師調色因此是即時的：不重取樣、不重烘 atlas、不重跑 3 秒組合動畫。
//   ・emit('apply') —— 按 ↻ Refresh 才送，SymbolFace 整組重建。結構類參數非重建不可
//     （格數改了幾何就得重算），所以它們維持「改完再按一次」。
//
// 欄位表在 ~/utils/symbol-face-schema；color / colorStops / glitchItems 三項不在表內，
// 它們是下面手寫的專用元件（漸層色票列、色標滑桿、glitch 卡片）。
import {
  SYMBOL_CONFIG_SCHEMA,
  SYMBOL_COLOR_GROUP,
  SYMBOL_LIVE_COLOR_KEYS,
  SYMBOL_MAX_COLOR_STOPS,
  SYMBOL_MAX_GLITCH_ITEMS,
  equidistantStops,
  type SymbolField,
} from '~/utils/symbol-face-schema';
import type { SymbolMode } from '~/composables/useOrangeCoreProgress';

interface GlitchItem {
  color: string;
  density: number;
  fps: number;
}

const props = defineProps<{
  /** SymbolFace 併入 default 後的實際設定；null ＝ 它還沒掛載，面板先不初始化 */
  initial: Record<string, any> | null;
  /** 實際採用的格數與粒子數（cols 可能因 maxParticles 被降過） */
  stats: { cols: number; rows: number; count: number };
}>();

const emit = defineEmits<{
  apply: [config: Record<string, any>];
  live: [config: Record<string, any>];
}>();

const mode = defineModel<SymbolMode>('mode', { default: 'face' });

const MODES: { value: SymbolMode; label: string }[] = [
  { value: 'face', label: '集合' },
  { value: 'disperse', label: '分散' },
  { value: 'converge', label: '匯聚成點' },
];

// ---------- 分組 ----------
// 顏色排第一且預設展開（設計師最常動的就是它）；其餘依 schema 順序往後、預設收合。
const GROUPS = [...new Set(SYMBOL_CONFIG_SCHEMA.map((f) => f.group))];
const fieldsOf = (group: string) =>
  SYMBOL_CONFIG_SCHEMA.filter((f) => f.group === group);

// ---------- draft ----------
// 一般欄位：range / num / bool / color / select 直接存原生型別（v-model.number 就位），
// 只有 csvNum / csvStr 兩種還是字串，套用時才 split。
const draft = reactive<Record<string, any>>({});
// 手寫欄位：色票、色標位置、glitch 各自獨立成陣列，才能做增刪與分別的滑桿。
const colors = ref<string[]>([]);
const stops = ref<number[]>([]);
const glitch = ref<GlitchItem[]>([]);
// 最後一次成功套用的值：某欄位轉型失敗時回退到這裡（而不是回到 initial，
// 那會把使用者這輪其他改好的東西一起吃掉）
let applied: Record<string, any> = {};
const cfgError = ref('');

// input[type=color] 只吃 #rrggbb —— 餵它 #000 會被瀏覽器判為無效值（console 一排警告）
// 並悄悄退回 #000000，之後任何一次 emit 都會把使用者沒動過的欄位改寫成那個退回值。
// 專案裡的色票寫法混用三碼與六碼，所以進面板時一律補滿。
const normalizeHex = (val: any) => {
  const s = String(val ?? '').trim();
  const m = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(s);
  return m ? `#${m[1]}${m[1]}${m[2]}${m[2]}${m[3]}${m[3]}` : s;
};

const toDraft = (val: any, kind: SymbolField['kind']) => {
  if (kind === 'csvNum' || kind === 'csvStr') return (val ?? []).join(', ');
  if (kind === 'color') return normalizeHex(val);
  return val;
};

// draft → 正確型別。轉不出來一律 throw，由呼叫端決定回退。
const fromDraft = (val: any, kind: SymbolField['kind']) => {
  if (kind === 'range' || kind === 'num') {
    // ⚠️ 不能直接 Number(val)：Number('') === 0，清空欄位會**悄悄**變成 0 ——
    //    例如 charAspect: 0 會讓格高算出 Infinity，畫面壞掉卻沒有任何提示。
    const s = String(val).trim();
    const n = Number(s);
    if (s === '' || !Number.isFinite(n)) throw new Error('不是有效數字');
    return n;
  }
  if (kind === 'bool') return !!val;
  if (kind === 'csvNum')
    return String(val)
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n));
  if (kind === 'csvStr')
    return String(val)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  return val; // color / text / select
};

// SymbolFace 掛載完把它的 cfg 交過來 → 初始化整個面板
watch(
  () => props.initial,
  (init) => {
    if (!init) return;
    for (const f of SYMBOL_CONFIG_SCHEMA) draft[f.key] = toDraft(init[f.key], f.kind);

    const list = (
      Array.isArray(init.color) ? init.color : [init.color ?? '#ffffff']
    ).map(normalizeHex);
    colors.value = list;
    // 長度對不上就退回等距 —— buildColorRamp 對長度不合的 stops 也是這樣處理，
    // 這裡先對齊，之後每次增刪色票都維持這個不變式。
    const s = Array.isArray(init.colorStops) ? [...init.colorStops] : [];
    stops.value = s.length === list.length ? s : equidistantStops(list.length);

    glitch.value = (init.glitchItems ?? [])
      .slice(0, SYMBOL_MAX_GLITCH_ITEMS)
      .map((g: GlitchItem) => ({ ...g, color: normalizeHex(g.color) }));

    applied = { ...init };
  },
  { immediate: true },
);

// ---------- 顏色：即時送出 ----------
// 端點永遠釘在 0 / 1（面板只給中間色標滑桿），所以組 payload 時直接補回去。
const colorPayload = (): Record<string, any> => {
  const list = [...colors.value];
  const single = list.length <= 1;
  const pos = [...stops.value];
  if (!single) {
    pos[0] = 0;
    pos[list.length - 1] = 1;
  }
  return {
    color: single ? (list[0] ?? '#ffffff') : list,
    colorStops: single ? [] : pos.slice(0, list.length),
    colorMode: draft.colorMode,
    bgColor: draft.bgColor,
    convergeColor: draft.convergeColor,
    phraseColor: draft.phraseColor,
    glitchItems: glitch.value.map((g) => ({ ...g })),
  };
};

const emitLive = () => {
  const payload = colorPayload();
  Object.assign(applied, payload);
  emit('live', payload);
};

// deep：glitch 卡片與 stops 是就地改陣列元素
watch(
  [
    colors,
    stops,
    glitch,
    () => draft.colorMode,
    () => draft.bgColor,
    () => draft.convergeColor,
    () => draft.phraseColor,
  ],
  emitLive,
  { deep: true },
);

// ---------- 色票增刪 ----------
// 每次增刪都同步動 colors 與 stops，維持兩者等長（buildColorRamp 的前提）。
const addColor = () => {
  const n = colors.value.length;
  if (n >= SYMBOL_MAX_COLOR_STOPS) return;
  // 插在最後一個色票之前：新色接手「倒數第二段」，既有的高光端不動
  const prev = n >= 2 ? (stops.value[n - 2] ?? 0) : 0;
  colors.value.splice(n - 1, 0, colors.value[n - 1] ?? '#ffffff');
  stops.value.splice(n - 1, 0, (prev + 1) / 2);
};

const removeColor = (i: number) => {
  if (colors.value.length <= 2) return;
  colors.value.splice(i, 1);
  stops.value.splice(i, 1);
};

// 中間色標拖動時夾在左右鄰居之間，避免漸層順序交錯（同 gemini 對 pos2/pos3 的處理）
const setStop = (i: number, value: number) => {
  const lo = stops.value[i - 1] ?? 0;
  const hi = stops.value[i + 1] ?? 1;
  stops.value[i] = Math.min(hi, Math.max(lo, value));
};

// ---------- glitch 卡片 ----------
// 長度對齊 SYMBOL_MAX_GLITCH_ITEMS，否則後面幾組新增出來會是清一色的白（見 addGlitch 的 ??）
const GLITCH_PALETTE = [
  '#ffff00',
  '#ff00ff',
  '#00ffff',
  '#ff8800',
  '#54dd22',
  '#ffa3d9',
];
const addGlitch = () => {
  if (glitch.value.length >= SYMBOL_MAX_GLITCH_ITEMS) return;
  glitch.value.push({
    color: GLITCH_PALETTE[glitch.value.length] ?? '#ffffff',
    density: 2,
    fps: 10,
  });
};
const removeGlitch = (i: number) => glitch.value.splice(i, 1);

// ---------- Refresh / Export ----------
const buildConfig = (): Record<string, any> => {
  cfgError.value = '';
  const next: Record<string, any> = { ...colorPayload() };
  for (const f of SYMBOL_CONFIG_SCHEMA) {
    // 顏色類已由 colorPayload 供應，跳過（draft 裡也有，但以 payload 為準）
    if ((SYMBOL_LIVE_COLOR_KEYS as readonly string[]).includes(f.key)) continue;
    try {
      next[f.key] = fromDraft(draft[f.key], f.kind);
    } catch {
      cfgError.value = `${f.label} 格式錯誤，已保留原值`;
      next[f.key] = applied[f.key];
    }
  }
  return next;
};

const applyAll = () => {
  const next = buildConfig();
  applied = { ...applied, ...next };
  emit('apply', next);
};

const exportLabel = ref('⬇ Export JSON');
let exportResetTimer: ReturnType<typeof setTimeout> | null = null;
const exportConfig = () => {
  const json = JSON.stringify({ ...buildConfig(), mode: mode.value }, null, 2);

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'symbol-face-config.json';
  a.click();
  URL.revokeObjectURL(url);

  navigator.clipboard?.writeText(json).catch(() => {});

  exportLabel.value = '✓ 已匯出';
  if (exportResetTimer) clearTimeout(exportResetTimer);
  exportResetTimer = setTimeout(() => {
    exportLabel.value = '⬇ Export JSON';
  }, 1600);
};
onBeforeUnmount(() => {
  if (exportResetTimer) clearTimeout(exportResetTimer);
});
</script>

<template>
  <aside class="panel">
    <h2 class="panel__title">Symbol Studio</h2>

    <!-- initial 是 SymbolFace 掛載後才交過來的（見 pages/demo.vue）。在那之前不渲染欄位：
         色票會拿到 undefined（input[type=color] 判為無效值）、色標的 v-for 會收到負數長度。 -->
    <template v-if="initial">
      <!-- ══ 顏色（設計師最常動的一組，排最前、預設展開） ══ -->
      <details class="panel__group" open>
        <summary class="panel__summary">顏色</summary>

        <div class="panel__block">
          <div class="panel__block-head">
            <span class="panel__label">漸層色票（左＝暗部，右＝亮部）</span>
            <button
              class="panel__btn panel__btn--mini"
              type="button"
              :disabled="colors.length >= SYMBOL_MAX_COLOR_STOPS"
              @click="addColor"
            >
              + 色標
            </button>
          </div>
          <div class="panel__swatches">
            <div v-for="(c, i) in colors" :key="i" class="panel__swatch">
              <input v-model="colors[i]" type="color" class="panel__color" />
              <button
                class="panel__btn panel__btn--danger panel__btn--mini"
                type="button"
                :disabled="colors.length <= 2"
                @click="removeColor(i)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- 端點固定 0 / 1，只給中間色標滑桿（單色時沒有中間色標，v-for 不能收到負數） -->
        <div
          v-for="i in Math.max(0, colors.length - 2)"
          :key="`stop-${i}`"
          class="panel__field"
        >
          <label class="panel__label">
            色標 {{ i + 1 }} 位置
            <span class="panel__val">{{ Math.round((stops[i] ?? 0) * 100) }}%</span>
          </label>
          <input
            class="panel__range"
            type="range"
            min="0"
            max="100"
            step="1"
            :value="Math.round((stops[i] ?? 0) * 100)"
            @input="
              setStop(i, Number(($event.target as HTMLInputElement).value) / 100)
            "
          />
        </div>

        <SymbolFaceDevField
          v-for="f in fieldsOf(SYMBOL_COLOR_GROUP)"
          :key="f.key"
          v-model="draft[f.key]"
          :field="f"
        />
      </details>

      <!-- ══ Glitch 跳色 ══ -->
      <details class="panel__group" open>
        <summary class="panel__summary">
          Glitch 跳色
          <button
            class="panel__btn panel__btn--mini"
            type="button"
            :disabled="glitch.length >= SYMBOL_MAX_GLITCH_ITEMS"
            @click.prevent="addGlitch"
          >
            + 新增顏色
          </button>
        </summary>

        <p v-if="!glitch.length" class="panel__empty">未啟用</p>

        <div v-for="(g, i) in glitch" :key="i" class="panel__card">
          <div class="panel__card-head">
            <input v-model="g.color" type="color" class="panel__color" />
            <button
              class="panel__btn panel__btn--danger panel__btn--mini"
              type="button"
              @click="removeGlitch(i)"
            >
              刪除
            </button>
          </div>
          <div class="panel__field">
            <label class="panel__label">
              密度 <span class="panel__val">{{ g.density }}%</span>
            </label>
            <input
              v-model.number="g.density"
              class="panel__range"
              type="range"
              min="0"
              max="30"
              step="1"
            />
          </div>
          <div class="panel__field">
            <label class="panel__label">
              頻率 <span class="panel__val">{{ g.fps }} FPS</span>
            </label>
            <input
              v-model.number="g.fps"
              class="panel__range"
              type="range"
              min="0"
              max="60"
              step="1"
            />
          </div>
        </div>
      </details>

      <!-- ══ 其餘參數：預設收合，按 Refresh 才生效 ══ -->
      <details
        v-for="group in GROUPS.filter((g) => g !== SYMBOL_COLOR_GROUP)"
        :key="group"
        class="panel__group"
      >
        <summary class="panel__summary">{{ group }}</summary>
        <SymbolFaceDevField
          v-for="f in fieldsOf(group)"
          :key="f.key"
          v-model="draft[f.key]"
          :field="f"
        />
      </details>
    </template>

    <div class="panel__footer">
      <div class="panel__stats">
        {{ stats.cols }} × {{ stats.rows }} 格 ／
        {{ stats.count.toLocaleString() }} 顆
      </div>
      <div v-if="cfgError" class="panel__error">{{ cfgError }}</div>
      <div class="panel__modes">
        <button
          v-for="m in MODES"
          :key="m.value"
          class="panel__mode"
          :class="{ 'panel__mode--active': mode === m.value }"
          type="button"
          @click="mode = m.value"
        >
          {{ m.label }}
        </button>
      </div>
      <div class="panel__actions">
        <button
          class="panel__action panel__action--refresh"
          type="button"
          @click="applyAll"
        >
          ↻ Refresh
        </button>
        <button
          class="panel__action panel__action--export"
          type="button"
          @click="exportConfig"
        >
          {{ exportLabel }}
        </button>
      </div>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
// 配色 / 尺寸照 temp/gemini-code-*.html 的側欄。此處是 demo 專用的開發工具，
// 不套專案的設計 token（那是給正式站版面用的），刻意維持與那份參考稿一致。
.panel {
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #eee;
  background: #1e1e1e;
  border-left: 1px solid #333;
  box-shadow: -5px 0 20px rgb(0 0 0 / 50%);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 3px;
  }
}

.panel__title {
  margin: 0 40px 6px 0; // 右邊留給 demo 頁那顆固定的收合鈕
  font-size: 18px;
  color: #77c6e0;
}

.panel__group {
  border-bottom: 1px solid #2a2a2a;
}

// 分組標題（gemini 的 .section-title）。list-style: none 兩種寫法都要：
// WebKit 舊版只認 ::-webkit-details-marker。
.panel__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
  padding-bottom: 4px;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #77c6e0;
  border-bottom: 1px solid #333;
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }
}

.panel__block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 0;
}

.panel__block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.panel__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.panel__swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.panel__color {
  width: 36px;
  height: 32px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
}

.panel__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 5px 0;
}

.panel__label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  font-weight: bold;
  color: #aaa;
}

.panel__val {
  flex: 0 0 auto;
  font-family: ui-monospace, 'Courier New', monospace;
  color: #77c6e0;
}

.panel__range {
  width: 100%;
  cursor: pointer;
  accent-color: #77c6e0;
}

.panel__empty {
  margin: 8px 0;
  font-size: 12px;
  color: #666;
}

// glitch 卡片
.panel__card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
  padding: 10px;
  background: #252525;
  border: 1px solid #444;
  border-radius: 8px;
}

.panel__card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel__btn {
  padding: 4px 8px;
  font-family: inherit;
  font-size: 11px;
  font-weight: bold;
  color: #77c6e0;
  background: #2b2b2b;
  border: 1px solid #77c6e0;
  border-radius: 4px;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: #000;
    background: #77c6e0;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
}

.panel__btn--danger {
  color: #ff5555;
  border-color: #ff5555;

  &:hover:not(:disabled) {
    color: #fff;
    background: #ff5555;
  }
}

.panel__btn--mini {
  padding: 2px 6px;
  font-size: 10px;
}

// 黏在側欄底部：捲到哪都按得到 Refresh / Export
.panel__footer {
  position: sticky;
  bottom: -20px; // 抵銷 .panel 的 padding-bottom，才真的貼底
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
  padding: 10px 0 20px;
  background: #1e1e1e;
  border-top: 1px solid #333;
}

.panel__stats {
  font-family: ui-monospace, 'Courier New', monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: #77c6e0;
}

.panel__error {
  font-size: 12px;
  color: #ff9a9a;
}

.panel__modes {
  display: flex;
  gap: 6px;
}

.panel__mode {
  flex: 1 1 0;
  padding: 8px 4px;
  font-family: inherit;
  font-size: 12px;
  font-weight: bold;
  color: #77c6e0;
  background: #2b2b2b;
  border: 1px solid #77c6e0;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    color: #000;
    background: #77c6e0;
  }
}

.panel__mode--active {
  color: #000;
  background: #77c6e0;
}

.panel__actions {
  display: flex;
  gap: 8px;
}

.panel__action {
  flex: 1 1 0;
  padding: 10px 6px;
  font-family: inherit;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.04em;
  color: #000;
  border: 0;
  border-radius: 4px;
  white-space: nowrap;
  cursor: pointer;
}

.panel__action--refresh {
  background: #77c6e0;

  &:hover {
    background: #a5e0ff;
  }
}

.panel__action--export {
  background: #8fe3a0;

  &:hover {
    background: #aef0ba;
  }
}
</style>
