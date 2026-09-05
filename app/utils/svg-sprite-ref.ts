/**
 * locales JSON 裡的素材路徑（/img/blessing/partner-shopee.svg）↔ sprite 內的 symbol id。
 * 規則只有一條：id ＝ 檔名去副檔名。scripts/build-svg-sprites.mjs 用同一條規則產 sprite，
 * 兩邊不會分岔（test/sprite-coverage.spec.ts 對帳）。
 */
export const spriteSymbolId = (publicPath: string): string => {
  const name = publicPath.slice(publicPath.lastIndexOf('/') + 1);
  return name.replace(/\.[^.]+$/, '');
};

export const isSvgPath = (publicPath: string): boolean => /\.svg$/i.test(publicPath);
