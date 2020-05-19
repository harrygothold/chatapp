import React, { useState, useContext, useEffect } from "react";
import { Input } from "semantic-ui-react";
import Context from "../../context";
import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import slugify from "slugify";
import { GET_CHANNEL } from "../../graphql/queries";
import { CREATE_CHANNEL, CREATE_MESSAGE } from "../../graphql/mutations";
import styled from "styled-components";
import MessageContainer from "../MessageContainer";
import { MESSAGE_ADDED } from "../../graphql/subscriptions";

const StyledContainer = styled.div`
  width: 100%;
  .input {
    position: absolute;
    bottom: 0;
    width: 80%;
    padding-bottom: 10px;
  }
`;

const Messages = ({ selectedUser }) => {
  const { state, dispatch } = useContext(Context);
  const [message, setMessage] = useState("");
  const [createChannel] = useMutation(CREATE_CHANNEL);
  const [createMessage] = useMutation(CREATE_MESSAGE);
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  const channelName1 = slugify(
    `${selectedUser.name} ${state.currentUser.name}`,
    {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: false,
    }
  );

  const channelName2 = slugify(
    `${state.currentUser.name} ${selectedUser.name}`,
    {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: false,
    }
  );

  const channelName = channelName1 || channelName2;

  const { data, loading, error } = useQuery(GET_CHANNEL, {
    variables: {
      selectedUser: selectedUser._id,
    },
  });

  const createNewChannel = async () => {
    const variables = {
      name: channelName,
      public: false,
      selectedUser: selectedUser._id,
    };
    const res = await createChannel({ variables });
    if (res.createChannel) {
      dispatch({ type: "SET_CURRENT_CHANNEL", payload: res.createChannel });
    }
  };

  useEffect(() => {
    if (data && !data.getChannel) {
      createNewChannel();
    }
  }, [data]);

  useEffect(() => {
    if (data && data.getChannel) {
      dispatch({ type: "SET_CURRENT_CHANNEL", payload: data.getChannel });
    }
  }, [data]);

  const handleCreateMessage = async () => {
    const res = await createMessage({
      variables: {
        text: message,
        user: state.currentUser._id,
      },
    });
    console.log({ res });
    setMessage("");
  };

  const handleKeyDown = async (e) => {
    if (e.keyCode === 13) {
      handleCreateMessage();
    }
  };

  return (
    <StyledContainer>
      {data && data.getChannel && (
        <>
          <p>{selectedUser.name}</p>
          <MessageContainer />
          <Input
            fluid
            type="text"
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder="Type Message Here"
          />
        </>
      )}
    </StyledContainer>
  );
};

export default Messages;
