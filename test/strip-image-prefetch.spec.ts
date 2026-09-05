import { describe, expect, it } from 'vitest';
import { stripImagePrefetch } from '../build/strip-image-prefetch';

// Nuxt 會為每個 async chunk 的 assets 發 <link rel="prefetch" as="image">。
// face.webp 因此被抓兩次（prefetch 沒帶 crossorigin、SymbolFace 的 Image() 是 anonymous，
// 快取 key 不同）。把圖片從 assets 拿掉就不會有那條 hint；CSS 與 JS 不動。
describe('stripImagePrefetch', () => {
  it('移掉 webp / svg / png / jpg / jpeg / gif，保留 css 與 js', () => {
    const manifest = {
      'a.js': { assets: ['face.CCI6lCoc.webp', 'logo.BctWNfUN.svg', 'x.css'] },
      'b.js': { assets: ['pic.png', 'photo.jpg', 'anim.gif', 'y.jpeg'] },
      'c.js': {},
    };
    const removed = stripImagePrefetch(manifest);
    expect(removed).toBe(6);
    expect(manifest['a.js'].assets).toEqual(['x.css']);
    expect(manifest['b.js'].assets).toEqual([]);
    expect(manifest['c.js']).toEqual({});
  });
});
