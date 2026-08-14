# Liu 反饋整理

> 來源：設計端（Liu）對 0.3.0 版本各互動元件的反饋。
> 本文件將反饋歸納為「元件 ↔ 內容」對照表，方便逐項追蹤調整。
> 「CLAUDE 說明」欄為對照目前程式碼後判斷的可行性與建議做法（🟢 容易／🟡 中等／🔴 需較大改動或研究）。

## 元件總覽

| 反饋區塊 | 對應元件 | 整體評價 |
| --- | --- | --- |
| 一、Loading | [`LoadingHero.vue`](../app/components/LoadingHero.vue)、[`OrangeCore.vue`](../app/components/OrangeCore.vue)（轉場銜接） | 大致沒問題，效果很棒 |
| 二、符號人臉互動 | [`SymbolFace.vue`](../app/components/SymbolFace.vue) | 文字彩蛋觸發 OK，互動手感與排列需調整 |
| 三、圖片 Gallery | [`ShowcaseGallery.vue`](../app/components/ShowcaseGallery.vue) | 效果沒問題，僅滑動方向需修正 |
| 四、智慧心媒體 | [`HeartMetaball.vue`](../app/components/HeartMetaball.vue) | 待測試多底紋切換可行性 |

> 註：[`mosaicTexture.ts`](../app/utils/mosaicTexture.ts) 僅被 `legacy/MetaballsReveal.vue` 使用；現役 `HeartMetaball.vue` 是直接在 Canvas 2D 繪製圖案，**未**用到它。故第四區的調整都在 `HeartMetaball.vue` 內。

---

## 一、Loading

對應元件：[`LoadingHero.vue`](../app/components/LoadingHero.vue)、[`OrangeCore.vue`](../app/components/OrangeCore.vue)

| # | 反饋內容 | 對應元件 | 類型 | 狀態 | CLAUDE 說明（可行性／方法） |
| --- | --- | --- | --- | --- | --- |
| 1-1 | 之後針對方塊尺寸、橘色佔比、數字大小微調 | `LoadingHero.vue` | 微調 | ✅ 已調整（2026-06-26） | 🟢 三者都已參數化：方塊尺寸＝`tileSize` prop、橘色佔比＝`orangeTiles` prop（2026-08-04 對稿時由 `orangeRatio` 比例改為「前緣幾顆橘」的絕對顆數）、數字大小＝`counterFontSize` prop。純調參，不動邏輯。 |
| 1-2 | 最後 100% 時，定位的橘色方塊應「直接出現在中央」，不要畫面全白後才又出現橘色（目前 100% 數字會被橘色方塊遮蓋）。**追加：中央橘塊要更提早出現，與「100%」數字重疊一小段時間** | `LoadingHero.vue`（`finish()` / `frame()`） | Bug／調整 | ✅ 已調整（2026-06-26）；✅ 追加提早翻橘（2026-06-29） | 🟢 成因明確：`finish()` 先把全部塗白、淡出數字，再隔 `finalOrangeDelay`(0.35s) 才把中央格翻橘 → 中間出現「全白空檔」。做法：把中央翻橘移到塗白同一幀（`finalOrangeDelay → 0`，或塗白迴圈後立即 `paint(centerIndex, 1)`，移除 setTimeout）。**追加（提早重疊）**：新增 `centerOrangeAt` prop（進度比例，預設 0.8＝80%），在 `frame()` 中當 `p >= centerOrangeAt` 時就強制中央格翻橘；此時數字仍在跑（約 80%→100%）、`.counter` 尚未淡出 → 橘塊與後續「100%」並存重疊一段，再於 t≥1 進 `finish()` 收尾。門檻可調：數字越小越早出現、重疊越久。 |

---

## 二、符號人臉互動

對應元件：[`SymbolFace.vue`](../app/components/SymbolFace.vue)

| # | 反饋內容 | 對應元件 | 類型 | 狀態 | CLAUDE 說明（可行性／方法） |
| --- | --- | --- | --- | --- | --- |
| 2-1 | 文字彩蛋觸發 OK；但手機版手指感應不穩。建議手機改為「點擊畫面任一處隨機出現問題」，或設計幾個明確提示點供點擊 | `SymbolFace.vue`（手機互動） | 調整 | ⏸ 暫緩（手機版，本輪不做） | 🟡 目前彩蛋靠 `pointermove` 命中宮格觸發，觸控移動不穩。做法：以 `matchMedia('(hover: none)')` 偵測觸控環境，改綁 `pointerdown`/`click`——點擊時隨機抽一句 `phrases` 定位到點擊處顯示、數秒後淡出；或預放幾個提示熱點 (DOM hotspot) 綁 click。屬新增觸控分支，非純調參。已有 `autoMouse` 自動遊走可參考重用。 |
| 2-2 | 電腦版與手機版文字位置之後再調整；文字需加入出現動畫（如亂碼跑動），讓彩蛋切換更明顯 | `SymbolFace.vue`（文字定位／動畫） | 微調＋新增 | 🔶 部分完成（亂碼動畫已做；文字位置微調暫緩） | 🟡 位置：彩蛋由 JS 每幀以 `transform` 定位在游標旁（`animate()` 內），加 desktop/mobile offset prop 或 RWD 即可微調（🟢）。亂碼跑動：`activeEgg` 只在換格時更新，可 `watch(activeEgg)` 觸發 scramble——自寫字元亂數替換逐步落定，或引入 GSAP ScrambleTextPlugin（需授權）。動畫屬新增，中等。 |
| 2-3 | **互動太像磁吸**，缺少「物理慣性被撞到散開、再慢慢歸位」的感覺，需研究調整（重點項目） | `SymbolFace.vue`（粒子物理） | 待研究 | 🔬 原型實作中（方案 B：CPU 彈簧-阻尼，2026-06-29，待手感確認） | 🔴 根因：目前粒子位置是 **無狀態** 的——vertex shader 每幀直接由游標算斥力位移，沒有速度/動量，游標離開即依 `mix` 拉回 → 必然是磁吸感。**已實作方案 B 原型**：引入 per-particle 附加位移層 `aDisp`＋速度 `vel`（CPU `Float32Array`），`animate()` 每幀做彈簧-阻尼積分（彈簧拉回 0＝歸位、阻尼衰減、游標半徑內注入外推 impulse），寫回 `aDisp` attribute；vertex shader 移除原斥力區塊改 `pos += aDisp`。欠阻尼時自然 overshoot → 撞散再慢慢聚攏。新增可調 props：`stiffness`／`damping`／`impulseStrength`；`maxParticles` 原型降至 6000。**待確認**：手感與桌機/手機效能；若效能不足或要回到 14000 顆，再把同一套力模型移植到 GPGPU ping-pong（方案 A）。 |
| 2-4 | 人臉符號排列改為「重疊」後，效果不如上次「不重疊」；另外白色與藍色位置疑似相反 —— 白色應是「小面積、最深」的地方（如模擬圖） | `SymbolFace.vue`（排列／配色） | Bug／調整 | ✅ 已調整（2026-06-26，待視覺確認） | 🟡 重疊：來自 `sizeMin/sizeMax`(16~20) 大於採樣間距 `sampleStep`(4) 造成字粒互疊；要回到不重疊可調大 `sampleStep`／調小字級，或改網格化採樣（一格一顆）先試。配色：`color` ramp＝`['#fff','#d1f4ff','#77c6e0','#000']`、`colorMode:'tone'` 下 `vT=1-aDark`（暗→白、亮→黑）。Liu 要「白色只落在小面積最深處」，需重排/反轉 `color` 陣列順序，並用非線性映射（調 `densityGamma`）讓白集中在最暗小範圍。需對照模擬圖調 props。 |

---

## 三、圖片 Gallery

對應元件：[`ShowcaseGallery.vue`](../app/components/ShowcaseGallery.vue)

| # | 反饋內容 | 對應元件 | 類型 | 狀態 | CLAUDE 說明（可行性／方法） |
| --- | --- | --- | --- | --- | --- |
| 3-1 | 效果沒問題；但目前滑動跑圖方向反了——需求為 **左 → 右** | `ShowcaseGallery.vue`（`render()`） | Bug（低優先） | ✅ 已調整（2026-06-26，左→右） | 🟢 母路徑 `getPointAtLength` 由左端(x=120)走向右端(x=880)，`t` 越大越靠右。`render()` 用 `const t = (i / N + state.p) % 1`：捲動時 t 變大 → 卡片往右端跑 → 視覺由左進、往右流 = **左→右**。若要反向改 `(i / N - state.p + 1) % 1`。 |

---

## 四、智慧心媒體

對應元件：[`HeartMetaball.vue`](../app/components/HeartMetaball.vue)

| # | 反饋內容 | 對應元件 | 類型 | 狀態 | CLAUDE 說明（可行性／方法） |
| --- | --- | --- | --- | --- | --- |
| 4-1 | 目前尚無多種底圖變換。請測試「多種底圖局部隨機切換」是否可行（可沿用現有紋樣再設定另一種顏色，或增加另一種等分方塊棋盤格，能看出多底紋變化即可） | `HeartMetaball.vue`（render loop 中心上色段） | 待研究 | ✅ 已實作 variant 局部隨機切換（2026-06-29，待視覺確認） | 🟡 以「variant system」一次涵蓋多色＋多 pattern＋局部隨機切換：**Step 1（靜態多底紋）**：中心切成 `accentBlock` 格見方的區塊，每塊持有 variant=(pattern, color)。pattern 兩種＝變寬棋盤／等分棋盤（`evenCells` 控制方格大小）；color＝藍/橘（`accentColor`）。多數維持 base（變寬棋盤藍），`accentRatio` 比例改用非 base（變寬橘／等分藍／等分橘）。**Step 2（局部隨機切換）**：variant 由「區塊座標 × epoch」的穩定 hash 決定，`epoch = floor(t/switchPeriod + 逐塊相位)`，相位逐塊錯開 → 各塊在不同時間點**硬切、此起彼落**；同 epoch 內每幀同值故不閃。`switchPeriod` 控節奏（預設 3s）。後續可往 VARIANTS 加更多 pattern／改 crossfade 轉場。與 `mosaicTexture.ts` 無關（legacy）。 |
| 4-2 | 手機版同樣手指互動感應不佳；之後改為「不用手指互動，直接預設在中心位置隨機跑動」 | `HeartMetaball.vue`（手機互動） | 調整 | ✅ 已實作（2026-06-29，待手機確認） | 🟢 兩步到位：(1) 把閒置漂浮從「小範圍多頻 sin（偏原地抖動）」改為**平滑隨機遊走**——多個不可公度頻率疊加成不重複有機路徑，移動範圍 ×4（`idleRoamRange` 0.4，原 ~0.1），並沿路徑距離補章避免移動中斷裂。(2) 以 `matchMedia('(hover: none)')` 偵測觸控環境時**不綁 pointer、一律自走**（`autoRoam` prop 可在桌機強制預覽）。所有自走參數皆可調：`idleRoamRange`(移動範圍)／`idleRoamSpeed`(速度)／`idleBlobMin`·`idleBlobMax`(顯示範圍/團塊大小)。 |

---

## 重點待測試項目（需再測試確認）

| 優先 | 項目 | 對應元件 | CLAUDE 說明（可行性／方法） |
| --- | --- | --- | --- |
| 1 | 人臉粒子「散開再聚攏」效果（脫離磁吸感） | `SymbolFace.vue` | 🔴 需引入物理慣性。目前是無狀態 shader 位移（磁吸必然），要改為速度積分（impulse→彈簧拉回→阻尼→overshoot 慢回）。建議 GPGPU ping-pong 在 GPU 模擬 position+velocity（適合 16000 顆）；備案為 CPU Float32Array 積分但需實測效能、或降 `maxParticles`。本項需投入研究與原型驗證。 |
| 2 | 心媒體「多底紋局部隨機切換」 | `HeartMetaball.vue` | 🟡 可行。把中心單一棋盤規則改為多 pattern／多色產生器，以穩定 hash 依區塊隨機指派達成局部變化。中度改動 render loop，既有 hash 基礎可重用。 |

> 其他部分（Loading、Gallery、彩蛋觸發本身）暫時都沒什麼太大的問題。
