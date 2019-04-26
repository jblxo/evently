const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isLoggedIn, hasPermission, authorizeUser } = require('../utils');
const { transport } = require('../Mail');
const { assignedToCard } = require('../templates/assignedToCard');

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
    isLoggedIn(ctx.request.userId);

    const event = await ctx.db.query.event({
      where: { id: args.eventId }
    });

    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );

    console.log(currentUser);

    // Check if the logged in user has
    // permissions to update permissions for given event
    const currentUserPermissions = [];

    currentUser.eventAdmins.forEach(eventAdmin => {
      if (eventAdmin.event.id === event.id) {
        currentUserPermissions.push(eventAdmin.permission.name);
      }
    });

    const userTmp = {
      permissions: currentUserPermissions,
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
    let userPerm = [];
    const userPermNames = [];

    // Query info about new permissions
    const permissions = await ctx.db.query.permissions({
      where: {
        name_in: args.permissions
      }
    });

    user.eventAdmins.forEach(eventAdmin => {
      if (
        eventAdmin.event.id === event.id &&
        eventAdmin.user.id === args.userId
      ) {
        userPerm.push(eventAdmin);
        userPermNames.push(eventAdmin.permission.name);
      }
    });

    permissions.forEach(async permission => {
      if (!userPermNames.includes(permission.name)) {
        await ctx.db.mutation.createEventAdmin({
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
      }
      userPerm = userPerm.filter(
        eventAdmin => eventAdmin.permission.name !== permission.name
      );
    });

    userPerm.forEach(async ({ id }) => {
      await ctx.db.mutation.deleteEventAdmin({ where: { id } });
    });
  },
  async deleteEvent(parent, args, ctx, info) {
    isLoggedIn(ctx.request.userId);

    const userPermissionsForEvent = await ctx.db.query.eventAdmins(
      {
        where: {
          event: {
            id: args.id
          },
          user: {
            id: ctx.request.userId
          }
        }
      },
      `{ event { id } user { id } permission {id name} }`
    );

    const permissions = userPermissionsForEvent.map(
      ({ permission: { name } }) => name
    );

    const user = { permissions };

    hasPermission(user, ['ADMIN', 'EVENTDELETE']);

    const res = await ctx.db.mutation.deleteEvent({ where: { id: args.id } });

    return res;
  },
  async joinEvent(parent, args, ctx, info) {
    isLoggedIn(ctx.request.userId);

    const user = await ctx.db.query.user(
      { where: { id: ctx.request.userId } },
      `{ username }`
    );
    const eventUsers = await ctx.db.query.eventAdmins(
      {
        where: { permission: { name: 'USER' }, event: { id: args.id } }
      },
      `{ user { username } }`
    );

    const tmp = eventUsers.map(({ user: { username } }) => username);
    if (!tmp.includes(user.username)) {
      const res = await ctx.db.mutation.createEventAdmin({
        data: {
          event: {
            connect: {
              id: args.id
            }
          },
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          permission: {
            connect: {
              id: 6
            }
          }
        }
      });

      return res;
    }

    throw new Error('You are already part of this event!');
  },
  async createBoard(parent, args, ctx, info) {
    // check if the user is logged in
    isLoggedIn(ctx.request.userId);

    // check if the logged in user is a steward or admin
    const userEventAdmins = await ctx.db.query.eventAdmins(
      { where: { user: { id: ctx.request.userId } }, event: { id: args.id } },
      `{ permission {id name} }`
    );

    const userPermissions = userEventAdmins.map(
      ({ permission: { name } }) => name
    );
    const user = { permissions: userPermissions };
    hasPermission(user, ['ADMIN', 'STEWARD']);
    // create the board and connect it with the user and event
    const id = args.id;
    delete args.id;
    const res = await ctx.db.mutation.createBoard(
      {
        data: {
          event: {
            connect: {
              id
            }
          },
          lists: {
            create: {
              description: 'This is description.',
              order: 1,
              title: 'First List',
              cards: {
                create: {
                  description: 'Change me!',
                  order: 1,
                  title: 'Card #1',
                  user: {
                    connect: {
                      id: ctx.request.userId
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
    return res;
  },
  async addList(parent, args, ctx, info) {
    isLoggedIn(ctx.request.userId);

    const userPermissions = ctx.request.user.eventAdmins.map(
      ({ permission: { name }, event: { id } }) => {
        if (id === args.event) {
          return name;
        }
      }
    );

    const user = { permissions: userPermissions };

    hasPermission(user, ['ADMIN', 'STEWARD']);
    const boardId = args.board;
    delete args.event;
    delete args.board;
    const res = await ctx.db.mutation.createList(
      {
        data: {
          order: 1,
          board: {
            connect: { id: boardId }
          },
          cards: {
            create: {
              description: 'Card Description',
              order: 1,
              title: 'Card #1',
              user: {
                connect: { id: ctx.request.userId }
              }
            }
          },
          ...args
        }
      },
      info
    );
    return res;
  },
  async addCard(parent, args, ctx, info) {
    isLoggedIn(ctx.request.userId);

    const userPermissions = ctx.request.user.eventAdmins.map(
      ({ permission: { name }, event: { id } }) => {
        if (id === args.event) {
          return name;
        }
      }
    );

    const user = { permissions: userPermissions };

    hasPermission(user, ['ADMIN', 'STEWARD']);

    const card = await ctx.db.query.cards(
      { where: { list: { id: args.list } }, orderBy: 'order_DESC', first: 1 },
      `{ id order }`
    );

    const order = card[0] ? card[0].order + 1 : 1;

    const listId = args.list;
    const eventId = args.event;
    delete args.event;
    delete args.list;
    const res = await ctx.db.mutation.createCard(
      {
        data: {
          order: order,
          list: {
            connect: {
              id: listId
            }
          },
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    );

    const eventAdmins = await ctx.db.query.eventAdmins(
      { where: { event: { id: eventId } } },
      `{ user { id username } }`
    );

    const admins = eventAdmins.map(admin => admin.user);

    const uniqueAdmins = Array.from(new Set(admins.map(admin => admin.id))).map(
      id => {
        return {
          id: id,
          username: admins.find(a => a.id === id).username
        };
      }
    );

    uniqueAdmins.forEach(async admin => {
      await ctx.db.mutation.createCardNotificationAlert({
        data: {
          user: { connect: { id: admin.id } },
          card: { connect: { id: res.id } }
        }
      });
    });

    return res;
  },
  async updateList(parent, args, ctx, info) {
    isLoggedIn(ctx.request.userId);

    const userPermissions = ctx.request.user.eventAdmins.map(
      ({ permission: { name }, event: { id } }) => {
        if (id === args.event) {
          return name;
        }
      }
    );

    const user = { permissions: userPermissions };

    hasPermission(user, ['ADMIN', 'STEWARD']);
    const listId = args.id;
    delete args.id;
    delete args.event;
    const res = await ctx.db.mutation.updateList(
      { where: { id: listId }, data: { ...args } },
      info
    );

    return res;
  },
  async deleteList(parent, args, ctx, info) {
    isLoggedIn(ctx.request.userId);

    const userPermissions = ctx.request.user.eventAdmins.map(
      ({ permission: { name }, event: { id } }) => {
        if (id === args.event) {
          return name;
        }
      }
    );

    const user = { permissions: userPermissions };

    hasPermission(user, ['ADMIN', 'STEWARD']);
    const res = await ctx.db.mutation.deleteList(
      { where: { id: args.id } },
      info
    );
    return res;
  },
  async deleteCard(parent, args, ctx, info) {
    isLoggedIn(ctx.request.userId);

    const userPermissions = ctx.request.user.eventAdmins.map(
      ({ permission: { name }, event: { id } }) => {
        if (id === args.event) {
          return name;
        }
      }
    );

    const user = { permissions: userPermissions };

    hasPermission(user, ['ADMIN', 'STEWARD']);
    const res = await ctx.db.mutation.deleteCard(
      { where: { id: args.id } },
      info
    );

    const oldCards = await ctx.db.query.cards(
      { where: { list: { id: args.list } } },
      `{id order}`
    );

    const updatedCards = oldCards.map(card => {
      if (card.order > res.order) {
        card.order--;
      }

      return card;
    });

    updatedCards.forEach(async ({ id, order }) => {
      await ctx.db.mutation.updateCard(
        {
          data: { order: order },
          where: { id: id }
        },
        `{id order}`
      );
    });

    return res;
  },
  async reorderCards(parent, args, ctx, info) {
    isLoggedIn(ctx.request.userId);

    const listCards = await ctx.db.query.cards(
      { where: { list: { id: args.sourceList }, id_not: args.card } },
      `{id order}`
    );

    const reorderedList = listCards.map(card => {
      if (
        args.destinationList !== args.sourceList &&
        card.order >= args.sourceOrder
      ) {
        card.order--;
        return card;
      }

      if (
        card.order >= args.destinationOrder &&
        args.destinationList === args.sourceList
      ) {
        card.order++;
        return card;
      }

      return card;
    });

    reorderedList.forEach(async card => {
      await ctx.db.mutation.updateCard({
        data: { order: card.order },
        where: { id: card.id }
      });
    });

    const destinationList = await ctx.db.query.cards(
      {
        where: { list: { id: args.destinationList } }
      },
      `{id order}`
    );

    destinationList.forEach(async card => {
      if (
        card.order >= args.destinationOrder &&
        args.destinationList !== args.sourceList
      ) {
        await ctx.db.mutation.updateCard({
          data: { order: card.order + 1 },
          where: { id: card.id }
        });
      }
    });

    const updatedCard = await ctx.db.mutation.updateCard(
      {
        data: {
          order: args.destinationOrder,
          list: { connect: { id: args.destinationList } }
        },
        where: { id: args.card }
      },
      info
    );

    return updatedCard;
  },
  async updateCard(parent, args, ctx, info) {
    isLoggedIn(ctx.request.userId);

    const userPermissions = ctx.request.user.eventAdmins.map(
      ({ permission: { name }, event: { id } }) => {
        if (id === args.event) {
          return name;
        }
      }
    );

    const user = { permissions: userPermissions };

    hasPermission(user, ['ADMIN', 'STEWARD']);

    const cardId = args.id;
    delete args.id;
    delete args.event;
    const res = await ctx.db.mutation.updateCard(
      { data: { ...args }, where: { id: cardId } },
      info
    );

    return res;
  },
  async deleteBoard(parent, args, ctx, info) {
    authorizeUser(ctx.request.userId, args.event, ['ADMIN', 'STEWARD'], ctx);
    const res = await ctx.db.mutation.deleteBoard(
      { where: { id: args.id } },
      info
    );
    return res;
  },
  async updateBoard(parent, args, ctx, info) {
    authorizeUser(ctx.request.userId, args.event, ['ADMIN', 'STEWARD'], ctx);
    const boardId = args.id;
    delete args.id;
    delete args.event;
    const res = ctx.db.mutation.updateBoard(
      { data: { ...args }, where: { id: boardId } },
      info
    );

    return res;
  },
  async createExpense(parent, args, ctx, info) {
    authorizeUser(ctx.request.userId, args.event, ['ADMIN', 'STEWARD'], ctx);
    const eventId = args.event;
    delete args.event;
    const res = await ctx.db.mutation.createExpense(
      {
        data: {
          event: { connect: { id: eventId } },
          user: { connect: { id: ctx.request.userId } },
          ...args
        }
      },
      info
    );
    return res;
  },
  async deleteExpense(parent, args, ctx, info) {
    authorizeUser(ctx.request.userId, args.event, ['ADMIN', 'STEWARD'], ctx);
    const res = await ctx.db.mutation.deleteExpense(
      { where: { id: args.id } },
      info
    );
    return res;
  },
  async updateExpense(parent, args, ctx, info) {
    authorizeUser(ctx.request.userId, args.event, ['ADMIN', 'STEWARD'], ctx);
    const expenseId = args.id;
    delete args.id;
    delete args.event;
    const res = await ctx.db.mutation.updateExpense(
      {
        data: { ...args },
        where: { id: expenseId }
      },
      info
    );

    return res;
  },
  async assignUserToTask(parent, args, ctx, info) {
    authorizeUser(ctx.request.userId, args.event, ['ADMIN', 'STEWARD'], ctx);

    const userEventAdmins = await ctx.db.query.user(
      { where: { id: args.user } },
      `{ eventAdmins { user { id username email} permission { id name } event { id } } }`
    );

    const userPermissions = userEventAdmins.eventAdmins.map(
      ({ permission: { name }, event: { id } }) => {
        if (id === args.event) {
          return name;
        }
      }
    );

    const user = { permissions: userPermissions };

    hasPermission(user, ['ADMIN', 'STEWARD']);

    const res = await ctx.db.mutation.updateCard(
      {
        data: {
          assignedUser: {
            connect: {
              id: args.user
            }
          }
        },
        where: {
          id: args.card
        }
      },
      info
    );

    const userToRecieveNotification = await ctx.db.query.user(
      { where: { id: args.user } },
      `{ username email }`
    );

    const cardNotificationsAlerts = await ctx.db.query.cardNotificationAlerts(
      { where: { user: { id: args.user }, card: { id: args.card } } },
      `{ id }`
    );

    const card = await ctx.db.query.card(
      { where: { id: args.card } },
      `{ id list { id board { id event { id } } } assignedUser { id username } user { id username } }`
    );

    if (cardNotificationsAlerts.length > 0) {
      const mailRes = await transport.sendMail({
        from: 'notifications@evently.com',
        to: userToRecieveNotification.email,
        subject: 'You have been assigned to card',
        html: assignedToCard(
          `
        You have been assigned to Card! \n\n
        <a href="${process.env.FRONTEND_URL}/card?card=${card.id}&event=${
            card.list.board.event.id
          }&board=${card.list.board.id}&list=${
            card.list.id
          }">Go check it out</a>
        `
        )
      });
    }
    ctx.pubsub.publish('USER_ASSIGNED', { adminAssignedToCard: card });

    return res;
  }
};

module.exports = Mutations;
