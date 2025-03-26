import axios from "axios";
import {
  Account,
  UsernameChange,
  PasswordChange,
  Tokens,
} from "../interfaces/AccountInterfaces";
import { jwtDecode } from "jwt-decode";
const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

async function fetchAccountData(id: number): Promise<Account | null> {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/accounts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    return null;
  }
}

async function createAccount(account: object): Promise<number> {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/accounts/new`,
      account,
    );
    return response.data.id;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
}

async function refreshTokenFunction(refreshToken: string): Promise<string> {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/accounts/refresh`, {
      refreshToken: refreshToken,
    });

    const { accessToken } = response.data;

    // Update the access token in local storage
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    throw error; // Throw error to be caught in getUserDetails
  }
}
const isTokenExpired = (token: string) => {
  if (!token) return true; // If there's no token, consider it expired

  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    return decodedToken.exp < currentTime; // True if token is expired
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true; // If decoding fails, consider the token expired
  }
};

async function getUserDetails(): Promise<Account | undefined> {
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (isTokenExpired(accessToken || "")) {
    if (refreshToken) {
      try {
        accessToken = await refreshTokenFunction(refreshToken);
        localStorage.setItem("accessToken", accessToken);
      } catch (error) {
        console.error("Failed to refresh access token:", error);
        return;
      }
    } else {
      console.error("No refresh token found. Please log in again.");
      return;
    }
  }

  const decodedToken = jwtDecode(accessToken || "");
  const accountId = Number(decodedToken.sub);

  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/accounts/${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
}

async function login(email: string, password: string): Promise<Tokens> {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/accounts/login`, {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function updateAccountUsername(
  accountDetails: UsernameChange,
): Promise<Account> {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/accounts/update/username`,
      accountDetails,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function updateAccountPassword(
  accountDetails: PasswordChange,
): Promise<Account> {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/accounts/update/password`,
      accountDetails,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function resetPassword(email: string): Promise<void> {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/accounts/reset/password/${email}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function getAccountByEmail(email: string): Promise<Account> {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/accounts/email/${email}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function updateAccountDetails(accountDetails: Account): Promise<Account> {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/accounts/update/${accountDetails.id}`,
      accountDetails,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

export {
  fetchAccountData,
  createAccount,
  refreshTokenFunction,
  getUserDetails,
  isTokenExpired,
  login,
  updateAccountUsername,
  updateAccountPassword,
  resetPassword,
  getAccountByEmail,
  updateAccountDetails,
};
