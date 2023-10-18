const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  name: {
    type: "String",
    require: [true, "Name is required!"],
  },
  image: {
    type: "String",
    require: [true, "Image is required!"],
  },
  age: {
    type: "Number",
    require: [true, "Age is required!"],
  },
  description: {
    type: "String",
    require: [true, "Description is required!"],
  },
  location: {
    type: "String",
    require: [true, "Location is required!"],
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  commentList: [
    {
      userId: {
        type: "String",
        // type: mongoose.Types.ObjectId,
        // ref: "User",
      },
      comment: {
        type: "String",
      },
    },
  ],
});

// photoSchema.pre("findByIdAndUpdate", function (next) {
//   this.options.runValidators = true;
//   next();
// });
const Photo = mongoose.model("Photo", photoSchema);
module.exports = Photo;
