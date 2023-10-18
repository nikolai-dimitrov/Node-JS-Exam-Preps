const mongoose = require("mongoose");
const modelValidators = require("../validators/modelValidators");

const gameSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: [true, "This field is required!"],
    minLength: [4, "Name min length is 4 characters."],
  },
  image: {
    type: "String",
    required: [true, "This field is required!"],
    validate: [
      {
        validator: modelValidators.validateUrl,
        message: "Image field should be valid URL.",
      },
    ],
  },
  price: {
    type: "Number",
    required: [true, "This field is required!"],
    validate: [
      {
        validator: modelValidators.validatePositiveNumber,
        message: "Price should be positive number.",
      },
    ],
  },
  description: {
    type: "String",
    required: [true, "This field is required!"],
    minLength: [10, "Description min length is 4 characters."],
  },
  genre: {
    type: "String",
    required: [true, "This field is required!"],
    minLength: [2, "Genre min length is 2 characters."],
  },
  platform: {
    type: "String",
    required: [true, "This field is required!"],
    enum: {
      values: ["PC", "Nintendo", "PS4", "PS5", "XBOX"],
      message:
        "Field must contain one of the following types: PC, NINTENDO, PS4, PS5, XBOX",
    },
  },
  boughtBy: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
