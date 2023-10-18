const router = require("express").Router();
const animalService = require("../services/animalService");
// const userService = require("../services/userService");
const { extractErrorMessages } = require("../utils/errorUtil");
const { isAuth } = require("../middlewares/authMiddleware");
const { isEntityOwner } = require("../utils/permissionsUtil");

router.get("/search", (req, res) => {
  res.render("animals/search");
});
// Dashboard.
router.get("/dashboard", async (req, res) => {
  const allAnimals = await animalService.getAllAnimals().lean();
  res.render("animals/dashboard", { allAnimals });
});

//Details animal.
router.get("/details/:animalId", async (req, res) => {
  const currentAnimal = await animalService
    .getCurrentAnimal(req.params.animalId)
    .lean();
  const isOwner = req.user?._id == currentAnimal.owner._id;
  const isAlreadyDonated = await animalService.checkIdDonations(
    req.user?._id,
    currentAnimal._id
  );
  res.render("animals/details", { currentAnimal, isOwner, isAlreadyDonated });
});

//Donate animal.
router.get("/donate/:animalId", isAuth(true), async (req, res) => {
  try {
    const animalId = req.params.animalId;
    const userId = req.user?._id;
    const animal = await animalService.getCurrentAnimal(animalId);
    if (userId == animal.owner._id) {
      res.redirect("/404");
      return;
    }
    await animalService.donateForAnimal(userId, animalId);
    res.redirect(`/animals/details/${animalId}`);
  } catch (err) {
    const errorMessages = extractErrorMessages(err);
    res.redirect("/404", 404, { errorMessages });
  }
});

// Create animal.
router.get("/create", isAuth(true), (req, res) => {
  res.render("animals/create");
});

router.post("/create", isAuth(true), async (req, res) => {
  try {
    await animalService.create({
      ...req.body,
      owner: req.user._id,
    });
    res.redirect("/animals/dashboard");
  } catch (err) {
    const errorMessages = extractErrorMessages(err);
    res.render("animals/create", { errorMessages });
  }
});
//Edit animal.

router.get("/edit/:animalId", isAuth(true), async (req, res) => {
  try {
    animalId = req.params.animalId;
    const currentAnimal = await animalService.getCurrentAnimal(animalId).lean();
    if (isEntityOwner(res, req.user?._id, currentAnimal.owner._id)) {
      res.redirect("/404");
      return;
    }
    res.render("animals/edit", { currentAnimal });
  } catch (err) {
    const errorMessages = extractErrorMessages(err);
    res.render(`animals/edit`, { errorMessages });
  }
});

router.post("/edit/:animalId", isAuth(true), async (req, res) => {
  try {
    const animalId = req.params.animalId;
    const animal = await animalService.getCurrentAnimal(animalId);
    if (isEntityOwner(res, req.user?._id, animal.owner._id)) {
      res.redirect("/404");
      return;
    }
    await animalService.edit(animalId, { ...req.body });
    res.redirect(`/animals/details/${animalId}`);
  } catch (err) {
    const currentAnimal = await animalService.getCurrentAnimal(animalId).lean();
    const errorMessages = extractErrorMessages(err);
    res.render(`animals/edit`, { currentAnimal, errorMessages });
  }
});

// Delete animal.
router.get("/delete/:animalId", isAuth(true), async (req, res) => {
  const animalId = req.params.animalId;
  try {
    const animal = await animalService.getCurrentAnimal(animalId);
    if (isEntityOwner(res, req.user?._id, animal.owner._id)) {
      res.redirect("/404");
      return;
    }
    await animalService.delete(animalId);
    res.redirect("/animals/dashboard");
  } catch (err) {
    res.redirect("/404");
  }
});
module.exports = router;
