const { withFilter } = require('graphql-yoga');

const Subscription = {
  notificationAdded: {
    subscribe: withFilter(
      (payload, args, { pubsub }, info) =>
        pubsub.asyncIterator('notificationAdded'),
      (payload, variables) => {
        const filtered = payload.notificationAdded.filter(
          ({ user }) => user.id === variables.user
        );

        payload.notificationAdded = filtered[0];

        return filtered.length > 0 ? true : false;
      }
    )
  }
};

module.exports = Subscription;
