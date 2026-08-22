import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// 子頁的兩種錨點導覽（pc 右側 rail / <1280 底部列）**全程顯示** —— 一進入子頁的 hero
// 那一屏就在，不跟著舞台進度出沒。
//
// 這條規則的實作方式是「layout 直接傳字面上的 visible」，而不是接一面會變的旗子。
// 原本底部列吃 useSubpageAnchor 的 visible，由舞台 pin 的 onLeave／onEnterBack 寫入
//（「舞台演完才滑入」）；改成全程顯示後那面旗子恆真，連同它的 scroll 模式閂鎖與
// reduced-motion 專用 trigger 一起移除了。
//
// 這支守兩件事：
//  1. layout 對兩個元件都傳字面 visible（寫成 :visible="..." 就是又接回一面會變的旗子）
//  2. useSubpageAnchor 沒有再長出顯隱旗子（長回來就是規則被偷偷改掉了）
// 失敗方向是靜默的：錨點在 hero 那一屏消失，但不會報錯。

const LAYOUT = readFileSync(join('app', 'layouts', 'subpage.vue'), 'utf8');
const COMPOSABLE = readFileSync(
  join('app', 'composables', 'useSubpageAnchor.ts'),
  'utf8',
);

/** 取出某個元件標籤（含屬性）的整段文字 */
const tag = (name: string): string =>
  LAYOUT.match(new RegExp(`<${name}\\b[^>]*/?>`))?.[0] ?? '';

describe('子頁錨點導覽全程顯示', () => {
  it.each(['SubpageAnchor', 'SubpageAnchorBar'])(
    '%s 在 layout 裡有被渲染',
    (name) => {
      expect(tag(name), `layouts/subpage.vue 找不到 <${name}>`).not.toBe('');
    },
  );

  it.each(['SubpageAnchor', 'SubpageAnchorBar'])(
    '%s 拿到的是字面 visible（不是綁定的旗子）',
    (name) => {
      const t = tag(name);
      // 字面：`visible` 或 `visible="true"`；綁定：`:visible="x"` / `v-bind:visible`
      expect(
        /(?:^|\s)visible(?:\s|\/|>|="true")/.test(t),
        `<${name}> 沒有字面 visible：${t}`,
      ).toBe(true);
      expect(
        /(?::visible|v-bind:visible)/.test(t),
        `<${name}> 又把顯隱接回會變的旗子了：${t}`,
      ).toBe(false);
    },
  );

  it('useSubpageAnchor 沒有顯隱旗子（恆真的旗子不該留著）', () => {
    expect(/subpage-anchor-visible/.test(COMPOSABLE)).toBe(false);
    // return 的成員裡不該再有 visible（mode / activeSlug / jumpToSlug… 不受影響）
    const ret = COMPOSABLE.match(/return\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(ret).not.toMatch(/\bvisible\b/);
    expect(ret).toMatch(/\bmode\b/); // 守門員：真的抓到 return 那一行
  });
});
