const router = require("express").Router();
const userService = require("../services/userService");
const creatureService = require("../services/creatureService");
const { extractErrorMessages } = require("../utils/errorUtil");
const { isAuth } = require("../middlewares/authMiddleware");

router.get("/register", isAuth(false), (req, res) => {
  res.render("users/register");
});

router.post("/register", isAuth(false), async (req, res) => {
  try {
    const { firstName, lastName, email, password, repeatPassword } = req.body;
    const token = await userService.register({
      firstName,
      lastName,
      email,
      password,
      repeatPassword,
    });
    res.cookie("auth", token, { httpOnly: true });
    res.redirect("/");
  } catch (error) {
    const errorMessages = extractErrorMessages(error);
    res.render("users/register", { errorMessages: errorMessages });
  }
});

router.get("/login", isAuth(false), (req, res) => {
  res.render("users/login");
});

router.post("/login", isAuth(false), async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await userService.login(email, password);
    res.cookie("auth", token, { httpOnly: true });
    res.redirect("/");
  } catch (error) {
    const errorMessages = extractErrorMessages(error);
    res.render("users/login", { errorMessages: errorMessages });
  }
});

router.get("/logout", isAuth(true), (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});

router.get("/profile", isAuth(true), async (req, res) => {
  const userCreatures = await creatureService
    .getMyCreatures(req.user?._id)
    .populate("owner")
    .lean();
  userCreatures.map((el) => (el["votesCount"] = el.votes.length));
  res.render("users/my-posts", { userCreatures });
});

module.exports = router;
