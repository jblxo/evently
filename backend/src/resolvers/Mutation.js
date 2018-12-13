const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('../utils');

const Mutations = {
  async createEvent(parent, args, ctx, info) {
    isLoggedIn(ctx.request.userId);

    const event = await ctx.db.mutation.createEvent(
      {
        data: {
          eventAdmins: {
            create: {
              user: {
                connect: {
                  id: ctx.request.userId
                }
              },
              permission: {
                connect: {
                  id: 1
                }
              }
            }
          },
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
  updateEvent(parent, args, ctx, info) {
    // 1. check if to user is logged in and has the permission to do that
  },
  async signup(parent, args, ctx, info) {
    // 1. lowercase email
    args.email = args.email.toLowerCase();
    // 2. check if the passwords match
    if (args.password !== args.confirmPassword)
      throw new Error('The passwords do not match!');

    // 3. check if the email and username are unique
    const { email, username } = args;
    const existingUser = await ctx.db.query.user({
      where: { email, username }
    });

    let errMessage = '';

    if (existingUser && existingUser.email)
      errMessage += 'The username must be unique! \n';
    if (existingUser && existingUser.username)
      errMessage += 'The username must be unique!';

    if (errMessage.length > 0) throw new Error(errMessage);

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
  },
  async signin(parent, { email, password }, ctx, info) {
    // 1. Check if there is user with given email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) throw new Error(`No user for email ${email}`);
    // 2. Check if the passwords match
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Passwords don't match!");
    // 3. Set up the JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. Set JWT on Response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },
  async updateUser(parent, args, ctx, info) {
    // 1. Check if the user is logged in
    isLoggedIn(ctx.request.userId);
    // 2. Authenticate the user
    if (ctx.request.userId !== args.id)
      throw new Error("You don't own the account!");
    // 3. Update the user
    const updates = { ...args };
    delete updates.id;
    const user = await ctx.db.mutation.updateUser(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
    return user;
  }
};

module.exports = Mutations;
