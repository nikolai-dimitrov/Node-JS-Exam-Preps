const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: [true],
    minLength: [2, "Name must be more than 2 characters"],
  },
  years: {
    type: "Number",
    required: [true],
    min: [1, "Year must be more than 1"],
    max: [100, "Year must be lower than 100"],
  },
  kind: {
    type: "String",
    required: [true],
    minLength: [3, "Kind must be more than 2 characters"],
  },
  image: {
    type: "String",
    required: [true],
  },
  need: {
    type: "String",
    required: [true],
    minLength: [3, "Need must be more than 3 characters"],
    maxLength: [20, "Name must be more than 20 characters"],
  },
  location: {
    type: "String",
    required: [true],
    minLength: [5, "Location must be more than 5 characters"],
    maxLength: [15, "Location must be more than 15 characters"],
  },
  description: {
    type: "String",
    required: [true],
    minLength: [5, "Need must be more than 5 characters"],
    maxLength: [50, "Name must be more than 50 characters"],
  },
  donations: [{ type: mongoose.Types.ObjectId }],
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const Animal = mongoose.model("Animal", animalSchema);

module.exports = Animal;
