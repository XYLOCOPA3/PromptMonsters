/**
 * Count the number of characters in a string.
 * @param str string
 * @return {number} number of characters
 */
export const countCharacters = (str: string): number => {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    count += str.charCodeAt(i) <= 255 ? 1 : 2;
  }
  return count;
};

/**
 * Print the number of characters in a string.
 * @param str string
 * @return {string} 100 characters
 */
export const trimCharacters100 = (str: string): string => {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    newStr += str.charAt(i);
    if (countCharacters(newStr) > 100) return newStr;
  }
  return newStr;
};
