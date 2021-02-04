import React, { createRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

import stagewoodLogo from "../../../assets/stagewood-logo.png";
import "./styles.less";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Signup = (props) => {
  const [image, _setImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [erroredFields, setErroredFields] = useState({});
  const [erroredReasons, setErroredReasons] = useState([]);
  const [redirectToDashboard, setDashboardRedirection] = useState(false);

  const SIGN_UP = gql`
    mutation Signup(
      $name: String!
      $email: String!
      $password: String!
      $username: String!
      $profilePicture: Upload
    ) {
      signup(
        name: $name
        email: $email
        password: $password
        username: $username
        profilePicture: $profilePicture
      ) {
        token
      }
    }
  `;

  const [signup, { data, loading, error, called }] = useMutation(SIGN_UP);

  if (called) {
    if (!loading) {
      if (!error) {
        localStorage.setItem("token", data.signup.token);
        !redirectToDashboard && setDashboardRedirection(true);
      }
    }
  }

  const inputFileRef = createRef(null);

  const handleOnChange = (event) => {
    let newImage = null;

    if (event.target && event.target.files) {
      newImage = event.target.files[0];
    }

    if (newImage) {
      setImage(newImage);
    }
  };

  const setImage = (newImage) => {
    if (image) {
      _setImage(null);
    }
    _setImage(newImage);
  };

  const handleClick = (event) => {
    if (image) {
      event.preventDefault();
      setImage(null);
    }

    if (inputFileRef) {
      inputFileRef.current.click();
    }
  };

  const validateForm = () => {
    const erroredFields = {};
    const erroredReasons = [];
    let requiredFieldsError = false;
    let emailFormatError = false;
    let passwordsNotMatchError = false;

    // Required Fields Check
    if (!firstName) {
      erroredFields.firstName = true;
      requiredFieldsError = true;
    }

    if (!lastName) {
      erroredFields.lastName = true;
      requiredFieldsError = true;
    }

    if (!email) {
      erroredFields.email = true;
      requiredFieldsError = true;
    } else {
      emailFormatError = !emailRegex.test(String(email).toLowerCase());
    }

    if (!username) {
      erroredFields.username = true;
      requiredFieldsError = true;
    }

    if (!password) {
      erroredFields.password = true;
      requiredFieldsError = true;
    }

    if (!confirmPassword) {
      erroredFields.confirmPassword = true;
      requiredFieldsError = true;
    }

    // Password Match Check
    if (password !== confirmPassword) {
      passwordsNotMatchError = true;
    }
    if (requiredFieldsError) {
      erroredReasons.push("Required fields are missing");
    }
    if (passwordsNotMatchError) {
      erroredReasons.push("Passwords do not match");
    }
    if (emailFormatError) {
      erroredReasons.push("Email format is not supported");
    }
    setErroredFields(erroredFields);
    setErroredReasons(erroredReasons);

    if (requiredFieldsError || passwordsNotMatchError || emailFormatError) {
      return;
    } else {
      signup({
        variables: {
          name: `${firstName} ${lastName}`,
          email,
          password,
          username,
          profilePicture: image,
        },
      });
    }
  };

  return !redirectToDashboard ? (
    <Paper
      classes={{
        root: "signup-container",
      }}
    >
      {/* <div className="company-logo">
        <img src={stagewoodLogo} />
      </div> */}
      <div className="signup-form-container">
        <h2>Create an account</h2>
        <div className="signup-form">
          <div className="form-fields">
            <div>
              <TextField
                id="firstname"
                label="First Name"
                value={firstName}
                error={erroredFields.firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <TextField
                id="lastname"
                label="Last Name"
                value={lastName}
                error={erroredFields.lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <TextField
                id="email"
                label="Email"
                value={email}
                error={erroredFields.email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <TextField
                id="username"
                label="Username"
                value={username}
                error={erroredFields.username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <TextField
                id="password"
                type="password"
                label="Password"
                value={password}
                error={erroredFields.password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <TextField
                id="confirm-password"
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                error={erroredFields.confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="profile-picture-container">
            <IconButton
              classes={{ root: "upload-button" }}
              onClick={handleClick}
            >
              <Avatar
                alt="Remy Sharp"
                src={image && URL.createObjectURL(image)}
                className="profile-pic"
              ></Avatar>
              <div className="profile-pic-upload">
                <AddAPhotoIcon />
              </div>
            </IconButton>
            <input
              ref={inputFileRef}
              accept="image/*"
              type="file"
              hidden
              onChange={handleOnChange}
            />
          </div>
        </div>
        <div>
          {erroredReasons.map((reason) => (
            <div>{reason}</div>
          ))}
        </div>
        <div className="signup-button-container">
          <Button
            classes={{ containedPrimary: "signup-button" }}
            variant="contained"
            color="primary"
            onClick={validateForm}
          >
            Sign Up
          </Button>
          <Button
            classes={{ containedPrimary: "signup-button" }}
            variant="contained"
            color="primary"
            onClick={() => props.updateSignupVisibility(false)}
          >
            Already have an account?
          </Button>
        </div>
      </div>
    </Paper>
  ) : (
    <Redirect to="/dashboard" />
  );
};

export default Signup;
