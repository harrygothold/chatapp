import { gql } from "apollo-boost";

export const SIGN_IN_USER = gql`
  mutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
    }
  }
`;

export const CREATE_CHANNEL = gql`
  mutation($public: Boolean!, $selectedUser: String!) {
    createChannel(public: $public, selectedUser: $selectedUser) {
      _id
      public
      created_at
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($text: String!, $user: String!) {
    createMessage(text: $text, user: $user) {
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
