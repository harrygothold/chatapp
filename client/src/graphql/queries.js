import { gql } from "apollo-boost";

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      _id
      name
      email
    }
  }
`;

export const GET_ALL_USERS = gql`
  query {
    getAllUsers {
      _id
      name
      email
    }
  }
`;

export const GET_CHANNEL = gql`
  query GetChannel($selectedUser: String!) {
    getChannel(selectedUser: $selectedUser) {
      _id
      public
      messages {
        _id
        text
      }
      users {
        _id
        name
      }
      created_at
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($selectedUser: String!) {
    getMessages(selectedUser: $selectedUser) {
      _id
      text
      created_at
      channel {
        _id
      }
      user {
        _id
        name
      }
    }
  }
`;
