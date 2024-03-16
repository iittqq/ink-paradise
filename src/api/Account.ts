import axios from "axios";
import { Account } from "../interfaces/AccountInterfaces";

const BASE_URL = "http://localhost:8080";

async function fetchAccountData(): Promise<Account[]> {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/accounts`);
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

export { fetchAccountData, createAccount, login };
