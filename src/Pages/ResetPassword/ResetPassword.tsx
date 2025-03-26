import { Card, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { PasswordResults } from "../../interfaces/PasswordStrengthInterface";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { getAccountByEmail, updateAccountDetails } from "../../api/Account";
import { Account } from "../../interfaces/AccountInterfaces";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    testPasswordStrength(e.target.value, confirmPassword);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
    testPasswordStrength(password, e.target.value);
  };

  const handlePasswordChangeButton = () => {
    getAccountByEmail(email!).then((account: Account) => {
      account.password = password;
      updateAccountDetails(account).then((newAccount: Account) => {
        if (newAccount) {
          navigate("/login");
        }
      });
    });
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

  return (
    <div className="reset-password-page">
      <Card className="reset-password-card" elevation={5}>
        <Typography className="reset-password-header">
          Password Reset
        </Typography>
        <div className="reset-password-section-container">
          <Typography className="reset-password-text-field-headers">
            Password
          </Typography>
          <input
            type={togglePasswordVisibility ? "text" : "password"}
            className="reset-password-input-fields"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="reset-password-section-container">
          <Typography
            fontFamily="Figtree"
            className="reset-password-text-field-headers"
          >
            Confirm Password
          </Typography>
          <input
            type={togglePasswordVisibility ? "text" : "password"}
            className="reset-password-input-fields"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <Button
            className="toggle-reset-password-visibility-button-login"
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
        </div>
        <div className="reset-password-strength-container">
          <Typography className="reset-password-strength-text">
            Password Strength:{" "}
            {passwordStrength > 3
              ? "Strong"
              : passwordStrength > 2
                ? "Medium"
                : "Weak"}
          </Typography>
          <div className="reset-password-strength-results">
            <div className="reset-password-result-group">
              Length (8 - 15):
              {passwordResults.length === 1 ? (
                <CheckIcon className="reset-password-results-icon" />
              ) : (
                <CloseIcon className="reset-password-results-icon" />
              )}
            </div>
            <div className="reset-password-result-group">
              Lowercase:
              {passwordResults.lowercase === 1 ? (
                <CheckIcon className="reset-password-results-icon" />
              ) : (
                <CloseIcon className="reset-password-results-icon" />
              )}
            </div>
            <div className="reset-password-result-group">
              Uppercase:
              {passwordResults.uppercase === 1 ? (
                <CheckIcon className="reset-password-results-icon" />
              ) : (
                <CloseIcon className="reset-password-results-icon" />
              )}
            </div>
            <div className="reset-password-result-group">
              Number:
              {passwordResults.numbers === 1 ? (
                <CheckIcon className="reset-password-results-icon" />
              ) : (
                <CloseIcon className="reset-password-results-icon" />
              )}
            </div>
            <div className="reset-password-result-group">
              Special Character:
              {passwordResults.special === 1 ? (
                <CheckIcon className="reset-password-results-icon" />
              ) : (
                <CloseIcon className="reset-password-results-icon" />
              )}
            </div>
            <div className="reset-password-result-group">
              Password Matches:
              {passwordResults.matches === 1 ? (
                <CheckIcon className="reset-password-results-icon" />
              ) : (
                <CloseIcon className="reset-password-results-icon" />
              )}
            </div>
          </div>
        </div>
        <div className="reset-password-button-and-message-container">
          <Button
            sx={{
              opacity: !(
                password === confirmPassword &&
                password !== "" &&
                passwordStrength > 3 &&
                passwordResults.length === 1
              )
                ? 0.5
                : 1,
            }}
            className="reset-password-button"
            disabled={
              !(
                password === confirmPassword &&
                password !== "" &&
                passwordStrength > 3 &&
                passwordResults.length === 1
              )
            }
            onClick={() => {
              handlePasswordChangeButton();
            }}
          >
            <Typography fontFamily="Figtree" textTransform="none">
              Change
            </Typography>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
