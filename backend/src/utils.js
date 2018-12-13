function isLoggedIn(id) {
  if (!id) throw new Error('You must be logged in to do that!');
}
function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave)
  );
  if (!matchedPermissions.length > 1) {
    throw new Error(`You don't have sufficient permissions

      : ${permissionsNeeded}

      You Have:

      ${user.permissions}
    `);
  }
}

exports.isLoggedIn = isLoggedIn;
exports.hasPermission = hasPermission;
