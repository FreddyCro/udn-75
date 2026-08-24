// 內容高度一變就重算 ScrollTrigger（全站，只掛一次）。
//
// 為什麼是 plugin 而不是掛在某一頁：ScrollTrigger 的 start／end 是**量完就固定的
// 絕對捲動座標**，量測之後版面再長高不會讓它自己更新 —— 而這件事跟哪一頁無關。
// 首頁（Hero／Forum／Blessing／FormulaBlocks）、七個獨立子頁（AwardTimeline／
// PhotoPanels）、連續閱讀頁，全都有同樣結構的 pin。
//
// 只是**症狀的刺眼程度**差很多：連續閱讀頁六篇串在同一份文件裡，上游長高多少，
// 下面每一篇 pin 的起點就早了多少，而舞台是透明的（白底只在 .subpage__content）——
// 提早 pin ＝ 下一篇的 hero 以 position: fixed 疊在上一篇的內文上，兩篇的字疊成一團。
// 其他頁沒有「下一篇」可以疊，錯位就只是靜默地偏一點。
//
// ⚠️ 與既有那幾支點狀補刀的關係：
//    ・refresh-scroll-triggers.client.ts —— 換頁轉場結束後補一刀
//    ・refreshOnFontsReady() —— 字體 swap 後補一刀
//    ・viewport-height.client.ts —— --vh 重算後補一刀
//    它們守的是**已知的成因**，這支守的是**結果**（高度真的變了）。兩者不重複：
//    點狀那幾支比較早、比較準（知道自己在等什麼），這支負責它們列不完的其餘來源。
//
// ⚠️ 這**不是**「圖片沒保留版位」的藉口。重算再快也是事後補救，補救的那一刻使用者
//    已經看到位移。源頭那一半守在 test/subpage-image-space-reservation.spec.ts。
//
// 節流、回授迴圈的防呆與實測數字都在 utils/scroll-trigger 的 refreshOnContentResize。
import { refreshOnContentResize } from '~/utils/scroll-trigger';

export default defineNuxtPlugin(() => {
  refreshOnContentResize();
});
