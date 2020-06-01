import React from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";

const MessageItem = ({ message }) => {
  const timeFromNow = (timestamp) => moment(timestamp).fromNow();
  const isImage = (message) =>
    message.text.includes("res.cloudinary") ? true : false;
  return (
    <Comment>
      <Comment.Content>
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.created_at)}</Comment.Metadata>
        {!isImage(message) ? (
          <Comment.Text>{message.text}</Comment.Text>
        ) : (
          <Image style={{ margin: "20px" }} src={message.text} />
        )}
      </Comment.Content>
    </Comment>
  );
};

export default MessageItem;
