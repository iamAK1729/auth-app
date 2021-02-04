import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import stagewoodLogo from "../../../assets/stagewood-logo.png";
import "./styles.less";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToDashboard, setDashboardRedirection] = useState(false);

  const LOGIN = gql`
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        token
      }
    }
  `;
  const [login, { data, loading, error, called }] = useMutation(LOGIN);

  if (called) {
    if (!loading) {
      if (!error) {
        localStorage.setItem("token", data.login.token);
        !redirectToDashboard && setDashboardRedirection(true);
      }
    }
  }

  return !redirectToDashboard ? (
    <Paper
      classes={{
        root: "login-container",
      }}
    >
      <div className="company-logo">
        <img src={stagewoodLogo} />
      </div>
      <div className="login-form-container">
        <h2>Login to your account</h2>
        <form
          className="login-form"
          onSubmit={() =>
            login({
              variables: {
                username,
                password,
              },
            })
          }
        >
          <div>
            <TextField
              id="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <TextField
              id="password"
              label="Password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="login-button-container">
            <Button
              classes={{ containedPrimary: "login-button" }}
              type="submit"
              variant="contained"
              color="primary"
              onClick={() =>
                login({
                  variables: {
                    username,
                    password,
                  },
                })
              }
            >
              Login
            </Button>
            <Button
              classes={{ containedPrimary: "signup-button" }}
              variant="contained"
              color="primary"
              onClick={() => props.updateSignupVisibility(true)}
            >
              Create new account
            </Button>
          </div>
        </form>
      </div>
    </Paper>
  ) : (
    <Redirect to="/dashboard" />
  );
};

export default Login;
