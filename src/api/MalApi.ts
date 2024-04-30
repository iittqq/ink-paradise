import axios from "axios";

const BASE_URL = "http://localhost:8080";
const CLIENT_ID = "72c74d46602942c61ca27bddf864efb5";
const CLIENT_SECRET =
  "69287dba56f23f70541fc43b264f6aeaeed0864fa4a0975fed5b0229843d0f3c";
import { fetchMangaByTitle } from "./MangaDexApi";
import {
  MalAccount,
  MalFavorites,
  TopManga,
  MalUpdates,
} from "../interfaces/MalInterfaces";
import { Manga } from "../interfaces/MangaDexInterfaces";

async function authorizeMal(): Promise<void> {
  try {
    console.log("Authorizing MAL...");
    const response = await axios
      .get(`${BASE_URL}/oauth/authorize`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          window.localStorage.setItem(
            "codeVerifier",
            response.data.codeVerifier,
          );
          console.log(response.data.codeVerifier);
          window.location.href = response.data.url;
        } else {
          console.error("Failed to authorize: ", response.statusText);
        }
      });
    console.log(response);
  } catch (error) {
    console.error("Error authorizing MAL:", error);
    throw error;
  }
}

async function fetchMalData(code: string): Promise<void> {
  try {
    const requestBody = new URLSearchParams();
    requestBody.append("client_id", CLIENT_ID);
    requestBody.append("client_secret", CLIENT_SECRET);
    requestBody.append("code", code);
    const codeVerifier = window.localStorage.getItem("codeVerifier");
    console.log(codeVerifier);
    if (codeVerifier !== null) {
      requestBody.append("code_verifier", codeVerifier);
    }
    requestBody.append("grant_type", "authorization_code");
    requestBody.append("redirect_uri", "http://localhost:5173/");
    console.log("Fetching MAL data...");
    const response = await axios
      .post(`https://myanimelist.net/v1/oauth2/token`, requestBody)
      .then((response) => {
        console.log(response);
      });
    console.log(response);
  } catch (error) {
    console.error("Error fetching MAL data:", error);
    throw error;
  }
}

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
        console.log(response);
        response.forEach((manga: Manga) => {
          console.log(
            manga.attributes.title.en
              .toLowerCase()
              .indexOf(element.entry.title.toLowerCase()) > -1 &&
              manga.attributes.title.en.split(" ").length ===
                element.entry.title.split(" ").length &&
              library.find(
                (obj) => obj.attributes.title.en === manga.attributes.title.en,
              ) === undefined,
          );
          if (
            manga.attributes.title.en
              .toLowerCase()
              .indexOf(element.entry.title.toLowerCase()) > -1 &&
            manga.attributes.title.en.split(" ").length ===
              element.entry.title.split(" ").length &&
            library.find(
              (obj) => obj.attributes.title.en === manga.attributes.title.en,
            ) === undefined
          ) {
            Object.defineProperty(manga, "status", {
              value: element.status.split(" ")[0],
            });
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

export {
  fetchAccountData,
  fetchTopManga,
  generateLibrary,
  authorizeMal,
  fetchMalData,
};
