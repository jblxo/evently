const { forwardTo } = require('prisma-binding');
const { isLoggedIn } = require('../utils');

const Query = {
  event: forwardTo('db'),
  events: forwardTo('db'),
  me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
  },
  // TODO: Add users query
  users(parent, args, ctx, info) {
    // 1. Check if they are logged in
    // 2. TODO: check if they have the permission to do that
    // 3. QUery all the users
  }
};

module.exports = Query;
