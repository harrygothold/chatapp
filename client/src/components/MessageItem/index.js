import React from "react";
import { Comment } from "semantic-ui-react";
import moment from "moment";

const MessageItem = ({ message }) => {
  const timeFromNow = (timestamp) => moment(timestamp).fromNow();
  return (
    <Comment>
      <Comment.Content>
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.created_at)}</Comment.Metadata>
        <Comment.Text>{message.text}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
};

export default MessageItem;
