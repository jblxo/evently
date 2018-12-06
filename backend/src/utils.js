function isLoggedIn(id) {
  if (!id) throw new Error('You must be logged in to do that!');
}

exports.isLoggedIn = isLoggedIn;
