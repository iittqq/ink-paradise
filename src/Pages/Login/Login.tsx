import { Button, Card, Typography } from "@mui/material";

import "./Login.css";
import { useState } from "react";
import { createAccount, login } from "../../api/Account";
import { useNavigate } from "react-router-dom";
import { Account } from "../../interfaces/AccountInterfaces";
import { createAccountDetails } from "../../api/AccountDetails";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PasswordResults } from "../../interfaces/PasswordStrengthInterface";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
const Login = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [attemptedLogin, setAttemptedLogin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [passwordResults, setPasswordResults] = useState<PasswordResults>({
    length: 0,
    lowercase: 0,
    uppercase: 0,
    numbers: 0,
    special: 0,
    matches: 0,
  });
  const [togglePasswordVisibility, setTogglePasswordVisibility] =
    useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    testPasswordStrength(event.target.value, confirmPassword);
    setPasswordError(false);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(event.target.value);
    testPasswordStrength(password, event.target.value);
  };

  const testPasswordStrength = (password: string, confirmPassword: string) => {
    let score = 0;
    const results: PasswordResults = {
      length: 0,
      lowercase: 0,
      uppercase: 0,
      numbers: 0,
      special: 0,
      matches: 0,
    };
    if (!password) return "";
    // Check password length
    if (password.length >= 8 && password.length <= 15) {
      score += 1;
      results.length = 1;
    } else {
      results.length = 0;
    }
    // Contains lowercase
    if (/[a-z]/.test(password)) {
      score += 1;
      results.lowercase = 1;
    }
    // Contains uppercase
    if (/[A-Z]/.test(password)) {
      score += 1;
      results.uppercase = 1;
    }
    // Contains numbers
    if (/\d/.test(password)) {
      score += 1;
      results.numbers = 1;
    }
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
      results.special = 1;
    }
    if (password === confirmPassword) {
      score += 1;
      results.matches = 1;
    }
    setPasswordResults(results);
    setPasswordStrength(score);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleLogin = async () => {
    if (email !== "" || password !== "") {
      login(email, password).then((response: Account | string) => {
        if (typeof response !== "string") {
          window.localStorage.setItem("accountId", JSON.stringify(response));
          setAttemptedLogin(false);
          navigate("/");
        } else {
          setEmail("");
          setPassword("");
          setAttemptedLogin(true);
        }
      });
    }
  };

  const handleRegister = async () => {
    if (
      password === confirmPassword &&
      email !== "" &&
      username !== "" &&
      password !== "" &&
      passwordStrength > 3 &&
      passwordResults.length === 1
    ) {
      createAccount({
        email: email,
        username: username,
        password: password,
        verificationCode: "",
        verified: false,
      }).then((response: Account) => {
        window.localStorage.setItem("accountId", String(response.id));
        navigate("/");

        createAccountDetails({
          accountId: response.id,
          bio: "Hello World",
          profilePicture: null,
          headerPicture: null,
          contentFilter: 1,
          readerMode: 1,
        });
      });
    } else {
      setPassword("");
      setConfirmPassword("");
      setPasswordError(true);
    }
  };
  const navigate = useNavigate();

  return (
    <div className="login-page">
      {visible === true ? (
        <Card className="login-card" elevation={5}>
          <div className="header-back-button-container">
            <Button onClick={() => setVisible(false)} className="back-button">
              <ArrowBackIcon />
            </Button>
            <Typography className="register-header">Register</Typography>
          </div>
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
                  type={togglePasswordVisibility ? "text" : "password"}
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
                  type={togglePasswordVisibility ? "text" : "password"}
                  className="register-input-fields"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
              </div>
              <div className="password-util-container">
                <Button
                  className="toggle-password-visibility-button"
                  onClick={() =>
                    setTogglePasswordVisibility(!togglePasswordVisibility)
                  }
                >
                  {togglePasswordVisibility ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </Button>
                {passwordError ? (
                  <Typography className="password-error-text">
                    Password Error: make sure passwords match and are strong and
                    8-15 characters long
                  </Typography>
                ) : null}
              </div>
            </div>
            <div className="register-section">
              <div className="password-strength-container">
                <Typography className="password-strength-text">
                  Password Strength:{" "}
                  {passwordStrength > 3
                    ? "Strong"
                    : passwordStrength > 2
                      ? "Medium"
                      : "Weak"}
                </Typography>
                <div className="password-strength-results">
                  <div className="result-group">
                    Length (8 - 15):
                    {passwordResults.length === 1 ? (
                      <CheckIcon className="results-icon" />
                    ) : (
                      <CloseIcon className="results-icon" />
                    )}
                  </div>
                  <div className="result-group">
                    Lowercase:
                    {passwordResults.lowercase === 1 ? (
                      <CheckIcon className="results-icon" />
                    ) : (
                      <CloseIcon className="results-icon" />
                    )}
                  </div>
                  <div className="result-group">
                    Uppercase:
                    {passwordResults.uppercase === 1 ? (
                      <CheckIcon className="results-icon" />
                    ) : (
                      <CloseIcon className="results-icon" />
                    )}
                  </div>
                  <div className="result-group">
                    Number:
                    {passwordResults.numbers === 1 ? (
                      <CheckIcon className="results-icon" />
                    ) : (
                      <CloseIcon className="results-icon" />
                    )}
                  </div>
                  <div className="result-group">
                    Special Character:
                    {passwordResults.special === 1 ? (
                      <CheckIcon className="results-icon" />
                    ) : (
                      <CloseIcon className="results-icon" />
                    )}
                  </div>
                  <div className="result-group">
                    Password Matches:
                    {passwordResults.matches === 1 ? (
                      <CheckIcon className="results-icon" />
                    ) : (
                      <CloseIcon className="results-icon" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="contained"
            className="register-button"
            sx={{
              opacity: !(
                password === confirmPassword &&
                email !== "" &&
                username !== "" &&
                password !== "" &&
                passwordStrength > 3 &&
                passwordResults.length === 1
              )
                ? 0.5
                : 1,
            }}
            disabled={
              !(
                password === confirmPassword &&
                email !== "" &&
                username !== "" &&
                password !== "" &&
                passwordStrength > 3 &&
                passwordResults.length === 1
              )
            }
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
          <div className="register-button-and-message-container">
            <Typography className="register-message">
              Don't have an account yet?
            </Typography>

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
          </div>
        </Card>
      )}
    </div>
  );
};

export default Login;
