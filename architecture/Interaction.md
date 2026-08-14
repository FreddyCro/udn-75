# 互動需求筆記（設計端原稿）

> **維護註記（2026-08-12 更新）**
>
> 以下是設計端交來的原始 motion 需求，**逐字保留、不改寫**。
> 保留本檔的唯一理由是那些**參考網站**（外部靈感來源，程式碼裡不會有）。
>
> **條目已全數實作**，含最後一項「前往下一篇」的呼吸縮放（`SubpageNav.vue` 的
> `subpage-nav-breathe`：盒維持 84×84、以 scale 在 68↔84px 起伏）。
> 當時記下的矛盾（本文寫 hover 停在「Default(圓形放大)」、Figma 註解寫「small(圓形縮小)」）
> **已依本文實作為放大態**。

- 智慧心媒體motion
    1. 80vw 色塊左右縮小縮成長條
    2. 直條上下縮小成中心點
    3. 文字跟兩側的bar從中心點兩側出現
    4. 兩側bar在文字出現後消失
    5. 中心點變成跟文字同高的直線
    6. 展開後變成上下引號
    7. 出現中心字”心”
- 智慧心媒體 section
    
    component HeartMetaball - #智慧心媒體｜互動底紋
    
    在整個section底下hover會出現底紋
    
    list hover文字會放大
    
- 4 subpage common
    - 前往下一篇
        
        #大小循環呼吸縮放動態
        
        #預設就是橘色
        
        hover時停在Default(圓形放大)狀態
        
    - #側欄錨點｜圖表(ENG)
        
        遇到滿版的區塊就顯示在底層
        
        translate 0.2s
        
- 新聞部x數據發展部 數位革命 news.vue
    - publish X 議題智囊包
        
        Studio de Création Graphique - Junto CreativeFormula_Container__lALJb
        
        綁滾動，4 block 從中間 block 展開
        
        到四個角落後 svg 格子竹格從中間block延伸到四角的block
        
    - 數張照片綁滾動(ENG)
        
        doodle 赤ちゃんと通える産後骨盤矯正・ダイエット専門院 p-top-about__panels-wrap
        
    - 綁滾動｜時間軸圖表(ENG)
        
        獲獎歷程
        
        Studio de Création Graphique - Junto WorkSteps_Container__GXmCv theme-blue
        
- 視覺設計中心 視覺敘事 visual.vue
    - #選擇圖片(ENG) 哪一張是AI生成圖?
        
        #選擇按鈕後解釋向下展開
        #左側錯誤照片會有遮罩，透明度: rgba(0, 0, 0, 0.45);
        
        画像生成AI 見分けられる？ クイズ&ビジュアル解説：日本経済新聞 question-part
        
    - #懸浮縮圖(ENG)
        
        GlitchImage - hover 觸發顯示圖片切割 #懸浮縮圖
        
        Robert Borghesi — Creative Dev
        
- 新聞營運中心 永續影響 service.vue
    - 共用 #懸浮縮圖(ENG)motion
- 數據中心 智慧新聞 data.vue
    - AI搜尋 #AI搜尋功能(ENG)
        
        #輪播顯示組熱門關鍵字，約2s轉換
        
        #展開說明文字，逐字依序出現
        
        #6組文字輪轉替換:人工智慧、台積電、校園濫訴、黃仁勳、兩蔣日記、國中會考
        
    - #綁滾動｜多張圖呈現(ENG)
        
        component ShowcaseGallery - data center #綁滾動｜多張圖呈現
        
        Made With Gsap