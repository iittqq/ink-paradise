import axios from "axios";

const BASE_URL = "http://localhost:8080";

import { MangaFolderEntry } from "../interfaces/MangaFolderEntriesInterfaces";

async function getMangaFolderEntries(): Promise<MangaFolderEntry[]> {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/manga_folder_entries`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function addMangaFolderEntry(
  entry: MangaFolderEntry,
): Promise<MangaFolderEntry> {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/manga_folder_entries/new`,
      entry,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteMangaFolderEntry(id: number): Promise<MangaFolderEntry> {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/manga_folder_entries/delete/${id}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function findMangaFolderEntryById(
  id: number,
): Promise<MangaFolderEntry[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/manga_folder_entries/find_by_folder_id/${id}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteMangaFoldersByFolderId(
  id: number,
): Promise<MangaFolderEntry> {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/manga_folder_entries/delete_by_folder_id/${id}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export {
  addMangaFolderEntry,
  getMangaFolderEntries,
  deleteMangaFolderEntry,
  findMangaFolderEntryById,
  deleteMangaFoldersByFolderId,
};
