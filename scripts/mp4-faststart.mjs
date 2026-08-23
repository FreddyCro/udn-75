/**
 * mp4-faststart — 把 public/ 底下所有 mp4 的 `moov` box 搬到 `mdat` 之前（無損）。
 *
 * ## 為什麼要做
 *
 * 實測本專案 40 支 mp4 的 box 順序**全部**是 `ftyp → free → mdat → moov`，也就是
 * metadata 在檔尾：
 *
 *   udn75_bg_video_opening_mob.mp4  4.14 MB  moov @ 4,292,232
 *   udn75_bg_video_opening_pad.mp4  6.64 MB  moov @ 6,916,096
 *   udn75_bg_video_opening_pc.mp4   9.37 MB  moov @ 9,784,726
 *
 * 瀏覽器沒有 `moov` 就無法解碼、無法 `canplay`，只能多花 range request 往檔尾繞，
 * 最差要把整支拉完。於是在效能／網路差的手機上會連鎖成：
 *
 *   HERO_VIDEO_READY_TIMEOUT（8s）燒斷  → 載入層不等了、直接跑到 100%
 *   HERO_MAIN_STALL_FUSE_MS（15s）燒斷  → armStallFuse 呼叫 skipOpening() → gone
 *   ⇒ 「跑完 loading，影片出不來」（architecture/LIU_FEEDBACK_5.md:10）
 *
 * 保險絲的邏輯是對的，它只是在誠實反映素材沒優化。
 *
 * ## 用法
 *
 *   node scripts/mp4-faststart.mjs --check      # 只列出哪些檔案需要處理，不改東西
 *   node scripts/mp4-faststart.mjs              # 實際處理（原地覆寫，先寫 .tmp 再 rename）
 *   node scripts/mp4-faststart.mjs --dir public/img/visual
 *
 * ⚠️ 需要 PATH 上有 `ffmpeg`。用 `-c copy` ⇒ **不重新編碼**，畫質與位元流完全相同，
 *    只有 box 順序改變（外加 stco/co64 位移重算，由 ffmpeg 負責）。
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const CHECK_ONLY = args.includes('--check');
const dirArg = args.indexOf('--dir');
const ROOT = dirArg === -1 ? 'public' : args[dirArg + 1];

/** 讀 box 順序，判斷 moov 是否已經在 mdat 之前。 */
function inspect(file) {
  const fd = fs.openSync(file, 'r');
  const size = fs.statSync(file).size;
  const head = Buffer.alloc(16);
  const boxes = [];
  let pos = 0;
  try {
    while (pos + 8 <= size) {
      const read = fs.readSync(fd, head, 0, 16, pos);
      if (read < 8) break;
      let boxSize = head.readUInt32BE(0);
      const type = head.toString('latin1', 4, 8);
      let headerLen = 8;
      if (boxSize === 1) {
        // 64-bit largesize
        const hi = head.readUInt32BE(8);
        const lo = head.readUInt32BE(12);
        boxSize = hi * 2 ** 32 + lo;
        headerLen = 16;
      } else if (boxSize === 0) {
        boxSize = size - pos; // 延伸到檔尾
      }
      if (boxSize < headerLen) break;
      boxes.push({ type, offset: pos, size: boxSize });
      pos += boxSize;
    }
  } finally {
    fs.closeSync(fd);
  }
  const moov = boxes.findIndex((b) => b.type === 'moov');
  const mdat = boxes.findIndex((b) => b.type === 'mdat');
  return {
    boxes,
    faststart: moov !== -1 && (mdat === -1 || moov < mdat),
    moovOffset: moov === -1 ? null : boxes[moov].offset,
  };
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && p.toLowerCase().endsWith('.mp4')) out.push(p);
  }
  return out;
}

const hasFfmpeg =
  spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0;
if (!CHECK_ONLY && !hasFfmpeg) {
  console.error(
    'PATH 上找不到 ffmpeg。裝好再跑，或先用 --check 看清單。\n' +
      '  winget install Gyan.FFmpeg    （裝完要開新的 shell 讓 PATH 生效）',
  );
  process.exit(1);
}

const files = walk(ROOT).sort();
let need = 0;
let done = 0;
let savedNothing = 0;

for (const f of files) {
  const info = inspect(f);
  const size = fs.statSync(f).size;
  if (info.faststart) {
    savedNothing += 1;
    continue;
  }
  need += 1;
  console.log(
    `需處理  ${f}  ${(size / 1024 / 1024).toFixed(2)} MB  moov @ ${info.moovOffset}` +
      `  [${info.boxes.map((b) => b.type).join(' ')}]`,
  );
  if (CHECK_ONLY) continue;

  const tmp = `${f}.faststart.tmp.mp4`;
  const r = spawnSync(
    'ffmpeg',
    ['-v', 'error', '-y', '-i', f, '-c', 'copy', '-movflags', '+faststart', tmp],
    { stdio: 'inherit' },
  );
  if (r.status !== 0) {
    console.error(`  ✗ ffmpeg 失敗，跳過並保留原檔：${f}`);
    fs.rmSync(tmp, { force: true });
    continue;
  }
  const after = inspect(tmp);
  if (!after.faststart) {
    console.error(`  ✗ 產出仍非 faststart，保留原檔：${f}`);
    fs.rmSync(tmp, { force: true });
    continue;
  }
  fs.renameSync(tmp, f);
  done += 1;
  console.log(
    `  ✓ moov 移到 @ ${after.moovOffset}，${(fs.statSync(f).size / 1024 / 1024).toFixed(2)} MB`,
  );
}

console.log(
  `\n${files.length} 支 mp4：已是 faststart ${savedNothing}、需處理 ${need}` +
    (CHECK_ONLY ? '（--check 模式，未改動任何檔案）' : `、已處理 ${done}`),
);
