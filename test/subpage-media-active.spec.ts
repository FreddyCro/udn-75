/**
 * 迴歸測試：舞台第三拍的媒體「淡出播完才停輪播」不能被回捲的 show 蓋掉。
 *
 * Subpage.vue 用淡出 tween 的 onComplete 把 mediaActive 收回。但若回捲落在淡出的
 * 最後一格 frame，gsap 的 overwrite: 'auto' 要等新 tween 首次 render 才砍掉舊 tween，
 * 舊的淡出會先播完並觸發 onComplete，把剛被 show 打開的 mediaActive 又關掉 ——
 * 畫面看得見卻停在第一張。而且此時 mediaState 已是 'shown'，同一拍內不會再換態，
 * 那個 if 分支不會再進，**不會自己恢復**，必須捲出那一拍再捲回來。
 *
 * 下半段用真的 gsap（真 ticker）跑時序：壞掉的窗口只有一格 frame 寬，且位置隨
 * timer jitter 移動，所以掃一段回捲時機、看整段有沒有壞，而不是賭單一時間點。
 */
import { gsap } from 'gsap';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  deferredStopStillApplies,
  type StageBlockState,
} from '../app/utils/subpage-stage-beats';

describe('deferredStopStillApplies', () => {
  it('淡出播完時該塊確實還不該演 → 這次停播算數', () => {
    expect(deferredStopStillApplies('before')).toBe(true);
    expect(deferredStopStillApplies('after')).toBe(true);
  });

  it('淡出播完時已被回捲接回 shown → 這次停播不算數', () => {
    expect(deferredStopStillApplies('shown')).toBe(false);
  });
});

/** Subpage.vue makeFade() 的 duration（0.4s） */
const FADE = 0.4;
/** 壞掉的窗口在淡出尾端一格 frame 內；掃最後 30ms（step 2）確保踩得到 */
const REVERSE_SWEEP = Array.from({ length: 16 }, (_, i) => 370 + i * 2);

/**
 * 照 Subpage.vue 的做法跑一次「淡出中回捲」：
 * shown →（換態 out）開始淡出 → reverseAtMs 後回捲成 shown、mediaActive 打開、show 接手。
 * guarded=false 時刻意省掉守門，用來證明這組測試真的踩得到 bug。
 */
function reverseDuringFadeOut(opts: {
  guarded: boolean;
  reverseAtMs: number;
  out: 'before' | 'after';
}) {
  return new Promise<{ reverseAtMs: number; visible: boolean; mediaActive: boolean }>((resolve) => {
    const el = { autoAlpha: 1, y: 0 };
    let mediaState: StageBlockState = opts.out;
    let mediaActive = true;

    // 換態成 before/after → mediaFade.hide(..., () => mediaActive = false)
    gsap.to(el, {
      autoAlpha: 0,
      y: opts.out === 'after' ? -120 : 200,
      duration: FADE,
      ease: 'power2.in',
      overwrite: 'auto',
      onComplete: () => {
        if (opts.guarded && !deferredStopStillApplies(mediaState)) return;
        mediaActive = false;
      },
    });

    setTimeout(() => {
      // 回捲換態回 shown → mediaActive 打開、mediaFade.show() 接手
      mediaState = 'shown';
      mediaActive = true;
      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: FADE,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // 等舊淡出原本該播完的時間再多留幾格 frame，看 onComplete 有沒有偷偷關掉
      const wait = Math.max(0, FADE * 1000 - opts.reverseAtMs) + 150;
      setTimeout(() => resolve({ reverseAtMs: opts.reverseAtMs, visible: el.autoAlpha > 0.5, mediaActive }), wait);
    }, opts.reverseAtMs);
  });
}

const sweep = (guarded: boolean) =>
  Promise.all(
    REVERSE_SWEEP.flatMap((reverseAtMs) =>
      (['before', 'after'] as const).map((out) =>
        reverseDuringFadeOut({ guarded, reverseAtMs, out }).then((r) => ({ ...r, out })),
      ),
    ),
  );

describe('淡出中回捲：看得到就一定要還在演（真的 gsap）', () => {
  // 掃描同時跑很多 tween，別讓 gsap 的 lag smoothing 介入改寫時間
  beforeAll(() => {
    gsap.ticker.lagSmoothing(0);
  });

  it('有守門：整段回捲時機都不會出現「看得到卻不輪播」', async () => {
    const results = await sweep(true);
    const bad = results.filter((r) => r.visible && !r.mediaActive);
    expect(
      bad.map((b) => `${b.reverseAtMs}ms/${b.out}`),
      '這些回捲時機下媒體看得到卻停住了',
    ).toEqual([]);
    // 確認掃描本身有效：show 一定把畫面拉回可見
    expect(results.every((r) => r.visible)).toBe(true);
  }, 20_000);

  it('拿掉守門就會壞在淡出尾端 —— 證明上面那條測試有 teeth', async () => {
    const results = await sweep(false);
    const bad = results.filter((r) => r.visible && !r.mediaActive);
    expect(bad.length, '沒踩到 bug，掃描範圍或 frame 邊界需要重新校準').toBeGreaterThan(0);
  }, 20_000);
});
