const { withFilter } = require('graphql-yoga');

const Subscription = {
  adminAssignedToCard: {
    subscribe: (payload, args, { pubsub }) => {
      return pubsub.asyncIterator('USER_ASSIGNED');
    }
  },
  cardCreated: {
    subscribe: (payload, args, { pubsub }) => {
      return pubsub.asyncIterator('CARD_CREATED');
    }
  },
  notificationAdded: {
    subscribe: withFilter(
      (payload, args, { pubsub }, info) =>
        pubsub.asyncIterator('notificationAdded'),
      (payload, variables) => {
        const filtered = payload.notificationAdded.filter(
          ({ user }) => user.id === variables.user
        );

        payload.notificationAdded = filtered;

        return filtered.length > 0 ? true : false;
      }
    )
  }
};

module.exports = Subscription;
