const router = require("express").Router();
const bookService = require("../services/bookService");
const { isAuth } = require("../middlewares/authMiddleware");
const { extractErrorMessages } = require("../utils/errorUtil");

//Details page.
router.get("/details/:bookId", async (req, res) => {
  const bookId = req.params.bookId;
  const currentBook = await bookService.getOne(bookId).lean();
  const isOwner = await bookService.isOwner(bookId, req.user?._id);
  const hasAlreadyWished = await bookService.hasAlreadyWished(
    bookId,
    req.user?._id
  );
  res.render("books/details", { currentBook, isOwner, hasAlreadyWished });
});

//Wish book.
router.get("/wish/:bookId", isAuth(true), async (req, res) => {
  const bookId = req.params.bookId;
  const hasAlreadyWished = await bookService.hasAlreadyWished(
    bookId,
    req.user?._id
  );
  const isOwner = await bookService.isOwner(bookId, req.user?._id);
  if (hasAlreadyWished || isOwner) {
    res.redirect("/404");
    return;
  }
  await bookService.wishBook(bookId, req.user?._id);
  res.redirect(`/books/details/${bookId}`);
});

//Catalog page.
router.get("/catalog", async (req, res) => {
  const allBooks = await bookService.getAll().lean();

  res.render("books/catalog", { allBooks });
});
//Book create page.
router.get("/create", isAuth(true), (req, res) => {
  res.render("books/create");
});

router.post("/create", isAuth(true), async (req, res) => {
  try {
    const bookData = { ...req.body, owner: req.user?._id };
    await bookService.create(bookData);
    res.redirect("/books/catalog");
  } catch (error) {
    const enteredData = { ...req.body };
    const errorMessages = extractErrorMessages(error);
    res.render("books/create", { errorMessages, enteredData });
  }
});
//Book edit.
router.get("/edit/:bookId", isAuth(true), async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const currentBook = await bookService.getOne(bookId).lean();
    const isOwner = await bookService.isOwner(bookId, req.user?._id);
    if (!isOwner) {
      res.redirect("/404");
      return;
    }
    res.render("books/edit", { currentBook });
  } catch (error) {
    res.redirect("/404");
  }
});
router.post("/edit/:bookId", isAuth(true), async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const isOwner = await bookService.isOwner(bookId, req.user?._id);
    if (!isOwner) {
      res.redirect("/404");
      return;
    }
    const bookData = { ...req.body };
    await bookService.edit(bookId, bookData);
    res.redirect(`/books/details/${bookId}`);
  } catch (error) {
    const currentBook = await bookService.getOne(req.params.bookId).lean();
    const errorMessages = extractErrorMessages(error);
    res.render("books/edit", { errorMessages, currentBook });
  }
});

//Book delete.
router.get("/delete/:bookId", isAuth(true), async (req, res) => {
  const bookId = req.params.bookId;
  const isOwner = await bookService.isOwner(bookId, req.user?._id);
  if (!isOwner) {
    res.redirect("/404");
    return;
  }
  await bookService.delete(bookId);
  res.redirect("/books/catalog");
});
module.exports = router;
