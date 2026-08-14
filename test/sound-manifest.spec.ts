import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  SOUND_DIR,
  SOUND_KEYS,
  SOUND_MANIFEST,
  isSoundKey,
  soundPath,
} from '../app/utils/sound-manifest';

// 音效清單（app/utils/sound-manifest.ts）與實際檔案（public/sounds/）的雙向對照。
//
// 為什麼要雙向：設計師會陸續補音效檔進來，兩個方向都會出錯 ——
//   ・登記了但檔案不在 → 上線後靜默無聲（play() 只是 404，不會有任何錯誤畫面）。
//   ・檔案丟進來但沒登記 → 呼叫端根本叫不到，會誤以為是播放邏輯壞了。
// 兩種都很難從瀏覽器看出原因，所以擋在測試。

const PUBLIC_SOUNDS = join('public', SOUND_DIR.replace(/^\//, ''));

const filesOnDisk = () =>
  readdirSync(PUBLIC_SOUNDS).filter((name) =>
    statSync(join(PUBLIC_SOUNDS, name)).isFile(),
  );

describe('音效清單與 public/sounds/ 一致', () => {
  it('清單裡的每支音效都有對應檔案', () => {
    const missing = SOUND_KEYS.filter(
      (key) => !filesOnDisk().includes(SOUND_MANIFEST[key]),
    ).map((key) => `${key} → ${SOUND_MANIFEST[key]}`);

    expect(missing).toEqual([]);
  });

  it('public/sounds/ 裡的每個檔案都有登記', () => {
    const registered = new Set<string>(Object.values(SOUND_MANIFEST));
    const orphans = filesOnDisk().filter((name) => !registered.has(name));

    expect(orphans).toEqual([]);
  });

  // 同一支檔案掛兩個 key，呼叫端會以為是兩種音效，改其中一支時另一支跟著變。
  it('沒有兩個 key 指到同一支檔案', () => {
    const files = Object.values(SOUND_MANIFEST);

    expect(files.length).toBe(new Set(files).size);
  });
});

describe('soundPath', () => {
  // 路徑必須是「站台根目錄寫法」，部署前綴在 runtime 由 useAssetUrl() 補。
  // 這裡若自己帶了 http(s):// 或相對路徑，useAssetUrl 的前綴就會失效或疊錯。
  it('組出站台根目錄寫法的路徑', () => {
    expect(soundPath('sfx01')).toBe('/sounds/udn75_sfx01_01.mp3');
  });

  it('每個 key 都以 SOUND_DIR 開頭', () => {
    const bad = SOUND_KEYS.filter((key) => !soundPath(key).startsWith(`${SOUND_DIR}/`));

    expect(bad).toEqual([]);
  });
});

describe('isSoundKey', () => {
  it('認得清單內的 key', () => {
    expect(isSoundKey('sfx01')).toBe(true);
  });

  it('擋掉清單外的字串', () => {
    expect(isSoundKey('nope')).toBe(false);
  });

  // key 用 `in` 檢查，Object.prototype 上的成員會誤判成合法 key。
  it('擋掉繼承自 Object.prototype 的名字', () => {
    expect(isSoundKey('toString')).toBe(false);
    expect(isSoundKey('constructor')).toBe(false);
  });
});
