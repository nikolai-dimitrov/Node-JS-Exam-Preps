const router = require("express").Router();
const creatureService = require("../services/creatureService");
const { isAuth } = require("../middlewares/authMiddleware");
const { extractErrorMessages } = require("../utils/errorUtil");
//All-Posts page.
router.get("/all-posts", async (req, res) => {
  const allCreatures = await creatureService.getAll().lean();
  res.render("creatures/all-posts", { allCreatures });
});

//Details page.
router.get("/details/:creatureId", async (req, res) => {
  const creatureId = req.params.creatureId;
  const userId = req.user._id;
  const currentCreature = await creatureService.getOne(creatureId).lean();
  const isOwner = req.user?._id == currentCreature.owner._id;
  //votes
  const usersVotedEmails = currentCreature.votes
    .map((el) => el.email)
    .join(", ");

  const votesCount = currentCreature.votes.length;
  const hasVotes = votesCount > 0;

  const votesArray = await creatureService.isCurrentUserAlreadyVoted(
    creatureId,
    userId
  );
  const isVoted = votesArray.length > 0;
  //End votes
  res.render("creatures/details", {
    currentCreature,
    isOwner,
    votesCount,
    hasVotes,
    isVoted,
    usersVotedEmails,
  });
});

//Vote.
router.get("/vote/:creatureId", isAuth(true), async (req, res) => {
  const creatureId = req.params.creatureId;
  const userId = req.user._id;
  const currentCreature = await creatureService.getOne(creatureId).lean();
  //TODO return true or false IN ONE FUNC NOT IN VOTES ARRAY AND THAN IS VOTED.
  const votesArray = await creatureService.isCurrentUserAlreadyVoted(
    creatureId,
    userId
  );
  const isVoted = votesArray.length > 0;

  if (isVoted) {
    res.redirect("/404");
    return;
  }

  if (currentCreature.owner._id == userId) {
    res.redirect("/404");
    return;
  }

  await creatureService.vote(creatureId, userId);
  res.redirect(`/creatures/details/${creatureId}`);
});

// Create page.
router.get("/create", isAuth(true), (req, res) => {
  res.render("creatures/create");
});

router.post("/create", isAuth(true), async (req, res) => {
  try {
    await creatureService.create({ ...req.body, owner: req.user?._id });
    res.redirect("/creatures/all-posts");
  } catch (err) {
    const errorMessages = extractErrorMessages(err);
    res.render("creatures/create", { errorMessages });
  }
});

//Edit page.
router.get("/edit/:creatureId", isAuth(true), async (req, res) => {
  try {
    const creatureId = req.params.creatureId;
    const currentCreature = await creatureService.getOne(creatureId).lean();
    if (currentCreature.owner._id != req.user?._id) {
      res.redirect("/404");
      return;
    }
    res.render("creatures/edit", { currentCreature });
  } catch (err) {
    res.redirect("/404");
  }
});
//TODO ERROR FOR UNFINDED ENTITY IN DB AND ERROR FOR VALIDATION!
router.post("/edit/:creatureId", isAuth(true), async (req, res) => {
  const creatureId = req.params.creatureId;
  const currentCreature = await creatureService.getOne(creatureId).lean(); //TODO
  try {
    // const creatureId = req.params.creatureId;
    // const currentCreature = await creatureService.getOne(creatureId).lean();

    if (currentCreature.owner._id != req.user?._id) {
      res.redirect("/404");
      return;
    }
    const newData = { ...req.body };
    await creatureService.edit(creatureId, newData);
    res.redirect(`/creatures/details/${creatureId}`);
  } catch (err) {
    const errorMessages = extractErrorMessages(err);
    res.render("creatures/edit", { currentCreature, errorMessages });
  }
});

//Delete page.
router.get("/delete/:creatureId", isAuth(true), async (req, res) => {
  try {
    const creatureId = req.params.creatureId;
    const currentCreature = await creatureService.getOne(creatureId).lean();

    if (currentCreature.owner._id != req.user?._id) {
      res.redirect("/404");
      return;
    }
    await creatureService.delete(creatureId);
    res.redirect("/creatures/all-posts");
  } catch (err) {
    res.redirect("/404");
  }
});

module.exports = router;
