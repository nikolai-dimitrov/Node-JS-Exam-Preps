const router = require("express").Router();
const animalService = require("../services/animalService");

router.get("/", async (req, res) => {
  const allAnimals = await animalService.getLastAddedAnimals().lean();
  res.render("home", { allAnimals });
});

router.get("/404", (req, res) => {
  res.render("404");
});

module.exports = router;
