import React, { useContext, useReducer } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    * { 
        margin: 0;
        padding: 0;
    }
    body {
        box-sizing: border-box;
    }
`;

const Root = () => {
  return (
    <>
      <GlobalStyles />
      <App />
    </>
  );
};

ReactDOM.render(<Root />, document.querySelector("#root"));
