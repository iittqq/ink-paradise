import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

import { Reading } from "../interfaces/ReadingInterfaces";

async function getReading(): Promise<Reading[]> {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/reading`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getReadingByUserId(userId: number): Promise<Reading[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/reading/find_by_user_id/${userId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getReadingByMangaName(
  userId: number,
  mangaName: string,
): Promise<Reading[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/reading/find_by_user_id_and_manga_name/${userId}/${mangaName}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function addReading(reading: {
  userId: number;
  mangaId: string;
  chapter: number;
  mangaName: string;
  timestamp: string;
}): Promise<Reading> {
  console.log(reading);
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/reading/new`,
      reading,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateReading(reading: Reading): Promise<Reading> {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/reading/update/${reading.id}`,
      reading,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteReading(uniqueId: number): Promise<Reading> {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/reading/delete/${uniqueId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getReadingByUserIdAndMangaId(
  id: number,
  mangaId: string,
): Promise<Reading> {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/reading/find_by_user_id_and_manga_id/${id}/${mangaId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteReadingByMangaIdAndUserId(
  mangaId: string,
  userId: number,
): Promise<Reading> {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/reading/delete_by_manga_id_and_user_id/${mangaId}/${userId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateOrCreateReading(reading: Reading): Promise<Reading> {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/reading/update_or_create`,
      reading,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export {
  getReading,
  addReading,
  updateReading,
  deleteReading,
  getReadingByUserId,
  getReadingByMangaName,
  deleteReadingByMangaIdAndUserId,
  getReadingByUserIdAndMangaId,
  updateOrCreateReading,
};
