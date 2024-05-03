import axios from "axios";

import { MangaFolder } from "../interfaces/MangaFolderInterfaces";
const BASE_URL = "http://localhost:8080";

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
export { addMangaFolder, getMangaFolders, deleteMangaFolder };
