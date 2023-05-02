/**
 * Check str is number or symbol
 * @param str string
 * @return {boolean} is number or symbol
 */
export const isSymbol = (str: string): boolean => {
  const pattern = /[!@#$%^&*()_+={}|[\]\\;:<>/?]/;
  return pattern.test(str);
};

/**
 * Check str is number or symbol
 * @param str string
 * @return {boolean} is number or symbol
 */
export const isNum = (str: string): boolean => {
  const pattern =
    /(三十|サンジュウ|ｻﾝｼﾞｭｳ|thirty|四十|ヨンジュウ|ﾖﾝｼﾞｭｳ|[0-9]+)|((一|二|三|四|五|六|七|八|九)?十(一|二|三|四|五|六|七|八|九)?|(一|二|三|四|五|六|七|八|九))/;
  return pattern.test(str);
};

/**
 * Check str is NG word
 * @param str string
 * @return {boolean} is NG word
 */
export const isNGWord = (str: string): boolean => {
  const pattern = /(HP|ATK|DEF|INT|MGR|AGL)/;
  return pattern.test(str);
};
