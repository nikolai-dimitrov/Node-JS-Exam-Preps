const Book = require("../models/Book");
exports.getOne = (bookId) => Book.findById(bookId);
exports.getAll = () => Book.find({});
exports.create = (data) => Book.create(data);
exports.edit = (bookId, data) =>
  Book.findByIdAndUpdate(bookId, data, { runValidators: true });
exports.delete = (bookId) => Book.findByIdAndDelete(bookId);

exports.hasAlreadyWished = async (bookId, userId) => {
  return (await Book.findById(bookId).where("wishingList").in(userId))
    ? true
    : false;
};
exports.wishBook = async (bookId, userId) => {
  let book = await Book.findById(bookId);
  book.wishingList.push(userId);
  book.save();
};
exports.isOwner = async (bookId, userId) => {
  const book = await this.getOne(bookId).lean();
  return book.owner._id == userId ? true : false;
};

exports.getUserWishList = (userId) =>
  Book.find({}).where("wishingList").in(userId);
