// 量測瀏覽器的垂直捲軸寬度，寫進 :root 的 --scrollbar-width（預設值見 assets/styles/base.scss）。
//
// 為什麼需要：頁面在某些狀態下沒有垂直捲軸（如 hero 影片期間 body 上鎖 overflow:hidden），
// 可用寬會比有捲軸時多一個捲軸寬。此時量到的寬度（GSAP pin-spacer、100% 寬元素）
// 在捲軸回來後就會多出那段 → 撐出「水平捲軸」＋版面橫向抖動。
// 把捲軸寬存成 CSS 變數，需要的地方一律扣掉（padding-right 補償 / calc(100vw - var(...))）。
//
// 量測用離屏探測元素（不依賴當下畫面是否真的有捲軸，上鎖期間也量得到）；
// overlay 捲軸環境（macOS 預設 / 行動裝置）會量到 0 → 各處 calc 自然不作用。
export default defineNuxtPlugin(() => {
  const measure = () => {
    const probe = document.createElement('div');
    probe.style.cssText =
      'position:absolute;top:-9999px;left:-9999px;width:100px;height:100px;overflow-y:scroll;';
    // 內層 100% 寬 → 量它的 getBoundingClientRect（浮點）才能拿到「小數」捲軸寬：
    // offsetWidth / clientWidth 都是整數，DPR 非整數時（如 1.5）捲軸實寬會是 15.333px，
    // 用整數量測會少算 0.33px，扣不乾淨就留下次像素溢出。
    const inner = document.createElement('div');
    inner.style.cssText = 'width:100%;height:200px;';
    probe.appendChild(inner);
    document.body.appendChild(probe);
    const width = 100 - inner.getBoundingClientRect().width;
    probe.remove();
    document.documentElement.style.setProperty(
      '--scrollbar-width',
      `${width}px`,
    );
  };

  measure();
  // 瀏覽器縮放會改變捲軸的 CSS px 寬度（外接螢幕 DPR 變動亦同）→ resize 時重量。
  window.addEventListener('resize', measure);
});
