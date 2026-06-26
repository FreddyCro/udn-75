---
name: four-animation-issues
description: 2026-06-10 確認的四個動態需求，issue 寫於 temp/issue-01~04
metadata:
  type: project
---

2026-06-10 與 Freddy 逐一確認四個動態需求，issue 文件在 `temp/issue-01-orange-core.md` ~ `temp/issue-04-glitch-image.md`（temp/ 可能不入版控，留意保存）：

1. **orange-core**：SVG 橘色方塊群，fixed + ScrollTrigger scrub，三階段變形（九宮格馬賽克隨機顯示 → 收斂到「5 位置」= 九宮格中心格單一方塊 → 放大成全螢幕背景），於內容間穿梭。前提：網站將改版為多 section 滾動長頁。已實作於 `app/components/OrangeCore.vue`（2026-06-10）。
2. **符號粒子人像**：人像圖片亮度採樣，符號字元（字元集待定）取代圓點，深淺用「密度 + 大小」表現；進場 reveal、呼吸閃爍、滑鼠斥力、按鈕觸發散場漂浮背景。已實作於 `app/components/SymbolFace.vue`（原名 SymbolPortraitScene，2026-06-26 更名），素材 `app/assets/img/einstein.png`（2026-06-10）；字元集/顏色等皆為 props，字元集仍待設計定案。
3. **Metaballs 揭露**：背景圖 + 純色遮罩，cursor 拖尾多球融合揭露底圖，WebGL shader 實作；特定 section，行動裝置改自動漫遊。已實作於 `app/components/HeartMetaball.vue`（原名 MetaballsReveal，2026-06-26 更名）。
4. **GlitchImage**：通用圖片元件，進場 reveal 一次性 glitch（色塊 + 切塊錯位 + 色偏 + 多圖交替），DOM/CSS + GSAP timeline 實作。
