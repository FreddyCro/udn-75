---
name: scroll-speed-knob
description: scrub 動畫的「相對速度旋鈕」＝在目標前墊 vh spacer 拉長捲動距離；已於 2026-08-03 移除，可從 7ff9f19 取回
metadata:
  type: reference
---

**捲動速度旋鈕（spacer 墊高法）**：要讓 ScrollTrigger `scrub` 的動畫「相對視窗變慢」，不是調 ease，而是在動畫終點之前插入一個空 div 撐開額外捲動距離——同一段動畫要捲更多才走完，看起來就變慢。

與 ease 正交，兩個旋鈕不要混用：

- **spacer（`MOVE_VH`）** 改的是 scrub 的**總距離** → 整體變慢／變快。
- **ease（`MOVE_EASE`）** 改的是同一段距離內的**節奏分佈**（慢起快收等），總距離不變。

實作是三件套：

1. config 常數 `export const MOVE_VH = 0;`（0 = 不額外墊，1 = 多墊 100vh）
2. 元件內 `const moveSpacerHeight = \`${MOVE_VH * 100}vh\`;`
3. template `<div class="sec1__move-spacer" :style="{ height: moveSpacerHeight }" aria-hidden="true" />`

⚠️ 關鍵前提：**spacer 必須落在該 ScrollTrigger 的 trigger 區間內**才有效。原例的 trigger 是 `.sec1`、`end: 'bottom bottom'`，spacer 在 `.sec1` 裡撐高 → section 變高 → scrub 距離跟著變長。若 spacer 放在 trigger 元素之外，或 `end` 用固定 `+=px`，墊高完全不起作用。

**現況**：2026-08-03 隨新設計稿移除（引言之後不再有 date 段，spacer 位置的內容已不存在）。原始實作可取回：

```
git show 7ff9f19:app/components/01.hero/Hero.vue          # moveSpacerHeight + template spacer
git show 7ff9f19:app/utils/orange-core-config.ts          # MOVE_VH 常數與註解
```

新稿的核心路徑（引言段、論壇段 path1/path2）若要調相對速度，照上面三件套重建即可。相關：[[four-animation-issues]]
