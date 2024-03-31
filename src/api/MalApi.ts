import axios from "axios";

const BASE_URL = "http://localhost:8080";
import { fetchMangaByTitle } from "./MangaDexApi";
import {
  MalAccount,
  MalFavorites,
  TopManga,
  MalUpdates,
} from "../interfaces/MalInterfaces";
import { Manga } from "../interfaces/MangaDexInterfaces";

async function fetchAccountData(username: string): Promise<MalAccount> {
  console.log(username);
  try {
    const response = await axios.get(
      `${BASE_URL}/my-anime-list/fetch-account-data`,
      { params: { username: username } },
    );
    return response.data["data"];
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function fetchTopManga(): Promise<TopManga[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/my-anime-list/fetch-top-manga`,
      {
        params: {
          limit: 10,
        },
      },
    );

    return response.data["data"];
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

async function generateLibrary(
  malFavorites: MalFavorites[] | undefined,
  malUpdates: MalUpdates[] | undefined,
): Promise<Manga[]> {
  const library: Manga[] = [];

  try {
    if (malFavorites !== undefined) {
      for (const element of malFavorites) {
        const response = await fetchMangaByTitle(element.title, 5);
        response.forEach((manga: Manga) => {
          if (manga.attributes.title.en === element.title) {
            library.push(manga);
          } else {
            manga.attributes.altTitles.forEach((altTitle: object) => {
              const splitAltTitle = Object.values(altTitle)[0].split(" ");
              const splitLibraryEntryTitle = element.title.split(" ");
              const duplicates = splitAltTitle.filter((value: string) =>
                splitLibraryEntryTitle.includes(value),
              );

              if (
                duplicates.length > splitLibraryEntryTitle.length / 2 &&
                !manga.attributes.title.en.split(" ").includes("Colored)") &&
                library.length < malFavorites.length
              ) {
                library.push(manga);
              }
            });
          }
        });
      }
    } else if (malUpdates !== undefined) {
      for (const element of malUpdates) {
        const response: Manga[] = await fetchMangaByTitle(
          element.entry.title,
          5,
        );
        response.forEach((manga: Manga) => {
          if (
            manga.attributes.title.en === element.entry.title &&
            library.find(
              (obj) => obj.attributes.title.en === manga.attributes.title.en,
            ) === undefined
          ) {
            Object.defineProperty(manga, "status", { value: element.status });
            library.push(manga);
          }
        });
      }
    }
    return library;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export { fetchAccountData, fetchTopManga, generateLibrary };
