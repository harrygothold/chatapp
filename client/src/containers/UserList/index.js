import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_ALL_USERS } from "../../graphql/queries";
import styled from "styled-components";
import Context from "../../context";

const StyledUserList = styled.div`
  padding: 5px 10px;
`;

const StyledUserItem = styled.li`
  list-style: none;
  margin: 10px 0;
  cursor: pointer;
`;

const UserList = () => {
  const { dispatch, state } = useContext(Context);
  const { data, error, loading } = useQuery(GET_ALL_USERS);
  if (error) console.log(error);
  if (loading) return <p>Loading...</p>;

  const handleUserClick = (user) => {
    dispatch({ type: "MESSAGE_USER_SELECT", payload: user });
  };

  return (
    <StyledUserList>
      <h2>Users</h2>
      {data && data.getAllUsers && (
        <ul>
          {data.getAllUsers.map((user) => {
            return (
              user.name !== state.currentUser.name && (
                <StyledUserItem
                  onClick={() => handleUserClick(user)}
                  key={user._id}
                >
                  {user.name}
                </StyledUserItem>
              )
            );
          })}
        </ul>
      )}
    </StyledUserList>
  );
};

export default UserList;
