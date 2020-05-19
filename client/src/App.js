import React, { useContext, useReducer } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
// import ApolloClient from "apollo-boost";
// import { WebSocketLink } from "apollo-link-ws";
// import { InMemoryCache } from "apollo-cache-inmemory";
import LandingPage from "./containers/LandingPage";
import Login from "./containers/Auth/Login";
import Messaging from "./containers/Messaging";
import Context from "./context";
import reducer from "./reducer";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
} from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

const httpUrl = "http://localhost:4000/graphql";
const wsUrl = "ws://localhost:4000/graphql";

const httpLink = ApolloLink.from([
  new ApolloLink((operation, forward) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      operation.setContext({
        headers: {
          authorization: token,
        },
      });
    }
    return forward(operation);
  }),
  new HttpLink({ uri: httpUrl }),
]);

const wsLink = new WebSocketLink({
  uri: wsUrl,
  options: {
    lazy: true,
    reconnect: true,
  },
});

const isSubscription = (operation) => {
  const definition = getMainDefinition(operation.query);
  return (
    definition.kind === "OperationDefinition" &&
    definition.operation === "subscription"
  );
};

// const wsLink = new WebSocketLink({
//   uri: "ws://localhost:4000/graphql",
//   options: {
//     reconnect: true,
//   },
// });

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link: split(isSubscription, wsLink, httpLink),
});

// const client = new ApolloClient({
//   uri: "http://localhost:4000/graphql",
//   cache,
//   link: wsLink,
//   fetchOptions: {
//     credentials: "include",
//   },
//   request: (operation) => {
//     const token = localStorage.getItem("userToken");
//     operation.setContext({
//       headers: {
//         authorization: token,
//       },
//     });
//   },
//   onError: ({ networkError }) => {
//     if (networkError) {
//       console.error("Network Error", networkError);
//     }
//   },
// });

const App = () => {
  const initialState = useContext(Context);
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Context.Provider value={{ state, dispatch }}>
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <Route path="/login" component={Login} />
            <Route path="/messaging" component={Messaging} />
          </Switch>
        </Context.Provider>
      </ApolloProvider>
    </BrowserRouter>
  );
};

export default App;
