const Mutations = {
  async createEvent(parent, args, ctx, info) {
    // TODO: Check if user is logged in
    const event = await ctx.db.mutation.createEvent(
      {
        data: {
          boards: {
            create: {
              title: 'A',
              lists: {
                create: {
                  order: 1,
                  title: 'A',
                  cards: {
                    create: {
                      order: 1,
                      title: 'A',
                      user: {
                        connect: {
                          id: 1
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          ...args
        }
      },
      info
    );

    return event;
  }
};

module.exports = Mutations;
