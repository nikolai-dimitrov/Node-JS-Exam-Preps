const Animal = require("../models/Animal");
const User = require("../models/User");
exports.create = (animalData) => {
  return Animal.create(animalData);
};
exports.edit = (animalId, animalData) => {
  return Animal.findByIdAndUpdate(animalId, animalData, {
    runValidators: true,
  });
};
exports.delete = (animalId) => {
  return Animal.findByIdAndDelete(animalId);
};
exports.getCurrentAnimal = (animalId) => {
  return Animal.findById(animalId);
};

exports.getAllAnimals = () => {
  return Animal.find();
};

exports.getLastAddedAnimals = () => {
  return Animal.find().sort({ datetime: -1 }).limit(3);
};

exports.checkIdDonations = async (userId, currentAnimalId) => {
  let mongooseDocumentArray = await Animal.find({ _id: currentAnimalId })
    .where("donations")
    .in(userId);
  if (mongooseDocumentArray.length == 0) {
    return false;
  }
  return true;
};

exports.donateForAnimal = async (userId, animalId) => {
  let animal = await Animal.findById(animalId);
  if (!(await this.checkIdDonations(userId, animalId))) {
    animal.donations.push(userId);
    animal.save();
    return;
  }
  throw new Error("Message");
};
