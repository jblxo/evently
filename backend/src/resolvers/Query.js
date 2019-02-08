const { forwardTo } = require('prisma-binding');

const Query = {
  event: forwardTo('db'),
  events: forwardTo('db'),
  eventsConnection: forwardTo('db'),
  users: forwardTo('db'),
  user: forwardTo('db'),
  eventAdmins: forwardTo('db'),
  board: forwardTo('db'),
  me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
  }
};

module.exports = Query;
