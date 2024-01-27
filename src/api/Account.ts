import axios from "axios";
import { Account } from "../interfaces/AccountInterfaces";

const BASE_URL = "http://localhost:8080";

async function fetchAccountData(): Promise<object[]> {
	try {
		const response = await axios.get(`${BASE_URL}/api/v1/accounts`, {});
		console.log(response.data);
		return response.data["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function createAccount(account: object): Promise<object> {
	console.log(account);
	try {
		const response = await axios.post(
			`${BASE_URL}/api/v1/accounts/new`,
			account,
		);
		console.log(response.data);
		return response.data["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

export { fetchAccountData, createAccount };
