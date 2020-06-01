import React, { useState, useContext, useEffect } from "react";
import { Input, Button, Modal, Icon, Image } from "semantic-ui-react";
import Context from "../../context";
import { useQuery, useMutation } from "@apollo/react-hooks";
import slugify from "slugify";
import { GET_CHANNEL } from "../../graphql/queries";
import { CREATE_CHANNEL, CREATE_MESSAGE } from "../../graphql/mutations";
import styled from "styled-components";
import MessageContainer from "../MessageContainer";
import { Picker, emojiIndex } from "emoji-mart";
import axios from "axios";

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
  const [emojiPicker, setEmojiPicker] = useState(false);
  const { state, dispatch } = useContext(Context);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState("");
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

  const colonToUnicode = (message) => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, (x) => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== "undefined") {
        let unicode = emoji.native;
        if (typeof unicode !== "undefined") {
          return unicode;
        }
      }
      x = ":" + x + ":";
      return x;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewImage(window.URL.createObjectURL(file));
  };

  const handleUploadFile = async () => {
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "reactreserve");
    data.append("cloud_name", "harryg-cloud");
    const response = await axios.post(
      process.env.REACT_APP_CLOUDINARY_URL,
      data
    );
    setMessage(response.data.url);
    setShowModal(false);
  };

  const handleAddEmoji = (emoji) => {
    const oldMessage = message;
    const m = `${oldMessage} ${emoji.colons}`;
    const newMessage = colonToUnicode(m);
    setMessage(newMessage);
    setEmojiPicker(false);
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
            action={
              <Button onClick={() => setShowModal(!showModal)} icon="file" />
            }
            label={
              <Button
                icon={emojiPicker ? "close" : "add"}
                content={emojiPicker ? "Close" : null}
                onClick={() => setEmojiPicker(!emojiPicker)}
              />
            }
          />
        </>
      )}
      {emojiPicker && (
        <Picker
          set="apple"
          onSelect={handleAddEmoji}
          className="emojiPicker"
          title="Pick your emoji"
          emoji="point_up"
          style={{ position: "absolute", top: "30%" }}
        />
      )}
      <Modal basic open={showModal} onClose={() => setShowModal(!showModal)}>
        <Modal.Header>Upload a File</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            type="file"
            label="Upload a File"
            name="File Upload"
            onChange={handleFileChange}
          />
          {previewImage && (
            <Image width={100} height={100} src={previewImage} />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={handleUploadFile}>
            <Icon name="save" /> Upload File
          </Button>
          <Button color="red" inverted onClick={() => setShowModal(false)}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </StyledContainer>
  );
};

export default Messages;
