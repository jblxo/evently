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
  user: forwardTo('db')
};

module.exports = Query;
