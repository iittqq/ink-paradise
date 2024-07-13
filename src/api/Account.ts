import axios from "axios";
import {
  Account,
  UsernameChange,
  PasswordChange,
} from "../interfaces/AccountInterfaces";

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

async function createAccount(account: object): Promise<Account> {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/accounts/new`,
      account,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function login(email: string, password: string): Promise<number> {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/accounts/login`, {
      email: email,
      password: password,
    });
    console.log(response.data);
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
  login,
  updateAccountUsername,
  updateAccountPassword,
  resetPassword,
  getAccountByEmail,
  updateAccountDetails,
};
