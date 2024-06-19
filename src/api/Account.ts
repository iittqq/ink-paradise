import axios from "axios";
import {
  Account,
  UsernameChange,
  PasswordChange,
} from "../interfaces/AccountInterfaces";

const BASE_URL = "http://18.191.56.64:8080";
//const BASE_URL = "http://localhost:8080";

async function fetchAccountData(id: number): Promise<Account> {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/accounts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
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

async function login(email: string, password: string): Promise<Account> {
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

export {
  fetchAccountData,
  createAccount,
  login,
  updateAccountUsername,
  updateAccountPassword,
};
