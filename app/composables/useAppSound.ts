// 全站音效開關（單一來源，useState → SSR 安全、跨元件共享）。
//
// 由 hero 的 start 閘門（01.hero/HeroStart.vue）上的音效按鈕切換；
// 影響範圍**只有 hero 影片與音效（sfx）**：
//   - HeroVideo：watch soundOn 直接改 <video>.muted。
//   - AppSfx / useSfx：音效解鎖與停止。
//
// ⚠️ 瀏覽器政策：未經使用者手勢的「非靜音」自動播放會被封鎖。本專案的開關綁在
//    start 按鈕那一次點擊上（＝有手勢），故 hero 影片可直接以有聲播放。
//
// ⚠️ **其他影片（UVid）一律靜音，不吃這個開關**。它們的播放由捲動／可見性驅動，
//    離那一次點擊已經隔了換頁與大量捲動，不在同一個手勢裡 —— 曾經讓 UVid 的 muted
//    跟隨本狀態，結果是使用者開過音效之後，子頁的滿屏影片在手機上永遠不播（靜默失敗）。
//    完整脈絡見 components/UVid.vue 的檔頭與 test/video-muted.spec.ts。
export function useAppSound() {
  const soundOn = useState<boolean>('app-sound-on', () => false);
  const toggleSound = () => (soundOn.value = !soundOn.value);
  return { soundOn, toggleSound };
}
