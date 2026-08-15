/**
 * 取樣結果快取（LRU，模組層存活）。
 *
 * 為什麼需要（2026-08-15 實測，見 temp/2026-08-15-return-to-index-perf-measurement.md）：
 * ForumCorePath 的 build() 掛在 ScrollTrigger 的 refreshInit 上，每個 refresh 週期就把
 * 整條驅動線重新取樣一輪（約 2340 次 getPointAtLength）。子頁導航回首頁會跑 2 輪、
 * 合計 4683 次 / 1.3–1.8 秒，是返回時主執行緒被卡住的 88%。
 *
 * 但那些取樣全是**同一條 d 的純函式** —— 版面沒變時，兩輪算出來的東西一模一樣。
 * 所以這裡快取的是「同樣的輸入 → 同樣的輸出」，不是猜測，鍵由呼叫端用實際輸入組出來。
 *
 * ⚠ 必須放在**模組層**（而非元件實例內）才吃得到返回首頁的效益：元件會隨換頁 unmount，
 *   實例層的快取跟著沒了，返回時第一輪照樣要重算。模組在 SPA 生命週期內存活，
 *   於是「上次離開首頁前算過的那條線」在返回時仍然命中。
 *
 * ⚠ 用 LRU 而非無上限 Map：拖拉視窗會產生大量互異的 d，無上限會一路長。
 *
 * 容量預設 8。原本抓 4（三個斷點 ＋ 餘裕），實測發現**同一個斷點也會有多條 d** ——
 * 返回首頁的落點不同（#media / #forum / #blessing / #loop），論壇段的圖片載入狀態
 * 就不同，量到的錨點位置有次像素差異，於是每個落點各自是一條 d。四個落點 ＋ 三個斷點
 * 已經逼近 4，故放寬到 8 留緩衝；每筆只是一組數字，記憶體代價可忽略。
 */
export interface SampleCache<T> {
  /** 命中就回快取值，否則跑 compute() 並存起來。 */
  get(key: string, compute: () => T): T;
  /** 目前存了幾筆（測試與除錯用）。 */
  size(): number;
  clear(): void;
  /** 命中／未命中次數（測試與除錯用）。 */
  stats(): { hits: number; misses: number };
}

export function createSampleCache<T>(capacity = 8): SampleCache<T> {
  // Map 的迭代順序＝插入順序 → 最舊的就是第一個 key，命中時 delete + set 把它移到最後。
  const map = new Map<string, T>();
  let hits = 0;
  let misses = 0;

  return {
    get(key, compute) {
      if (map.has(key)) {
        hits++;
        const cached = map.get(key) as T;
        map.delete(key);
        map.set(key, cached); // LRU：碰過就移到最新
        return cached;
      }
      misses++;
      const value = compute();
      map.set(key, value);
      if (map.size > capacity) {
        const oldest = map.keys().next().value;
        if (oldest !== undefined) map.delete(oldest);
      }
      return value;
    },
    size: () => map.size,
    clear: () => {
      map.clear();
      hits = 0;
      misses = 0;
    },
    stats: () => ({ hits, misses }),
  };
}

/**
 * 把量出來的座標量化後寫進快取鍵。
 *
 * getBoundingClientRect 在版面沒變時是決定性的，理論上不必量化；這是保險
 * —— 浮點尾數的極小差異不該讓整輪取樣重跑。
 *
 * 0.1px 的粒度**遠細於取樣法自身的解析度**：nearestArcLength 粗掃 512 點、細掃 64 點，
 * 誤差是 (totalLen / 512) / 32；pc 的 pathLen 約 13000 → 約 0.8px。也就是說量化引入的
 * 誤差上限比方法本身的誤差小一個數量級，不會讓結果變差。
 * 若 rect 真的差超過 0.1px，那是版面真的變了 —— 此時**應該**重算，快取也確實會 miss。
 */
export function quantize(v: number, step = 0.1): number {
  return Math.round(v / step) * step;
}

/** 座標對的快取鍵片段（見 quantize 的精度說明）。 */
export function pointKey(x: number, y: number, step = 0.1): string {
  return `${quantize(x, step)},${quantize(y, step)}`;
}
