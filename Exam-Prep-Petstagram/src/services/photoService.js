const mongoose = require("mongoose");
const Photo = require("../models/Photo");

exports.create = async (photoData) => {
  return await Photo.create(photoData);
};
exports.edit = async (photoId, photoData) => {
  const updatedPhoto = await Photo.findByIdAndUpdate(
    photoId,
    {
      name: photoData.name,
      age: photoData.age,
      description: photoData.description,
      location: photoData.location,
      image: photoData.image,
    },
    { runValidators: true }
  );
};
exports.delete = async (photoId) => {
  await Photo.findByIdAndDelete(photoId);
};
exports.getAll = async () => {
  return await Photo.find().populate("owner").lean();
};

exports.getCurrentPhoto = async (photoId) => {
  return await Photo.findById(photoId).populate("owner").lean();
};

exports.getUserPhotos = async (userId) => {
  // Photo.find({owner:userId})
  return await Photo.where("owner").in(userId).lean();
};

exports.addComment = async (userId, photoId, comment) => {
  let currentPhoto = await Photo.findById(photoId);
  currentPhoto.commentList.push({ userId, comment });
  currentPhoto.save();
};

exports.populateAndFormatPhotoComments = async (photoId) => {
  let populatedPhotoObject = await Photo.findById(photoId).populate({
    path: "commentList",
    populate: {
      path: "userId",
      model: "User",
    },
  });
  // Todo fix this...
  let formattedComments = populatedPhotoObject.commentList.map((element) => {
    console.log(element);
    return { username: element.userId.username, comment: element.comment };
  });
  return formattedComments;
};
