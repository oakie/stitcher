const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const random = (length: number) => {
  var result = '';
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

const StringUtils = { random };
export default StringUtils;
