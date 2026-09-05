import { pickArtBreakpoint, type ArtBp } from '~/utils/art-sprite';

/**
 * 目前的藝術字斷點。SSR 與掛載前是 null（此時 <UArtLine> 不渲染素材，只有 SCSS 撐出的行盒），
 * 掛載後依視窗寬決定並跟著 resize 更新。全站共用一份監聽，不在每一行各掛一個 listener。
 *
 * module-level 的 ref：只在 import.meta.client 分支內被寫入，SSR 期間永遠不會執行到那段，
 * 故不會有 module scope 在 server 跨 request 共享的污染問題（同 useSfx.ts 的 pool 說明）。
 */
const bp = ref<ArtBp | null>(null);
let listening = false;

export function useArtBreakpoint() {
  if (import.meta.client && !listening) {
    listening = true;
    const update = () => (bp.value = pickArtBreakpoint(window.innerWidth));
    onMounted(update);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', update, { passive: true });
    }
  }
  return bp;
}
