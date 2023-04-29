/**
 * Check str is number or symbol
 */
export const isNumOrSymbol = (str: string): boolean => {
  const pattern = /[0-9!@#$%^&*()_+={}|[\]\\;:<>/?]/;
  return pattern.test(str);
};
