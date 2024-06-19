import axios from "axios";
import { AccountDetails } from "../interfaces/AccountDetailsInterfaces";

const BASE_URL = "http://18.191.56.64:8080";
//const BASE_URL = "http://localhost:8080";

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
  id: number,
  accountDetails: AccountDetails,
): Promise<AccountDetails> {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/account-details/update-details/${id}`,
      accountDetails,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

export { fetchAccountDetails, createAccountDetails, updateAccountDetails };
