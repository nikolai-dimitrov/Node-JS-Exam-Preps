const Creature = require("../models/Creature");
exports.create = (creatureData) => Creature.create(creatureData);
exports.getAll = () => Creature.find({});
exports.getOne = (creatureId) =>
  Creature.findById(creatureId).populate("owner").populate({ path: "votes" });
exports.edit = (creatureId, newData) =>
  Creature.findByIdAndUpdate(creatureId, newData, { runValidators: true });
exports.delete = (creatureId) => Creature.findByIdAndDelete(creatureId);
exports.vote = async (creatureId, userId) => {
  const currentCreature = await this.getOne(creatureId);
  currentCreature.votes.push(userId);
  currentCreature.save();
};
exports.isCurrentUserAlreadyVoted = (creatureId, userId) => {
  // console.log(await Creature.find({}).where({ _id: creatureId }).where("votes").in(userId))
  return Creature.find({}).where({ _id: creatureId }).where("votes").in(userId);
};
exports.getMyCreatures = (userId) =>
  // Creature.find({}).where("owner").in(userId);
  Creature.find({ owner: userId });
