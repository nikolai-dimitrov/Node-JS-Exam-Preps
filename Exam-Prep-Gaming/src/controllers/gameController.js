const router = require("express").Router();
const gameService = require("../services/gameService");
const { isAuth } = require("../middlewares/authMiddleware");
const { extractErrorMessages, CustomError } = require("../utils/errorUtil");
const { generatePlatformOptions } = require("../utils/viewUtil");

//Catalog page.
router.get("/catalog", async (req, res) => {
  const allGames = await gameService.getAll().lean();
  res.render("games/catalog", { allGames });
});

//Details page.
router.get("/details/:gameId", async (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.user?._id;
  const currentGame = await gameService.getOne(gameId).lean();
  if (!currentGame) {
    res.redirect("/404");
    return;
  }
  const isOwner = await gameService.isGameOwner(gameId, userId);
  const wasBought = await gameService.isAlreadyBought(gameId, userId);
  res.render("games/details", { currentGame, isOwner, wasBought });
});

//Search page.
router.get("/search", isAuth(true), async (req, res) => {
  const allGames = await gameService.getAll().lean();
  res.render("games/search", { allGames });
});

router.post("/search", isAuth(true), async (req, res) => {
  const queryParams = { ...req.body };
  const allGames = await gameService.getQueriedGames(queryParams).lean();
  res.render("games/search", { allGames });
});

//Buy game.
router.get("/buy/:gameId", isAuth(true), async (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.user?._id;
  const wasBought = await gameService.isAlreadyBought(gameId, userId);
  const isOwner = await gameService.isGameOwner(gameId, userId);

  if (wasBought || isOwner) {
    res.redirect("/404");
    return;
  }
  s;
  await gameService.buy(gameId, userId);
  res.redirect(`/games/details/${gameId}`);
});

//Create page.
router.get("/create", isAuth(true), (req, res) => {
  res.render("games/create");
});
router.post("/create", isAuth(true), async (req, res) => {
  try {
    await gameService.create({ ...req.body, owner: req.user._id });
    res.redirect("/games/catalog");
  } catch (error) {
    const errorMessages = extractErrorMessages(error);
    res.render("games/create", { errorMessages: errorMessages });
  }
});

//Edit page.
router.get("/edit/:gameId", isAuth(true), async (req, res) => {
  const gameId = req.params.gameId;
  if (!(await gameService.isGameOwner(gameId, req.user?._id))) {
    res.redirect("/404");
    return;
  }
  const currentGame = await gameService.getOne(gameId).lean();
  const platformOptions = generatePlatformOptions(currentGame.platform);
  console.log(platformOptions);
  res.render("games/edit", { currentGame, platformOptions });
});

router.post("/edit/:gameId", isAuth(true), async (req, res) => {
  try {
    const gameId = req.params.gameId;
    if (!(await gameService.isGameOwner(gameId, req.user?._id))) {
      res.redirect("/404");
      return;
    }
    const newData = { ...req.body };
    await gameService.edit(gameId, newData);
    res.redirect(`/games/details/${gameId}`);
  } catch (error) {
    const errorMessages = extractErrorMessages(error);
    const currentGame = await gameService.getOne(req.params.gameId).lean();
    res.render("games/edit", { currentGame, errorMessages: errorMessages });
  }
});

//Delete page.
router.get("/delete/:gameId", isAuth(true), async (req, res) => {
  const gameId = req.params.gameId;
  if (!(await gameService.isGameOwner(gameId, req.user?._id))) {
    res.redirect("/404");
    return;
  }
  const newData = { ...req.body };
  await gameService.delete(gameId, newData);
  res.redirect("/games/catalog");
});

module.exports = router;
