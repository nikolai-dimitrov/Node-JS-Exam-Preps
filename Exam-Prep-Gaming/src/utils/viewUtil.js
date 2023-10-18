exports.generatePlatformOptions = (platform) => {
  platformOptions = ["PC", "Nintendo", "XBOX", "PS4", "PS5"];
  let mappedOptions = platformOptions.map((el) => {
    currentOption = {
      name: el,
      value: el,
      selected: platform == el ? 'selected' : '',
    };
    return currentOption;
  });
  return mappedOptions;
};
