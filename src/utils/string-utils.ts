const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const random = (length: number) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

const keywords = (...terms: string[]) => {
  const substrings = terms.map((x) => x.toLowerCase().split(/[\s@.]/)).flat();
  const keywords: Set<string> = new Set<string>();

  for (const str of substrings) {
    if (str.length < 3) continue;
    for (let i = 3; i <= str.length; ++i) {
      keywords.add(str.substring(i - 3, i));
    }
  }

  return Array.from(keywords.values());
};

const StringUtils = { random, keywords };
export default StringUtils;
