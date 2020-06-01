import React, { useContext, useEffect } from "react";
import Context from "../../context";
import { useChatMessages } from "../../hooks";
import MessageItem from "../../components/MessageItem";
import { Comment } from "semantic-ui-react";

const MessageContainer = () => {
  const { state } = useContext(Context);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);

  const { messages } = useChatMessages();
  return (
    <div style={{ height: "580px", overflowY: "scroll" }}>
      <Comment.Group>
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <MessageItem key={message.created_at} message={message} />
          ))
        ) : (
          <p>You have no messages with {state.selectedUser.name}</p>
        )}
      </Comment.Group>
    </div>
  );
};

export default MessageContainer;
