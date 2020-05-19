const { ApolloServer } = require("apollo-server");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

mongoose
  .connect(process.env.MONGO_URI_STRING, { useNewUrlParser: true })
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => console.error(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return connection.context;
    }
    const token = req.headers.authorization || "";
    let currentUser;
    if (token) {
      try {
        currentUser = await jwt.verify(token, "thisisasecret");
      } catch (error) {
        console.error(error);
      }
    }
    return { currentUser };
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server is listening on ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
