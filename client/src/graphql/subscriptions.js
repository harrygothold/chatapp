import { gql } from "apollo-boost";

export const MESSAGE_ADDED = gql`
  subscription {
    messageAdded {
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
