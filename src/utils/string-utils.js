const StringUtils = {};

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
StringUtils.random = (length) => {
  var result = '';
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

Object.freeze(StringUtils);
export default StringUtils;
