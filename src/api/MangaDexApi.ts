import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

import {
  Manga,
  CoverFile,
  MangaTagsInterface,
  MangaChapter,
  ScanlationGroup,
  MangaFeedScanlationGroup,
  ChapterDetails,
  MangaAggregated,
} from "../interfaces/MangaDexInterfaces";

async function fetchRecentlyUpdated(
  limit: number,
  offset: number,
  contentFilter: number,
  abortSignal?: AbortSignal,
): Promise<Manga[]> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/recently-updated`, {
      signal: abortSignal,
      params: {
        limit: limit,
        offset: offset,
        contentFilter: contentFilter,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchRecentlyAdded(
  limit: number,
  offset: number,
  contentFilter: number,
  abortSignal?: AbortSignal,
): Promise<Manga[]> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/recently-added`, {
      signal: abortSignal,
      params: {
        limit: limit,
        offset: offset,
        contentFilter: contentFilter,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchMangaTags(
  abortSignal?: AbortSignal,
): Promise<MangaTagsInterface[]> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/tags`, {
      signal: abortSignal,
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchMangaById(
  mangaId: string,
  abortSignal?: AbortSignal,
): Promise<Manga> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/manga-by-id`, {
      signal: abortSignal,
      params: {
        id: mangaId,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchMangaByTitle(
  title: string,
  limit: number,
  contentFilter: number,
  abortSignal?: AbortSignal,
): Promise<Manga[]> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/manga-by-title`, {
      signal: abortSignal,
      params: {
        limit: limit,
        title: title,
        contentFilter: contentFilter,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchMangaByTag(
  tagId: string,
  limit: number,
  offset: number,
  contentFilter: number,
  abortSignal?: AbortSignal,
): Promise<Manga[]> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/manga-by-tag`, {
      signal: abortSignal,
      params: {
        limit: limit,
        offset: offset,
        includedTags: [tagId],
        contentFilter: contentFilter,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchMangaCover(
  coverId: string,
  abortSignal?: AbortSignal,
): Promise<CoverFile> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/manga-cover`, {
      signal: abortSignal,
      params: {
        id: coverId,
      },
    });

    return response.data.data;
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
  abortSignal?: AbortSignal,
): Promise<MangaFeedScanlationGroup[]> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/manga-feed`, {
      signal: abortSignal,
      params: {
        id: mangaId,
        limit: limit,
        offset: offset,
        order: order,
        translatedLanguage: language,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchMangaAggregated(
  id: string,
  translatedLanguage: string,
  abortSignal?: AbortSignal,
): Promise<MangaAggregated> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/aggregate`, {
      signal: abortSignal,
      params: {
        id: id,
        translatedLanguage: translatedLanguage,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchScanlationGroup(
  id: string,
  abortSignal?: AbortSignal,
): Promise<ScanlationGroup> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/scanlation-group`, {
      signal: abortSignal,
      params: {
        id: id,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchMangaByAuthor(
  authorName: string,
  limit: number,
  offset: number,
  contentFilter: number,
  abortSignal?: AbortSignal,
): Promise<Manga[]> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/manga-by-author`, {
      signal: abortSignal,
      params: {
        limit: limit,
        offset: offset,
        authors: authorName,
        contentFilter: contentFilter,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchChapterData(
  chapterId: string,
  abortSignal?: AbortSignal,
): Promise<MangaChapter> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/chapter-data`, {
      signal: abortSignal,
      params: {
        id: chapterId,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchChapterDetails(
  chapterId: string,
  abortSignal?: AbortSignal,
): Promise<ChapterDetails> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/chapter-details`, {
      signal: abortSignal,
      params: {
        id: chapterId,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchSimilarManga(
  limit: number,
  offset: number,
  tags: string[],
  contentFilter: number,
  abortSignal?: AbortSignal,
): Promise<Manga[]> {
  try {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());
    tags.forEach((tag) => {
      params.append("tags", tag);
    });
    params.append("contentFilter", contentFilter.toString());
    const response = await axios.get(`${BASE_URL}/manga-dex/manga-similar`, {
      signal: abortSignal,
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchPopularManga(
  limit: number,
  contentFilter: number,
  abortSignal?: AbortSignal,
): Promise<Manga[]> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/popular-manga`, {
      signal: abortSignal,
      params: {
        limit: limit,
        contentFilter: contentFilter,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchMangaCoverBackend(
  id: string,
  fileName: string,
  abortSignal?: AbortSignal,
): Promise<Blob> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/cover-image`, {
      signal: abortSignal,
      params: {
        id: id,
        fileName: fileName,
      },
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchPageImageBackend(
  hash: string,
  page: string,
  abortSignal?: AbortSignal,
): Promise<Blob> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/page-image`, {
      signal: abortSignal,
      params: {
        hash: hash,
        page: page,
      },
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchSearch(
  mangaName: string,
  authorName: string,
  scanlationGroup: string,
  contentFilter: number,
  offset: number,
  abortSignal?: AbortSignal,
): Promise<Manga[]> {
  try {
    const response = await axios.get(`${BASE_URL}/manga-dex/manga-search`, {
      signal: abortSignal,
      params: {
        mangaName: mangaName,
        authorName: authorName,
        scanlationGroup: scanlationGroup,
        contentFilter: contentFilter,
        offset: offset,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchPopularNewManga(
  limit: number,
  offset: number,
  contentFilter: number,
  abortSignal?: AbortSignal,
): Promise<Manga[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/manga-dex/popular-new-manga`,
      {
        signal: abortSignal,
        params: {
          limit: limit,
          offset: offset,
          contentFilter: contentFilter,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchMangaListById(
  ids: string[],
  abortSignal?: AbortSignal,
): Promise<Manga[]> {
  try {
    const params = new URLSearchParams();
    ids.forEach((id) => params.append("ids[]", id));

    const response = await axios.get(`${BASE_URL}/manga-dex/manga-list-by-id`, {
      signal: abortSignal,
      params,
    });

    if (!response.data || !response.data.data) {
      throw new Error("Invalid response format");
    }

    return response.data.data;
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
  fetchChapterDetails,
  fetchSearch,
  fetchPopularNewManga,
  fetchMangaListById,
  fetchMangaAggregated,
};
