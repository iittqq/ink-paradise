import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4";

import { TopManga } from "../interfaces/MalInterfaces";

async function fetchAccountData(username: string): Promise<object[]> {
	try {
		const response = await axios.get(`${BASE_URL}/users/${username}/full`);
		return response.data["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchTopManga(): Promise<TopManga[]> {
	try {
		const response = await axios.get(`${BASE_URL}/top/manga`, {
			params: {
				limit: 10,
				order: { relevance: "desc" },
			},
		});

		return response.data["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

export { fetchAccountData, fetchTopManga };
