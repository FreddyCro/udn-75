/**
 * hero-assets — 產生 hero 影片的 poster 首幀，並把 face.png 換成降尺寸 WebP。
 *
 * 兩件事都只需要 ffmpeg（它也能編 WebP），所以合成一支腳本、不多裝工具。
 *
 * ## 用法
 *
 *   node scripts/hero-assets.mjs --poster    # 只做 poster
 *   node scripts/hero-assets.mjs --face      # 只做 face
 *   node scripts/hero-assets.mjs             # 兩者都做
 *
 * ⚠️ 需要 PATH 上有 `ffmpeg`（winget install Gyan.FFmpeg，裝完開新 shell）。
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ## poster
 *
 * `HERO_VIDEO_POSTER` 目前三個裝置都是空字串（app/utils/hero-video-config.ts），
 * 也就是 `canplay` 之前 `<video>` **什麼都不畫**。搭配 40 支非 faststart 的 mp4
 * （見 scripts/mp4-faststart.mjs），慢速手機上那段等待期間畫面是全白的。
 * 抽第一幀當 poster ⇒ 等待期間有畫面，而且影片真的失敗時也是優雅降級。
 *
 * 產出後要手動把路徑填回 hero-video-config.ts —— 腳本會印出要貼的那一段。
 * 刻意不自動改原始碼：那份設定檔的註解密度很高，機器改寫容易破壞上下文。
 *
 * ## face
 *
 * `app/assets/img/face.png` 是 1013×1478 RGBA、1.62 MB，而它**只被拿去取樣粒子位置**
 * （SymbolFace.vue:5 唯一使用者）。取樣前程式自己會先把圖縮到「每格約
 * SAMPLE_PX_PER_CELL(4) 像素」＝ cols(89) × 4 = 356 px 寬，所以 1013 px 的原圖有
 * 2.8 倍是白付的頻寬 —— 而且它跟 9.8 MB 的 hero mp4 搶同一段。
 * SymbolFace.vue:839 的註解自己就記著這筆帳：「省的是 CPU 與記憶體，**不是頻寬**」。
 *
 * 目標寬度取 512（356 的 1.44 倍安全邊際）。
 *
 * ⚠️ 網格幾何只看**長寬比**（見 computeGrid：imgW 會消掉），所以降尺寸不會動到任何
 *    粒子的 world 座標。但 **alpha 會**：sampler 用 alpha 門檻判斷空白格，
 *    所以這裡用 `-lossless 1` 保住 alpha 精度，不用有損 WebP。
 *    換完務必和舊版對照一次人臉顆粒密度。
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const only = args.filter((a) => a.startsWith('--')).map((a) => a.slice(2));
const doPoster = only.length === 0 || only.includes('poster');
const doFace = only.length === 0 || only.includes('face');

if (spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status !== 0) {
  console.error(
    'PATH 上找不到 ffmpeg。\n  winget install Gyan.FFmpeg   （裝完要開新的 shell 讓 PATH 生效）',
  );
  process.exit(1);
}

const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`;
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

// ── poster ────────────────────────────────────────────────────────────────
if (doPoster) {
  // 與 HERO_VIDEO_SRC 一致（app/utils/hero-video-config.ts）
  const CLIPS = {
    pc: 'public/img/udn75_bg_video_opening_pc.mp4',
    pad: 'public/img/udn75_bg_video_opening_pad.mp4',
    mob: 'public/img/udn75_bg_video_opening_mob.mp4',
  };
  const out = {};
  for (const [device, src] of Object.entries(CLIPS)) {
    if (!fs.existsSync(src)) {
      console.error(`✗ 找不到 ${src}，跳過 ${device}`);
      continue;
    }
    const dest = `public/img/udn75_bg_video_opening_${device}_poster.webp`;
    const r = spawnSync(
      'ffmpeg',
      [
        '-v', 'error', '-y',
        '-i', src,
        '-frames:v', '1',
        // -q:v 80 ＝ 有損 WebP。poster 只是給眼睛看的過場畫面，不參與任何取樣運算。
        '-c:v', 'libwebp', '-q:v', '80',
        dest,
      ],
      { stdio: 'inherit' },
    );
    if (r.status !== 0) {
      console.error(`✗ ${device} poster 產生失敗`);
      continue;
    }
    out[device] = `/${dest.replace(/^public\//, '')}`;
    console.log(`✓ ${dest}  ${kb(fs.statSync(dest).size)}`);
  }

  if (Object.keys(out).length) {
    console.log(
      '\n把 app/utils/hero-video-config.ts 的 HERO_VIDEO_POSTER 改成：\n\n' +
        'export const HERO_VIDEO_POSTER: Record<HeroVideoDevice, string> = {\n' +
        Object.entries(out)
          .map(([d, p]) => `  ${d}: '${p}',`)
          .join('\n') +
        '\n};\n',
    );
  }
}

// ── face ──────────────────────────────────────────────────────────────────
if (doFace) {
  const src = 'app/assets/img/face.png';
  const dest = 'app/assets/img/face.webp';
  const TARGET_W = 512; // 取樣只需 cols(89) × 4 = 356 px；留 1.44 倍安全邊際

  if (!fs.existsSync(src)) {
    console.error(`✗ 找不到 ${src}`);
  } else {
    const before = fs.statSync(src).size;
    const r = spawnSync(
      'ffmpeg',
      [
        '-v', 'error', '-y',
        '-i', src,
        // -1 讓高度按原長寬比自動算（保證 computeGrid 得到同一個網格）
        '-vf', `scale=${TARGET_W}:-1:flags=lanczos`,
        // lossless：sampler 用 alpha 門檻判空白格，有損 alpha 會動到粒子數
        '-c:v', 'libwebp', '-lossless', '1',
        dest,
      ],
      { stdio: 'inherit' },
    );
    if (r.status !== 0) {
      console.error('✗ face.webp 產生失敗');
    } else {
      const after = fs.statSync(dest).size;
      console.log(
        `✓ ${dest}  ${mb(before)} → ${kb(after)}  （省 ${mb(before - after)}）`,
      );
      console.log(
        '\n接著改 app/components/01a.symbol/SymbolFace.vue:5：\n' +
          "  - import portraitUrl from '~/assets/img/face.png';\n" +
          "  + import portraitUrl from '~/assets/img/face.webp';\n" +
          '\n⚠️ 換完務必目視對照人臉顆粒密度（alpha 門檻決定空白格），確認無誤再刪掉 face.png。',
      );
      if (after > before * 0.5) {
        console.warn(
          `\n⚠️ lossless WebP 只省到 ${(100 - (after / before) * 100).toFixed(0)}%。` +
            '\n   若想更小可改有損（-q:v 90 取代 -lossless 1），但務必先確認粒子密度沒變。',
        );
      }
    }
  }
}
