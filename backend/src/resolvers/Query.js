const { forwardTo } = require('prisma-binding');

const Query = {
  event: forwardTo('db'),
  events: forwardTo('db')
};

module.exports = Query;
