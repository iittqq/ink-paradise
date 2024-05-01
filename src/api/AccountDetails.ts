import axios from "axios";
import { AccountDetails } from "../interfaces/AccountDetailsInterfaces";
const BASE_URL = "http://localhost:8020";

async function fetchAccountDetails(accountId: number): Promise<AccountDetails> {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/account-details/find-by-accountId/${accountId}`,
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
      `${BASE_URL}/api/v1/account-details/create-details/new`,
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
      `${BASE_URL}/api/v1/account-details/update-details/${accountDetails.id}`,
      accountDetails,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

export { fetchAccountDetails, createAccountDetails, updateAccountDetails };
