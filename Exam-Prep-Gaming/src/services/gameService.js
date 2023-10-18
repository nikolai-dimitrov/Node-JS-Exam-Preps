const Game = require("../models/Game");
exports.getOne = (gameId) => Game.findById(gameId);
exports.getAll = () => Game.find({});
exports.create = (data) => Game.create(data);
exports.edit = (gameId, newData) =>
  Game.findByIdAndUpdate(gameId, newData, { runValidators: true });
exports.delete = (gameId) => Game.findByIdAndDelete(gameId);
exports.buy = async (gameId, userId) => {
  const game = await Game.findById(gameId);
  game.boughtBy.push(userId);
  game.save();
};
exports.isAlreadyBought = async (gameId, userId) => {
  const game = await Game.findById(gameId).where("boughtBy").in(userId);
  return game;
};

exports.isGameOwner = async (gameId, userId) => {
  const game = await this.getOne(gameId);
  return game.owner._id == userId ? true : false;
};

exports.getQueriedGames = (queryParams) => {
  let defaultQueryParams = {
    name: "(.*?)",
    platform: ["PC", "XBOX", "Nintendo", "PS4", "PS5"],
  };
  // Modify query params.
  Object.entries(queryParams)
    .filter((el) => el[1] != "")
    .map((el) => (defaultQueryParams[el[0]] = el[1]));
  //Db query
  let filteredGames = Game.find({
    name: { $regex: defaultQueryParams.name, $options: "i" },
  })
    .where("platform")
    .in(defaultQueryParams.platform);

  return filteredGames;
};
