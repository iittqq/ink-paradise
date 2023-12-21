import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4";

async function fetchAccountData(username) {
	try {
		const response = await axios.get(`${BASE_URL}/users/${username}/full`);
		return response.data["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchTopManga() {
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
