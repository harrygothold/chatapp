import React, { useContext, useEffect } from "react";
import Context from "../../context";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";

const UserPanel = ({ user }) => {
  const { dispatch, state } = useContext(Context);
  const history = useHistory();
  const signOutUser = () => {
    localStorage.removeItem("userToken");
    history.push("/");
  };
  useEffect(() => {
    if (user) {
      dispatch({ type: "GET_CURRENT_USER", payload: user });
    }
  }, [user]);
  return (
    <div>
      {user && <p>{user.name}</p>}
      <Button onClick={signOutUser} variant="contained" color="primary">
        Sign Out
      </Button>
    </div>
  );
};

export default UserPanel;
