import { useQuery, useSubscription } from "@apollo/react-hooks";
import { GET_MESSAGES } from "../graphql/queries";
import { MESSAGE_ADDED } from "../graphql/subscriptions";
import { useContext } from "react";
import Context from "../context";

export const useChatMessages = () => {
  const { state } = useContext(Context);
  const { data, error } = useQuery(GET_MESSAGES, {
    variables: {
      selectedUser: state.selectedUser._id,
    },
  });
  if (error) console.log(error);
  const messages = data ? data.getMessages : [];
  useSubscription(MESSAGE_ADDED, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data) {
        client.writeData({
          data: {
            messages: messages.push(subscriptionData.data.messageAdded),
          },
        });
      }
    },
  });
  return { messages };
};
