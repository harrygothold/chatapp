import React, { useState } from "react";
import styled from "styled-components";
import { FormGroup, Input, InputLabel, Button } from "@material-ui/core";
import { useMutation } from "@apollo/react-hooks";
import { SIGN_IN_USER } from "../../graphql/mutations";
import { useHistory } from "react-router-dom";

const LoginContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormContainer = styled.form`
  width: 50%;
  border: 1px solid;
  padding: 25px;
  h2 {
    text-align: center;
    font-family: "Courier New", Courier, monospace;
  }
  .MuiFormGroup-root {
    margin: 20px 0;
  }
`;

const Login = () => {
  const [loginUser] = useMutation(SIGN_IN_USER);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const variables = {
        email: formData.email,
        password: formData.password,
      };
      const res = await loginUser({ variables });
      if (res.data) {
        const { token } = res.data.loginUser;
        localStorage.setItem("userToken", token);
        history.push("/messaging");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const { email, password } = formData;

  return (
    <LoginContainer>
      <FormContainer onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        <FormGroup>
          <InputLabel>Email</InputLabel>
          <Input
            name="email"
            required
            onChange={handleChange}
            type="email"
            placeholder="Email Address"
            value={email}
          />
        </FormGroup>
        <FormGroup>
          <InputLabel>Password</InputLabel>
          <Input
            name="password"
            required
            onChange={handleChange}
            type="password"
            placeholder="Password"
            value={password}
          />
        </FormGroup>
        <FormGroup>
          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            color="primary"
          >
            {loading ? "Submitting" : "Submit"}
          </Button>
        </FormGroup>
      </FormContainer>
    </LoginContainer>
  );
};

export default Login;
