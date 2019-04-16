const Subscription = {
  adminAssignedToCard: {
    subscribe: (parent, args, { pubsub }) => {
      return pubsub.asyncIterator('USER_ASSIGNED');
    }
  }
};

module.exports = Subscription;
