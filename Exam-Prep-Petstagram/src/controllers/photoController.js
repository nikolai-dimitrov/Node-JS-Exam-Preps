const router = require("express").Router();
const photoService = require("../services/photoService");
const { isAuth } = require("../middlewares/authMiddleware");
const { checkPermissions } = require("../utils/authUtils");
router.get("/create", isAuth(true), (req, res) => {
  res.render("photos/create");
});
router.post("/create", isAuth(true), async (req, res) => {
  const { name, age, description, image, location } = req.body;
  await photoService.create({
    name,
    age,
    description,
    image,
    location,
    owner: req.user._id,
  });
  res.redirect("/catalog");
});

router.get("/edit/:photoId", isAuth(true), async (req, res) => {
  const currentPhoto = await photoService.getCurrentPhoto(req.params.photoId);
  if (checkPermissions(currentPhoto.owner._id, req.user._id)) {
    res.render("photos/edit", { currentPhoto });
    return;
  }
  res.redirect("/404");
});

router.post("/edit/:photoId", isAuth(true), async (req, res) => {
  const photoId = req.params.photoId;
  const currentPhoto = await photoService.getCurrentPhoto(req.params.photoId);
  const { name, age, description, image, location } = req.body;
  if (checkPermissions(currentPhoto.owner._id, req.user._id)) {
    await photoService.edit(photoId, {
      name,
      age,
      description,
      image,
      location,
    });
    res.redirect(`/photos/details/${photoId}`);
    return;
  }
  res.redirect("/404");
});

router.get("/delete/:photoId", isAuth(true), async (req, res) => {
  const currentPhoto = await photoService.getCurrentPhoto(req.params.photo);
  if (checkPermissions(currentPhoto.owner._id, req.user._id)) {
    await photoService.delete(req.params.photoId);
    res.redirect("/catalog");
  }
  res.redirect("/404");
  return;
});

router.get("/details/:photoId", async (req, res) => {
  const currentPhoto = await photoService.getCurrentPhoto(req.params.photoId);
  if (!currentPhoto) {
    res.redirect("/404");
    return;
  }
  const photoComments = currentPhoto.commentList;
  const isPhotoOwner = req.user?._id == currentPhoto.owner._id ? true : false;
  const photoCommentsArray = await photoService.populateAndFormatPhotoComments(
    currentPhoto._id
  );
  res.render("photos/details", {
    currentPhoto,
    isPhotoOwner,
    photoCommentsArray,
  });
});

router.post("/details/:photoId", isAuth(true), async (req, res) => {
  const photoId = req.params.photoId;
  const currentPhoto = await photoService.getCurrentPhoto(photoId);
  const userId = req.user?._id;
  if (checkPermissions(currentPhoto.owner._id, userId)) {
    res.redirect("/404");
    return;
  }
  const { comment } = req.body;
  await photoService.addComment(userId, photoId, comment);
  res.redirect(`/photos/details/${photoId}`);
});

module.exports = router;
