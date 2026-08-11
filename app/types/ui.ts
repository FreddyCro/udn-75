// 共用 UI 元件的型別。

// UBtn 的配色預設值組（見 components/ui/UBtn.vue 的 variant 表）。
// 需要具名型別是因為 locales JSON 的 variant 欄位只會推論成 string，
// 呼叫點得 `as UBtnVariant` 才對得上 prop。
export type UBtnVariant = 'primary' | 'outline' | 'gray';
