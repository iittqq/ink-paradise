import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

import { Bookmark } from "../interfaces/BookmarkInterfaces";

async function getBookmarks(): Promise<Bookmark[]> {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/bookmarks`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getBookmarksByUserId(userId: number): Promise<Bookmark[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/bookmarks/find_by_user_id/${userId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function addBookmark(bookmark: {
  userId: number;
  mangaId: string;
  mangaName: string;
  chapterNumber: number;
  chapterId: string;
  chapterIndex: number;
  continueReading: boolean;
  pageNumber?: number;
}): Promise<Bookmark> {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/bookmarks/new`,
      bookmark,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateBookmark(bookmark: Bookmark): Promise<Bookmark> {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/bookmarks/update/${bookmark.id}`,
      bookmark,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteBookmark(id: number): Promise<void> {
  try {
    await axios.delete(`${BASE_URL}/api/v1/bookmarks/delete/${id}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteBookmarkByMangaIdAndUserId(
  mangaId: string,
  userId: number,
): Promise<void> {
  try {
    await axios.delete(
      `${BASE_URL}/api/v1/bookmarks/delete_by_manga_id_and_user_id/${mangaId}/${userId}`,
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export {
  getBookmarks,
  getBookmarksByUserId,
  addBookmark,
  updateBookmark,
  deleteBookmark,
  deleteBookmarkByMangaIdAndUserId,
};
