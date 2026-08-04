// 全站音效開關（單一來源，useState → SSR 安全、跨元件共享）。
//
// 由 hero 的 start 閘門（01.hero/HeroStart.vue）上的音效按鈕切換；
// 開啟後「後續所有影片都不 muted」：
//   - HeroVideo：watch soundOn 直接改 <video>.muted。
//   - UVid：muted prop 未指定時預設跟隨本狀態（明確傳 :muted 的呼叫端仍然優先）。
//
// ⚠️ 瀏覽器政策：未經使用者手勢的「非靜音」自動播放會被封鎖。本專案的開關綁在
//    start 按鈕那一次點擊上（＝有手勢），故 hero 影片可直接以有聲播放。
export function useAppSound() {
  const soundOn = useState<boolean>('app-sound-on', () => false);
  const toggleSound = () => (soundOn.value = !soundOn.value);
  return { soundOn, toggleSound };
}
