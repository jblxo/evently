const Mutations = {
  async createEvent(parent, args, ctx, info) {
    // TODO: Check if user is logged in
    const event = await ctx.db.mutation.createEvent(
      {
        data: {
          ...args
        }
      },
      info
    );

    return event;
  }
};

module.exports = Mutations;
