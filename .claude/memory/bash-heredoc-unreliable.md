---
name: bash-heredoc-unreliable
description: 本機 Bash 工具的 heredoc 不可靠——寫檔一律用 Write，不要用 cat << EOF
metadata:
  type: feedback
---

本機 Bash 工具處理 heredoc（`cat > f << 'EOF'` / `cat >> f << 'EOF'`）會出錯，兩次都中招：

1. 第一次直接 parse 失敗：`unexpected EOF while looking for matching '` —— 內容是純文字、引號已用 `'EOF'` 包住，語法本身沒問題。
2. 第二次更糟：`cat >> spec.md << 'MDEOF'` 沒有附加，而是把目標檔**截斷**成只剩新內容（原本 400 行變 58 行）。同一時間 `temp/` 有 84 個檔案被刪進資源回收筒（已全數還原，靠 `Shell.Application` 的 `Namespace(10)` ＋ 動詞 `R&estore`）。兩者的因果沒查實，但時間高度重疊。

**How to apply:** 寫檔、附加檔案一律用 Write / Edit 工具。要附加就先讀原檔、用 Write 重寫完整內容。Bash 只用來跑指令與查詢，不要用它產生檔案內容。多行字串傳給 native 執行檔（如 `git commit -m`）也避開 heredoc。

順帶：Windows 的刪除有進資源回收筒，所以這類意外是可還原的 —— 發現檔案不見時先查回收筒再說，不要當成已經沒了。相關：[[dev-server-port-ownership]]
