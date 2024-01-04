import axios from "axios";

const BASE_URL = "https://api.mangadex.org";
const BACKEND_URL = "http://localhost:8080";

import {
	Manga,
	CoverFile,
	MangaTagsInterface,
	MangaChapter,
	MangaFeed,
} from "../interfaces/MangaDexInterfaces";

async function fetchRecentlyUpdated(
	limit: number,
	offset: number,
): Promise<Manga[]> {
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

async function fetchRecentlyAdded(
	limit: number,
	offset: number,
): Promise<Manga[]> {
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

async function fetchMangaTags(): Promise<MangaTagsInterface[]> {
	try {
		const response = await axios.get(`${BASE_URL}/manga/tag`);
		console.log(response.data["data"]);
		return response.data["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchMangaById(mangaId: string): Promise<Manga> {
	try {
		const response = await axios.get(`${BASE_URL}/manga/${mangaId}`);
		return response.data["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchMangaByTitle(title: string): Promise<Manga[]> {
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

async function fetchMangaByTag(
	tagId: string,
	limit: number,
	offset: number,
): Promise<Manga[]> {
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

async function fetchMangaCover(coverId: string): Promise<CoverFile> {
	try {
		const response = await axios.get(`${BASE_URL}/cover/${coverId}`);
		console.log(response["data"]["data"]);
		return response["data"]["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchMangaFeed(
	mangaId: string,
	limit: number,
	offset: number,
	order: string,
	language: string,
): Promise<MangaFeed[]> {
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

async function fetchScantalationGroup(
	groupId: string,
): Promise<object[] | undefined> {
	try {
		const response = await axios.get(`${BASE_URL}/group/${groupId}`);
		return response["data"]["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		//throw error;
	}
	return undefined;
}

async function fetchMangaByAuthor(
	authorName: string,
	limit: number,
	offset: number,
): Promise<Manga[]> {
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

async function fetchChapterData(chapterId: string): Promise<MangaChapter> {
	try {
		const response = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);
		console.log(response["data"]);
		return response["data"];
	} catch (error) {
		console.error("Error fetching manga:", error);
		throw error;
	}
}

async function fetchTestBackend(limit: number): Promise<object[]> {
	try {
		const response = await axios.get(
			`${BACKEND_URL}/mangaDex/recentlyUpdated`,
			{
				params: {
					limit: limit,
				},
			},
		);
		console.log(response.data["data"]);
		return response.data["data"];
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
	fetchMangaByTitle,
	fetchMangaCover,
	fetchMangaFeed,
	fetchScantalationGroup,
	fetchMangaByAuthor,
	fetchMangaByTag,
	fetchChapterData,
	fetchTestBackend,
};
