const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("../lib/jwt");
const { JWT_SECRET } = require("../constants");
const { buildPayloadJwt } = require("../utils/authUtil");

exports.register = async (userData) => {
  const newUser = await User.create(userData);
  return newUser;
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("Invalid username or password");
  }
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    throw new Error("Invalid username or  password");
  }
  const payload = buildPayloadJwt(user);
  const token = await jwt.sign(payload, JWT_SECRET, { expiresIn: "2d" });
  return token;
};
