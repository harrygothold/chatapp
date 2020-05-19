import React, { useContext } from "react";
import { Menu, Grid, Input } from "semantic-ui-react";
import styled from "styled-components";
import { useQuery } from "@apollo/react-hooks";
import { GET_CURRENT_USER } from "../../graphql/queries";
import UserPanel from "../UserPanel";
import UserList from "../UserList";
import Context from "../../context";
import Messages from "../Messages";

const MessagingContainer = styled.div`
  height: 102vh;
  .menu {
    height: 100%;
    color: white;
    overflow-y: scroll;
  }
`;

const MessagesContainer = styled.div`
  padding-top: 20px;
  width: 82%;
`;

const Messaging = () => {
  const { state } = useContext(Context);
  const { data, loading, error } = useQuery(GET_CURRENT_USER);
  if (loading) return <p>Loading...</p>;
  if (error) console.log(error);
  return (
    <MessagingContainer>
      {data && data.getCurrentUser && (
        <Grid style={{ height: "102vh" }} columns="equal">
          <Menu
            size="large"
            inverted
            vertical
            style={{
              background: "#764ba2",
              padding: "20px",
              height: "100%",
              overflowY: "scroll",
              marginBottom: 0,
            }}
          >
            <UserPanel user={data.getCurrentUser} />
            <UserList />
          </Menu>
          <MessagesContainer>
            {state.selectedUser && (
              <Messages selectedUser={state.selectedUser} />
            )}
          </MessagesContainer>
        </Grid>
      )}
    </MessagingContainer>
  );
};

export default Messaging;
