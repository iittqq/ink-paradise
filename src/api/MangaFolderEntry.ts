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

async function deleteMangaFolderEntry(
  uniqueId: number,
): Promise<MangaFolderEntry> {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/manga_folder_entries/delete/${uniqueId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function findMangaFolderEntryById(
  folderId: number,
): Promise<MangaFolderEntry[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/manga_folder_entries/find_by_folder_id/${folderId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteMangaFolderEntriesByFolderId(
  folderId: number,
): Promise<MangaFolderEntry> {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/manga_folder_entries/delete_by_folder_id/${folderId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteMangaFolderEntriesByMangaId(
  mangaId: string,
  folderId: number,
): Promise<MangaFolderEntry> {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/manga_folder_entries/delete_by_manga_id_and_folder_id/${mangaId}/${folderId}`,
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
  deleteMangaFolderEntriesByFolderId,
  deleteMangaFolderEntriesByMangaId,
};
