#!/usr/bin/env bash
#
# 產生 GitHub Pages 用的 staging branch。
#
# 流程：砍掉本地 staging → 從目前 HEAD 重開 → 套用 ghpage 環境變數 → generate
#       → 把靜態輸出放到 docs/ → commit → force push。
#
# 用法：./github-page.sh
#
# ⚠️ 會直接覆蓋 .env（內容換成 .env.ghpage.example）。跑完要回到開發設定的話，
#    自己把 .env.development.example 複製回 .env。

set -euo pipefail

BRANCH="staging"
DOCS_DIR="docs"
ENV_EXAMPLE=".env.ghpage.example"

cd "$(dirname "$0")"

ORIGINAL_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "==> 目前分支：${ORIGINAL_BRANCH}"

# 1. 刪除 local 的 staging branch（不存在就跳過）
if [ "$ORIGINAL_BRANCH" = "$BRANCH" ]; then
  echo "!!! 目前就在 ${BRANCH} 上，無法刪除自己所在的分支。請先切到其他分支再執行。"
  exit 1
fi

if git show-ref --verify --quiet "refs/heads/${BRANCH}"; then
  echo "==> 刪除本地分支 ${BRANCH}"
  git branch -D "$BRANCH"
else
  echo "==> 本地沒有 ${BRANCH}，略過刪除"
fi

# 2 + 3. 從目前 HEAD 建立並切換到 staging
echo "==> 建立並切換到 ${BRANCH}"
git checkout -b "$BRANCH"

# 4. 套用 GitHub Pages 環境變數
# .env.ghpage.example 內含 NUXT_URL，nuxt.config.ts 會取它的 pathname 當
# app.baseURL；沒套的話 baseURL 是 /，project site 下 _nuxt 資源會 404。
if [ ! -f "$ENV_EXAMPLE" ]; then
  echo "!!! 找不到 ${ENV_EXAMPLE}，中止。"
  exit 1
fi
echo "==> 複製 ${ENV_EXAMPLE} → .env"
cp "$ENV_EXAMPLE" .env

# 5. 產生靜態檔
echo "==> pnpm generate"
pnpm generate

# 6. 把輸出複製到 docs/
# Nuxt 4 的靜態輸出在 .output/public，dist/ 只是指向它的 symlink，
# 直接複製 symlink 會把連結本身複製過去，所以優先用實體目錄。
if [ -d ".output/public" ]; then
  BUILD_DIR=".output/public"
elif [ -d "dist" ]; then
  BUILD_DIR="dist"
else
  echo "!!! 找不到建置輸出（.output/public 或 dist），中止。"
  exit 1
fi
echo "==> 從 ${BUILD_DIR} 複製到 ${DOCS_DIR}/"

rm -rf "$DOCS_DIR"
mkdir -p "$DOCS_DIR"
cp -R "${BUILD_DIR}/." "$DOCS_DIR/"

# GitHub Pages 預設走 Jekyll，會忽略底線開頭的目錄（Nuxt 的 _nuxt/ 首當其衝），
# 放 .nojekyll 才會原樣提供靜態檔。
touch "${DOCS_DIR}/.nojekyll"

# 7. commit
echo "==> commit"
git add -f "$DOCS_DIR"
if git diff --cached --quiet; then
  echo "==> 沒有變更，略過 commit"
else
  git commit -m "test"
fi

# 8. force push
echo "==> force push ${BRANCH}"
git push -f origin "$BRANCH"

echo "==> 完成。目前在 ${BRANCH}（原本在 ${ORIGINAL_BRANCH}）"
