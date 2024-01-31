import axios from "axios";

const BASE_URL = "http://localhost:8080";

import { TopManga } from "../interfaces/MalInterfaces";

async function fetchAccountData(username: string): Promise<object[]> {
	try {
		const response = await axios.get(
			`${BASE_URL}/my-anime-list/fetch-account-data`,
			{
				params: {
					username: username,
				},
			},
		);
		return response.data["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchTopManga(): Promise<TopManga[]> {
	try {
		const response = await axios.get(
			`${BASE_URL}/my-anime-list/fetch-top-manga`,
			{
				params: {
					limit: 10,
				},
			},
		);

		return response.data["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

export { fetchAccountData, fetchTopManga };
