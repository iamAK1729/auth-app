import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

import "./styles.less";

const SERVER_BASE_URL = "http://localhost:4000";

const Dashboard = () => {
  const [redirectToLogin, setLoginRedirection] = useState(false);
  const logout = () => {
    localStorage.removeItem("token");
    setLoginRedirection(true);
  };

  const USER = gql`
    query {
      user {
        username
        email
        name
        profilePicture
      }
    }
  `;

  const { loading, error, data } = useQuery(USER);
  if (loading) {
    return null;
  }

  if (error || !data) {
    return <Redirect to="/login" />;
  }

  const { username, email, name, profilePicture } = data.user;

  return !redirectToLogin ? (
    <div className="dashboard-page-container">
      <Paper
        classes={{
          root: "profile-main-container",
        }}
      >
        <div className="profile-pic-container">
          <Avatar
            alt="Remy Sharp"
            src={`${SERVER_BASE_URL}/images${profilePicture}`}
            className="profile-pic"
          />
        </div>
        <div className="profile-details-container">
          <h2>Hi! {name}</h2>
          <div className="profile-field">
            <span className="profile-field-label">Name:</span> {name}
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Email:</span> {email}
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Username:</span> {username}
          </div>
        </div>
        <div className="logout">
          <Button variant="contained" color="primary" onClick={logout}>
            Logout
          </Button>
        </div>
      </Paper>
    </div>
  ) : (
    <Redirect to="/login" />
  );
};

export default Dashboard;
