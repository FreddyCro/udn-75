<script setup lang="ts">
// <SymbolFaceDevPanel> 的一般欄位列：依 schema 的 kind 挑控制項。
// 抽出來是因為同一份樣板要在 7 個分組裡各長一次，寫在面板裡會把它撐成一大坨 v-if 鏈。
//
// range 的作法比 gemini 多一點：它只有唯讀的數值，這裡數值本身是可輸入的數字框
// （樣式上偽裝成文字），設計師要精確值時不必和滑桿的 step 搏鬥。
import type { SymbolField } from '~/utils/symbol-face-schema';

defineProps<{ field: SymbolField }>();
const value = defineModel<any>();
</script>

<template>
  <div class="field">
    <label class="field__label">
      <span class="field__name" :title="field.key">{{ field.label }}</span>

      <template v-if="field.kind === 'range'">
        <input
          v-model.number="value"
          class="field__val"
          type="number"
          :min="field.min"
          :max="field.max"
          :step="field.step ?? 1"
        />
        <span v-if="field.unit" class="field__unit">{{ field.unit }}</span>
      </template>

      <input
        v-else-if="field.kind === 'bool'"
        v-model="value"
        class="field__check"
        type="checkbox"
      />

      <input
        v-else-if="field.kind === 'color'"
        v-model="value"
        class="field__color"
        type="color"
      />
    </label>

    <input
      v-if="field.kind === 'range'"
      v-model.number="value"
      class="field__range"
      type="range"
      :min="field.min"
      :max="field.max"
      :step="field.step ?? 1"
    />

    <select
      v-else-if="field.kind === 'select'"
      v-model="value"
      class="field__input"
    >
      <option v-for="o in field.options" :key="o" :value="o">{{ o }}</option>
    </select>

    <input
      v-else-if="field.kind === 'num'"
      v-model.number="value"
      class="field__input"
      type="number"
      :step="field.step ?? 1"
    />

    <input
      v-else-if="field.kind !== 'bool' && field.kind !== 'color'"
      v-model="value"
      class="field__input"
      type="text"
    />
  </div>
</template>

<style lang="scss" scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 5px 0;
}

.field__label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: bold;
  color: #aaa;
}

.field__name {
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 偽裝成純文字的數字框：看起來就是 gemini 那個 .val，但可以直接打字改值
.field__val {
  flex: 0 0 auto;
  width: 5.5em;
  padding: 1px 2px;
  font-family: ui-monospace, 'Courier New', monospace;
  font-size: 12px;
  text-align: right;
  color: #77c6e0;
  background: none;
  border: 1px solid transparent;
  border-radius: 3px;

  &:hover,
  &:focus {
    background: #2b2b2b;
    border-color: #444;
    outline: none;
  }
}

.field__unit {
  flex: 0 0 auto;
  font-family: ui-monospace, 'Courier New', monospace;
  font-size: 12px;
  color: #77c6e0;
}

.field__range {
  width: 100%;
  cursor: pointer;
  accent-color: #77c6e0;
}

.field__check {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  accent-color: #77c6e0;
  cursor: pointer;
}

.field__color {
  flex: 0 0 auto;
  width: 36px;
  height: 32px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
}

.field__input {
  width: 100%;
  padding: 6px 10px;
  font-family: ui-monospace, 'Courier New', monospace;
  font-size: 12px;
  color: #77c6e0;
  background: #2b2b2b;
  border: 1px solid #444;
  border-radius: 4px;

  &:focus {
    border-color: #77c6e0;
    outline: none;
  }
}
</style>
