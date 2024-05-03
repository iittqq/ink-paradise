import axios from "axios";

const BASE_URL = "http://localhost:8080";

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
    const response = await axios.get(`${BASE_URL}/manga-dex/recently-updated`, {
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
    const response = await axios.get(`${BASE_URL}/manga-dex/recently-added`, {
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

async function fetchMangaTags(): Promise<MangaTagsInterface[]> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/tags`);

    return response.data["data"];
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchMangaById(mangaId: string): Promise<Manga> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/manga-by-id`, {
      params: {
        id: mangaId,
      },
    });
    return response.data["data"];
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchMangaByTitle(
  title: string,
  limit: number,
): Promise<Manga[]> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/manga-by-title`, {
      params: {
        limit: limit,
        title: title,
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
    const response = await axios.get(`${BASE_URL}/manga-dex/manga-by-tag`, {
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
    const response = await axios.get(`${BASE_URL}/manga-dex/manga-cover`, {
      params: {
        id: coverId,
      },
    });

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
    const response = await axios.get(`${BASE_URL}/manga-dex/manga-feed`, {
      params: {
        id: mangaId,
        limit: limit,
        offset: offset,
        order: order,
        translatedLanguage: language,
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
    const response = await axios.get(`${BASE_URL}/manga-dex/scanlation-group`, {
      params: {
        id: groupId,
      },
    });
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
    const response = await axios.get(`${BASE_URL}/manga-dex/manga-by-author`, {
      params: {
        limit: limit,
        offset: offset,
        authors: authorName,
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
    const response = await axios.get(`${BASE_URL}/manga-dex/chapter-data`, {
      params: {
        id: chapterId,
      },
    });

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
  fetchMangaByTitle,
  fetchMangaCover,
  fetchMangaFeed,
  fetchScantalationGroup,
  fetchMangaByAuthor,
  fetchMangaByTag,
  fetchChapterData,
};
