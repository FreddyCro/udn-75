/**
 * 站上會出現的字元集合。來源：app/ 下所有 .vue / .ts / .json（文案在 locales JSON，
 * 元件 template 也有少量字面文字），加上 common-components 的 dist（footer 元件內的字）。
 *
 * 不做「只收 CJK」：全形標點（U+3000–303F、U+FF00–FFEF）、破折號、引號等都要在字型裡，
 * 否則會掉到系統字型、粗細與字寬跟正文對不上。ASCII 可列印字元一律補進去（英數與西文標點
 * 由 Noto Sans 出，但 Noto Sans TC 也要有，才不會在西文字型缺字時跳到系統字）。
 */
import fs from 'node:fs';
import path from 'node:path';

const ASCII = Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCharCode(0x20 + i)).join('');

export function collectText(sources) {
  const set = new Set(ASCII);
  for (const src of sources) {
    for (const ch of src) {
      const cp = ch.codePointAt(0);
      if (cp < 0x20 || cp === 0x7f) continue; // 控制字元
      if (cp >= 0x200b && cp <= 0x200f) continue; // 零寬
      if (cp === 0xfeff) continue; // BOM
      set.add(ch);
    }
  }
  return [...set].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join('');
}

const walk = (dir, exts, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, exts, out);
    else if (exts.some((e) => name.endsWith(e))) out.push(full);
  }
  return out;
};

/** 讀取專案內所有字元來源檔的內容 */
export function readGlyphSources(root = process.cwd()) {
  const files = [
    ...walk(path.join(root, 'app'), ['.vue', '.ts', '.json']),
    ...walk(path.join(root, 'node_modules/@udn-digital-center/common-components/dist'), ['.js', '.mjs', '.cjs']),
  ];
  return files.map((f) => fs.readFileSync(f, 'utf8'));
}
