const mongoose = require("mongoose");
const modelValidators = require("../validators/modelValidators");
const bookSchema = new mongoose.Schema({
  title: {
    type: "String",
    required: [true, "This field is required!"],
    minLength: [2, "Title should be at least 2 characters"],
  },
  author: {
    type: "String",
    required: [true, "This field is required!"],
    minLength: [5, "Author should be at least 5 characters"],
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
  bookReview: {
    type: "String",
    required: [true, "This field is required!"],
    minLength: [10, "Book review should be at least 10 characters"],
  },
  genre: {
    type: "String",
    required: [true, "This field is required!"],
    minLength: [3, "Genre should be at least 3 characters"],
  },
  stars: {
    type: "Number",
    required: [true, "This field is required!"],
    min: [1, "Stars must be more than 1"],
    max: [5, "Stars must be max 5"],
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: "Stars must be positive number.",
    },
  },
  wishingList: [
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
const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
