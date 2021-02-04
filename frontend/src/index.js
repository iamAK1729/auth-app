import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { createUploadLink } from "apollo-upload-client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const SERVER_BASE_URL = "http://localhost:4000";

const uploadLink = createUploadLink({
  uri: `${SERVER_BASE_URL}/graphql`,
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
  defaultOptions,
});

import LoginOrSignUp from "./pages/LoginOrSignUp";
import Dashboard from "./pages/Dashboard";

import "./main.less";

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <Switch>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/login">
          <LoginOrSignUp />
        </Route>
        <Route path="/sign-up">
          <LoginOrSignUp />
        </Route>
        <Route path="/">
          <LoginOrSignUp />
        </Route>
      </Switch>
    </Router>
  </ApolloProvider>,
  document.getElementById("app")
);
