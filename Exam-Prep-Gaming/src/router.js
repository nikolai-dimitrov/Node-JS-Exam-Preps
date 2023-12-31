const router = require("express").Router();
const { CustomError } = require("./utils/errorUtil");
const homeController = require("./controllers/homeController");
const userController = require("./controllers/userController");
const gameController = require("./controllers/gameController");

router.use("/", homeController);
router.use("/users", userController);
router.use("/games", gameController);
router.all("*", (req, res, next) => {
  let err = new CustomError("Can not find this url", 404);
  next(err);
});
module.exports = router;
