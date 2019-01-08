const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isLoggedIn, hasPermission } = require('../utils');

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
  async updateEvent(parent, args, ctx, info) {
    const updates = { ...args };
    // 1. check if to user is logged in and has the permission to do that
    isLoggedIn(ctx.request.userId);
    const event = await ctx.db.query.event({ where: { id: args.id } }, info);
    let isAdmin = false;
    event.eventAdmins.forEach(eventAdmin => {
      if (eventAdmin.user.id === ctx.request.userId) {
        isAdmin = true;
      }
    });
    if (!isAdmin) throw new Error("You dont't have sufficient permissions!");

    const permissions = [];
    ctx.request.user.eventAdmins.forEach(eventAdmin => {
      if (eventAdmin.event.id === event.id) {
        permissions.push(eventAdmin.permission.name);
      }
    });
    const user = {
      permissions: permissions,
      ...ctx.user
    };
    hasPermission(user, ['ADMIN', 'EVENTUPDATE']);
    // 2. delete event id from args
    delete updates.id;
    // 3. update event
    const res = ctx.db.mutation.updateEvent(
      {
        where: {
          id: args.id
        },
        data: {
          ...updates
        }
      },
      info
    );
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
  },
  async updateEventAdmins(parent, args, ctx, info) {
    // isLoggedIn(ctx.request.userId);

    const event = await ctx.db.query.event({
      where: { id: args.eventId }
    });

    const currentUser = await ctx.db.query.user(
      {
        where: {
          // change later to ctx.request.userId
          id: 11
        }
      },
      info
    );

    // Check if the logged in user has
    // permissions to update permissions for given event
    const permissions = [];

    currentUser.eventAdmins.forEach(eventAdmin => {
      if (eventAdmin.event.id === event.id) {
        permissions.push(eventAdmin.permission.name);
      }
    });

    const userTmp = {
      permissions: permissions,
      ...ctx.user
    };

    hasPermission(userTmp, ['ADMIN', 'PERMISSIONUPDATE']);

    const user = await ctx.db.query.user(
      {
        where: {
          id: args.userId
        }
      },
      info
    );

    // User permissions for given event
    const userPerm = [];
    const permNames = [];

    const permission = await ctx.db.query.permission({
      where: {
        name: args.permission
      }
    });

    user.eventAdmins.forEach(eventAdmin => {
      if (
        eventAdmin.event.id === event.id &&
        eventAdmin.user.id === args.userId
      ) {
        userPerm.push(eventAdmin);
        permNames.push(eventAdmin.permission.name);
      }
    });

    let permId;

    userPerm.forEach(({ id, permission }) => {
      if (permission.name === args.permission) {
        permId = id;
      }
    });

    if (args.add == true) {
      const res = await ctx.db.mutation.createEventAdmin({
        data: {
          event: {
            connect: {
              id: args.eventId
            }
          },
          permission: {
            connect: {
              id: permission.id
            }
          },
          user: {
            connect: {
              id: args.userId
            }
          }
        }
      });

      return res;
    } else {
      console.log('LUL');
      const res = await ctx.db.mutation.deleteEventAdmin({
        where: {
          id: permId
        }
      });

      return res;
    }
  }
};

module.exports = Mutations;
