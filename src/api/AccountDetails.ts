import axios from "axios";
import { AccountDetails } from "../interfaces/AccountDetailsInterfaces";
const BASE_URL = "http://localhost:8080";

async function fetchAccountDetails(id: number): Promise<AccountDetails> {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/account-details/${id}`,
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function createAccountDetails(
  accountDetails: AccountDetails,
): Promise<AccountDetails> {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/account-details/new`,
      accountDetails,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function updateAccountDetails(
  accountDetails: AccountDetails,
): Promise<AccountDetails> {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/account-details/${accountDetails.id}`,
      accountDetails,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

export { fetchAccountDetails, createAccountDetails, updateAccountDetails };
