import { describe, expect, it } from 'vitest';
import str from '../app/locales/section1.json';

// Hero.vue 以 v-for 逐段渲染 intro.body。若有人把它改回單一字串，Vue 會對字串做迭代、
// 逐「字」產生一個 <p> —— 畫面炸開卻不會有任何錯誤訊息。這支就是守那件事。
describe('section1.json 的 intro', () => {
  it('body 是三段字串，且每段非空', () => {
    expect(Array.isArray(str.intro.body)).toBe(true);
    expect(str.intro.body).toHaveLength(3);
    for (const p of str.intro.body) {
      expect(typeof p).toBe('string');
      expect(p.trim().length).toBeGreaterThan(0);
    }
  });
});
