import axios from "axios";

const BASE_URL = "https://ink-paradise-api.com";
//const BASE_URL = "http://localhost:5000";

import {
  Manga,
  CoverFile,
  MangaTagsInterface,
  MangaChapter,
  ScanlationGroup,
  MangaFeedScanlationGroup,
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
): Promise<MangaFeedScanlationGroup[]> {
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

async function fetchScanlationGroup(id: string): Promise<ScanlationGroup> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/scanlation-group`, {
      params: {
        id: id,
      },
    });
    return response["data"]["data"];
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
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

async function fetchSimilarManga(
  limit: number,
  tags: string[],
): Promise<Manga[]> {
  try {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    tags.forEach((tag) => {
      params.append("tags", tag);
    });
    const response = await axios.get(`${BASE_URL}/manga-dex/manga-similar`, {
      params,
    });
    return response["data"]["data"];
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchPopularManga(limit: number): Promise<Manga[]> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/popular-manga`, {
      params: {
        limit: limit,
      },
    });
    return response["data"]["data"];
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchMangaCoverBackend(
  id: string,
  fileName: string,
): Promise<Blob> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/cover-image`, {
      params: {
        id: id,
        fileName: fileName,
      },
      responseType: "blob",
    });
    console.log(URL.createObjectURL(response.data));
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchPageImageBackend(
  hash: string,
  page: string,
): Promise<Blob> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/page-image`, {
      params: {
        hash: hash,
        page: page,
      },
      responseType: "blob",
    });
    console.log(URL.createObjectURL(response.data));
    return response.data;
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
  fetchScanlationGroup,
  fetchMangaByAuthor,
  fetchMangaByTag,
  fetchChapterData,
  fetchSimilarManga,
  fetchPopularManga,
  fetchMangaCoverBackend,
  fetchPageImageBackend,
};
