import axios from "axios";

const BASE_URL = "https://api.mangadex.org";

async function fetchMangaById(mangaId) {
	try {
		const response = await axios.get(`${BASE_URL}/manga/${mangaId}`);
		return response.data["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchRecentlyUpdated(limit, offset) {
	try {
		const response = await axios.get(`${BASE_URL}/manga`, {
			params: {
				limit: limit,
				offset: offset,
			},
		});
		return response.data["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchRecentlyAdded(limit, offset) {
	try {
		const response = await axios.get(`${BASE_URL}/manga`, {
			params: {
				limit: limit,
				offset: offset,
				order: { createdAt: "desc" },
			},
		});
		return response.data["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchMangaTags() {
	try {
		const response = await axios.get(`${BASE_URL}/manga/tag`);
		return response.data["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchMangaByName(title) {
	try {
		const response = await axios.get(`${BASE_URL}/manga`, {
			params: {
				title: title,
				order: { relevance: "desc" },
			},
		});
		return response.data["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchMangaCover(coverId) {
	try {
		const response = await axios.get(`${BASE_URL}/cover/${coverId}`);
		console.log(response["data"]["data"]);
		return response["data"]["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchMangaFeed(mangaId, limit, offset, order, language) {
	try {
		const response = await axios.get(`${BASE_URL}/manga/${mangaId}/feed`, {
			params: {
				limit: limit,
				offset: offset,
				order: { chapter: order },
				translatedLanguage: [language],
			},
		});
		return response["data"]["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchScantalationGroup(groupId) {
	try {
		const response = await axios.get(`${BASE_URL}/group/${groupId}`);
		return response["data"]["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		//throw error;
	}
}

async function fetchMangaByAuthor(authorName, limit, offset) {
	try {
		const response = await axios.get(`${BASE_URL}/manga`, {
			params: {
				limit: limit,
				offset: offset,
				authors: [authorName],
			},
		});
		return response["data"]["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchMangaByTag(tagId, limit, offset) {
	try {
		const response = await axios.get(`${BASE_URL}/manga`, {
			params: {
				limit: limit,
				offset: offset,
				includedTags: [tagId],
			},
		});
		return response["data"]["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchChapterData(chapterId) {
	try {
		const response = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);
		console.log(response["data"]);
		return response["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

export {
	fetchMangaById,
	fetchRecentlyUpdated,
	fetchRecentlyAdded,
	fetchMangaTags,
	fetchMangaByName,
	fetchMangaCover,
	fetchMangaFeed,
	fetchScantalationGroup,
	fetchMangaByAuthor,
	fetchMangaByTag,
	fetchChapterData,
};
