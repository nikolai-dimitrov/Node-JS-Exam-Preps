const router = require("express").Router();
const photoService = require("../services/photoService");

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/catalog", async (req, res) => {
  let photos = await photoService.getAll();
  res.render("catalog", { photos });
});

router.get("/404", (req, res) => {
  res.render("404");
});

module.exports = router;
