/**
 * Parse json to object
 * @param json json
 * @return {any} object
 */
export const parseJson = (json: any): any => {
  let start = 0;
  while (true) {
    if (json[start] === "{") break;
    start++;
  }
  let end = json.length - 1;
  while (true) {
    if (json[end] === "}") break;
    end--;
  }
  const newJson = json.slice(start, end + 1);
  return JSON.parse(newJson);
};
