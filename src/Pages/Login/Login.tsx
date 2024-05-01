import { Button, Card, Typography } from "@mui/material";

import "./Login.css";
import { useState } from "react";
import { createAccount, login } from "../../api/Account";
import { useNavigate } from "react-router-dom";
import { Account } from "../../interfaces/AccountInterfaces";

const Login = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [attemptedLogin, setAttemptedLogin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleLogin = async () => {
    console.log(email, password, username);
    login(email, password).then((response: Account | string) => {
      if (typeof response !== "string") {
        window.localStorage.setItem("account", JSON.stringify(response));
        setAttemptedLogin(false);
        navigate("/");
      } else {
        console.log("Invalid login");
        setEmail("");
        setPassword("");
        setAttemptedLogin(true);
      }
    });
  };

  const handleRegister = async () => {
    console.log(username, email, password, confirmPassword);
    if (password === confirmPassword) {
      createAccount({
        email: email,
        username: username,
        password: password,
      }).then((response: Account) => {
        console.log(response);
        window.localStorage.setItem("account", JSON.stringify(response));
        navigate("/");
      });
    } else {
      setPassword("");
      setConfirmPassword("");
      console.log("Passwords do not match");
    }
  };
  const navigate = useNavigate();

  return (
    <div className="login-page">
      {visible === true ? (
        <Card className="login-card" elevation={5}>
          <Typography className="register-header">Register</Typography>
          <div className="register-section-container">
            <div className="register-section">
              <Typography className="register-text-field-headers">
                Email
              </Typography>
              <div className="register-icon-field-container">
                <input
                  type="email"
                  className="register-input-fields"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
            </div>
            <div className="register-section">
              <Typography className="register-text-field-headers">
                Username
              </Typography>
              <div className="register-icon-field-container">
                <input
                  type="username"
                  className="register-input-fields"
                  placeholder="Username"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>
            </div>
            <div className="register-section">
              <Typography className="register-text-field-headers">
                Password
              </Typography>
              <div className="register-icon-field-container">
                <input
                  type="password"
                  className="register-input-fields"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <div className="register-section">
              <Typography className="register-text-field-headers">
                Confirm Password
              </Typography>
              <div className="register-icon-field-container">
                <input
                  type="password"
                  className="register-input-fields"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
              </div>
            </div>
            {/**
            <div className="register-section">
              <Typography className="register-text-field-headers">
                Content Filter
              </Typography>

              <div className="content-filter-selection-box">
                <FormControl fullWidth>
                  <Select
                    id="content-filter-select"
                    className="content-filter-dropdown"
                    value={contentFilter}
                    label="Content Filter"
                    variant="standard"
                    disableUnderline={true}
                    onChange={handleChangeContentFilter}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: "white",
                      },
                    }}
                    MenuProps={{
                      PaperProps: { style: { backgroundColor: "#333333" } },
                    }}
                  >
                    <MenuItem className="register-menu-item" value={1}>
                      Safe
                    </MenuItem>
                    <MenuItem className="register-menu-item" value={2}>
                      Suggestive
                    </MenuItem>
                    <MenuItem className="register-menu-item" value={3}>
                      Explicit
                    </MenuItem>
                    <MenuItem className="register-menu-item" value={4}>
                      Pornographic
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>*/}
          </div>
          <Button
            variant="contained"
            className="register-button"
            onClick={() => {
              handleRegister();
            }}
          >
            Register
          </Button>
        </Card>
      ) : (
        <Card className="login-card" elevation={5}>
          <Typography className="login-header">Login</Typography>
          <div className="login-section-container">
            <Typography className="login-text-field-headers">Email</Typography>
            <input
              type="email"
              className="login-input-fields"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="login-section-container">
            <Typography
              fontFamily="Figtree"
              className="login-text-field-headers"
            >
              Password
            </Typography>
            <input
              type="password"
              className="login-input-fields"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            {attemptedLogin === true ? (
              <Typography className="incorrect-login-message">
                Invalid Credentials. Retry
              </Typography>
            ) : null}
            <Button className="forgot-password-button">
              <Typography
                textTransform="none"
                fontSize={12}
                fontFamily="Figtree"
              >
                Forgot Password?
              </Typography>
            </Button>
          </div>

          <Button
            variant="contained"
            className="login-button"
            onClick={() => {
              handleLogin();
            }}
          >
            <Typography fontFamily="Figtree" textTransform="none">
              Login
            </Typography>
          </Button>

          <Button
            className="register-button"
            onClick={() => {
              setVisible(true);
              setEmail("");
              setPassword("");
            }}
          >
            <Typography fontFamily="Figtree" textTransform="none">
              Register
            </Typography>
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Login;
