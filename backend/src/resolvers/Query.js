const { forwardTo } = require('prisma-binding');
const { isLoggedIn } = require('../utils');

const Query = {
  event: forwardTo('db'),
  events: forwardTo('db'),
  eventsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
  },
  users: forwardTo('db'),
  user: forwardTo('db'),
  eventAdmins(parent, args, ctx, info) {
    // isLoggedIn(ctx.request.userId);
    return ctx.db.query.eventAdmins(
      { where: { permission: { name_not: 'USER' } } },
      info
    );
  },
  eventUsers(parent, args, ctx, info) {
    return ctx.db.query.eventAdmins(
      { where: { permission: { name: 'USER' } } },
      info
    );
  }
};

module.exports = Query;
