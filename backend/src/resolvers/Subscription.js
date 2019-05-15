const Subscription = {
  adminAssignedToCard: {
    subscribe: (parent, args, { pubsub }) => {
      return pubsub.asyncIterator('USER_ASSIGNED');
    }
  },
  cardCreated: {
    subscribe: (parent, args, { pubsub }) => {
      return pubsub.asyncIterator('CARD_CREATED');
    }
  },
  notificationAdded: {
    subscribe: (parent, args, { pubsub }) => {
      return pubsub.asyncIterator('notificationAdded');
    }
  }
};

module.exports = Subscription;
