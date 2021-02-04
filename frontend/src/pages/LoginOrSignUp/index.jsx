import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

import Login from "./Login";
import Signup from "./Signup";

import "./styles.less";

const LoginOrSignUp = () => {
  const [showSignup, setShowSignup] = useState(false);

  const updateSignupVisibility = (show) => {
    setShowSignup(show);
  };

  const USER = gql`
    query {
      user {
        username
        email
        name
      }
    }
  `;

  const { loading, error, data } = useQuery(USER);

  if (loading) {
    return null;
  }

  if (error || !data) {
    return (
      <div className="login-page-container">
        <div className={`animation ${showSignup ? "sign-up" : "login"}`}></div>
        {showSignup ? (
          <Signup updateSignupVisibility={updateSignupVisibility} />
        ) : (
          <Login updateSignupVisibility={updateSignupVisibility} />
        )}
      </div>
    );
  }

  return <Redirect to="/dashboard" />;
};

export default LoginOrSignUp;
