const Team = require("./models/Team");
const Channel = require("./models/Channel");
const Message = require("./models/Message");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PubSub } = require("apollo-server");

const pubsub = new PubSub();

const ON_SEND_MESSAGE = "ON_SEND_MESSAGE";

const generatePassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

module.exports = {
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(ON_SEND_MESSAGE),
    },
  },
  Query: {
    getCurrentUser: async (root, args, ctx) => {
      const { currentUser } = ctx;
      let user;
      if (currentUser) {
        const { userId } = currentUser;
        user = await User.findOne({ _id: userId });
      }
      return user;
    },
    getAllUsers: async (root, args, ctx) => {
      const users = await User.find({});
      return users;
    },
    getChannel: async (root, args, ctx) => {
      const { currentUser } = ctx;
      let channel;
      if (currentUser) {
        channel = await Channel.findOne({
          users: { $in: [currentUser.userId, args.selectedUser] },
        }).populate("users");
        if (!channel) {
          return null;
        }
      }
      return channel;
    },
    getMessages: async (root, args, ctx) => {
      const { currentUser } = ctx;
      let channel;
      if (currentUser) {
        channel = await Channel.findOne({
          users: { $in: [currentUser.userId, args.selectedUser] },
        });
      }
      const messages = await Message.find({
        channel: channel._id,
      })
        .populate("channel")
        .populate("user");
      if (!messages) {
        return null;
      }
      return messages;
    },
  },
  Mutation: {
    createTeam: async (root, { name, adminEmail, adminPassword }, ctx) => {
      if (!adminEmail || !adminPassword) {
        throw new Error("Email or Password is missing");
      }
      const team = await Team.findOne({ name });
      if (team) {
        throw new Error(`Team with the name ${name} already exists`);
      }
      const password = await generatePassword(adminPassword);
      const newTeam = new Team({
        name,
        adminEmail,
        adminPassword: password,
      }).save();
      return newTeam;
    },
    createUser: async (root, { name, email, password }, ctx) => {
      if (!name || !email || !password) {
        throw new Error("Name, Email or Password is missing");
      }
      const user = await User.findOne({ email });
      if (user) {
        throw new Error(`User with email ${email} exists already`);
      }
      const hashedPassword = await generatePassword(password);
      const userToDb = {
        name,
        email,
        password: hashedPassword,
      };
      const newUser = await new User(userToDb).save();
      return newUser;
    },
    loginUser: async (root, { email, password }, ctx) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User does not exist");
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Passwords do not match");
      }
      const token = jwt.sign({ userId: user._id }, "thisisasecret", {
        expiresIn: "2d",
      });
      return { token };
    },
    createChannel: async (root, args, ctx) => {
      const { currentUser } = ctx;
      const selectedUser = await User.findOne({ _id: args.selectedUser });
      let me;
      if (currentUser) {
        me = await User.findOne({ _id: currentUser.userId });
      }
      const users = [selectedUser._id, me._id];
      const newChannel = await new Channel({
        ...args,
        users,
      })
        .populate("users")
        .save();
      return newChannel;
    },
    createMessage: async (root, args, ctx) => {
      const { currentUser } = ctx;
      let newMessage;
      let channel;
      if (currentUser) {
        channel = await Channel.findOne({
          users: { $in: [currentUser.userId, args.user] },
        });
      }
      const user = await User.findOne({ _id: args.user });
      newMessage = await new Message({
        ...args,
        channel,
        user,
      })
        .populate("channel")
        .populate("channel.user")
        .populate("user")
        .save();
      pubsub.publish(ON_SEND_MESSAGE, { messageAdded: newMessage });
      return newMessage;
    },
  },
};
