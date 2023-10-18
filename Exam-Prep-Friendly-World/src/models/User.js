const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  email: {
    type: "String",
    unique: true,
    required: [true, "Email is required!"],
    minLength: [10, "Email must be at least 10 characters"],
    validate: [
      {
        validator: async function () {
          return (await mongoose.model("User").findOne({ email: this.email }))
            ? false
            : true;
        },
        message: "Email already exists",
      },
      // {
      //   validator: function (value) {
      //     return /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
      //   },
      //   message: "Email field must contain valid email symbols!",
      // },
    ],
  },
  password: {
    type: "String",
    required: [true, "Password is required!"],
    minLength: [4, "Password must be at least 5 characters"],
  },
});

userSchema.virtual("repeatPassword").set(function (value) {
  if (value != this.password) {
    throw new Error("Password missmatch!");
  }
});

userSchema.pre("save", async function () {
  const hashPassword = await bcrypt.hash(this.password, 10);
  this.password = hashPassword;
});

const User = mongoose.model("User", userSchema);
module.exports = User;
