exports.isEntityOwner = (res, userId, entityOwnerId) => {
  return userId != entityOwnerId;
};
