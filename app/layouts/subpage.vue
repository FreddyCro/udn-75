<script lang="ts" setup>
// 錨點導覽在**這一層**渲染，一份。
//
// 原本住在 Subpage.vue 內，但手機版的連續閱讀頁（pages/subpage.vue）把六篇串成同一份
// 文件 —— 留在 Subpage 裡就會疊出六份底部錨點列。提到 layout 之後獨立子頁與連續閱讀頁
// 共用同一份，顯隱與模式走 useSubpageAnchor（由各篇的舞台進度線寫入）。
//
// 放 layout root 底下是安全的：AppHeader 也是同一層的 position: fixed 子節點，
// nuxt.config 的 layoutTransition 已經為此限定成純 opacity 的 page-fade（帶 transform
// 會讓 fixed 改以變形層為定位基準而跳位）。
const { visible, resetSubpageAnchor } = useSubpageAnchor();

// useState 跨 client-side 導航存活（見 useSubpageAnchor 檔頭）→ 離開子頁時清回初值，
// 否則回首頁再進另一篇，錨點列會在 hero 那一屏就已經掛在畫面上。
onBeforeUnmount(resetSubpageAnchor);
</script>

<template>
  <div class="subpage-layout">
    <!-- 子頁無 hero：關閉自動隱藏，header（含進度條）常駐顯示 -->
    <AppHeader :auto-hide="false" />
    <main class="main-content">
      <slot />
    </main>
    <!-- pc 右側 rail：**全程顯示**，不跟著舞台藏起來。hero／引言兩拍都是透明層，擋不到它；
         真正會蓋住它的只有滿屏引言媒體那一拍，那靠疊層做掉（舞台 --media 1100 ＞ rail 900）。
         唯一例外：頁尾收尾區（得獎作品清單／返回導覽）捲上來時 rail 自行淡出，
         判定在 SubpageAnchor 內部（covered），不走這面 visible 旗子。
         <1280 的底部錨點列維持「舞台演完才滑入」：它橫在視窗下緣、是實心底，
         在 hero 那一屏滑進來會壓到設計稿的首屏構圖，與 rail 不是同一回事。 -->
    <SubpageAnchor visible />
    <SubpageAnchorBar :visible="visible" />
    <AppFooter />
  </div>
</template>
