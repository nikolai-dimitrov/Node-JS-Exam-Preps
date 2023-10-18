exports.validateUrl = (url) => {
  let valueStr = url.toString();
  if (!valueStr.startsWith("http://") && !valueStr.startsWith("https://")) {
    return false;
  }
  return true;
};

exports.validatePositiveNumber = (number) => {
  return Number(number) > 0;
};
