const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('../utils');

const Mutations = {
  async createEvent(parent, args, ctx, info) {
    // TODO: Check if user is logged in
    isLoggedIn(ctx.request.userId);

    const event = await ctx.db.mutation.createEvent(
      {
        data: {
          boards: {
            create: {
              title: 'Welcome',
              lists: {
                create: {
                  order: 1,
                  title: 'Lists can store many cards!',
                  cards: {
                    create: {
                      order: 1,
                      title: `Hi, I'm a card. Try changing my text!`,
                      user: {
                        connect: {
                          // TODO: make the connected user the currently logged in
                          id: ctx.request.userId
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
  },
  async signup(parent, args, ctx, info) {
    // 1. lowercase email
    args.email = args.email.toLowerCase();
    // 2. check if the passwords match
    if (args.password !== args.confirmPassword)
      throw new Error('The passwords do not match!');

    delete args.confirmPassword;
    // 3. hash the password
    const password = await bcrypt.hash(args.password, 10);
    // 4. create the user in the db
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password
        }
      },
      info
    );
    // 5. set up the JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 6. set JWT on response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return user;
  }
};

module.exports = Mutations;
