exports.checkPermissions = (ownerId, reqUserId) => {
  return ownerId == reqUserId ? true : false;
};
