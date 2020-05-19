const { gql } = require("apollo-server-express");

module.exports = gql`
  type Team {
    _id: ID!
    name: String!
    adminEmail: String!
    adminPassword: String!
    users: [String]
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
  }

  type Query {
    getCurrentUser: User!
    getAllUsers: [User]!
    getChannel(selectedUser: String!): Channel
    getMessages(selectedUser: String!): [Message]!
  }

  type Token {
    token: String!
  }

  scalar Date

  type Mutation {
    createTeam(name: String!, adminEmail: String!, adminPassword: String!): Team
    createUser(name: String!, email: String!, password: String!): User
    createChannel(public: Boolean!, selectedUser: String!): Channel!
    createMessage(text: String!, user: String!): Message!
    loginUser(email: String!, password: String!): Token!
  }

  type Subscription {
    messageAdded: Message
  }

  type Message {
    _id: ID!
    text: String!
    user: User!
    channel: Channel!
    created_at: Date!
  }

  type Channel {
    _id: ID!
    public: Boolean!
    messages: [Message!]!
    users: [User!]!
    created_at: String!
  }
`;
