import React, { createContext } from "react";

const Context = createContext({
  currentUser: null,
  selectedUser: null,
  currentChannel: null,
});

export default Context;
