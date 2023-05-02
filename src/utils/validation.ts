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
  const pattern = /[0-9一二三四五六七八九十よんじゅう]/;
  // const pattern =
  //   /[0-9一二三四五六七八九十百千万億兆京いちにさんしよんごろくしちはちきゅうじゅうひゃくせんまんおくちょうけいひとつふたつみっつよっついつつむっつななつやっつここのつとお]/;
  return pattern.test(str);
};
