import axios from "axios";

import { MangaFolder } from "../interfaces/MangaFolderInterfaces";

const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

async function addMangaFolder(folder: MangaFolder): Promise<MangaFolder> {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/manga_folders/new`,
      folder,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getMangaFolders(): Promise<MangaFolder[]> {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/manga_folders`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function editMangaFolder(folder: {
  folderId: number;
  folderName: string;
  folderDescription: string;
  folderCover: string;
}): Promise<MangaFolder> {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/manga_folders/update/${folder.folderId}`,
      folder,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteMangaFolder(folderId: number): Promise<MangaFolder> {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/manga_folders/delete/${folderId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export { addMangaFolder, getMangaFolders, editMangaFolder, deleteMangaFolder };
