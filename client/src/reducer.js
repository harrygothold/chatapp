export default function reducer(state, { type, payload }) {
  switch (type) {
    case "GET_CURRENT_USER":
      return {
        ...state,
        currentUser: payload,
      };
    case "MESSAGE_USER_SELECT":
      return {
        ...state,
        selectedUser: payload,
      };
    case "SET_CURRENT_CHANNEL":
      return {
        ...state,
        currentChannel: payload,
      };
    default:
      return state;
  }
}
