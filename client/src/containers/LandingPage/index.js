import React from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

const LandingPageContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ButtonsContainer = styled.div`
  margin-top: 20px;
  button {
    margin: 15px;
    font-size: 20px;
  }
`;

const LandingPage = () => {
  const history = useHistory();
  return (
    <LandingPageContainer>
      <h1>Welcome to DevChat!</h1>
      <ButtonsContainer>
        <Button
          onClick={() => history.push("/register")}
          variant="contained"
          color="primary"
        >
          Register
        </Button>
        <Button
          onClick={() => history.push("/login")}
          variant="contained"
          color="secondary"
        >
          Sign In
        </Button>
      </ButtonsContainer>
    </LandingPageContainer>
  );
};

export default LandingPage;
