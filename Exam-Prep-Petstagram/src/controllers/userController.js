const router = require("express").Router();
const userService = require("../services/userService");
const photoService = require("../services/photoService");
const { extractErrorMessages } = require("../utils/errorUtil");
const { isAuth } = require("../middlewares/authMiddleware");

router.get("/register", isAuth(false), (req, res) => {
  res.render("users/register");
});

router.post("/register", isAuth(false), async (req, res) => {
  try {
    const { username, email, password, repeatPassword } = req.body;
    await userService.register({ username, email, password, repeatPassword });
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
    const { username, password } = req.body;
    const token = await userService.login(username, password);
    res.cookie("auth", token, { httpOnly: true });
    res.redirect("/");
  } catch (error) {
    const errorMessages = extractErrorMessages(error);
    res.render("users/login", { errorMessages: errorMessages });
  }
});

router.get("/profile/:profileId", isAuth(true), async (req, res) => {
  const userId = req.params.profileId;
  const userPhotos = await photoService.getUserPhotos(userId);
  const photosCount = userPhotos.length;
  res.render("users/profile", { userPhotos, photosCount });
});

router.get("/logout", isAuth(true), (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});

module.exports = router;
