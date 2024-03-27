import { useEffect, useState } from "react";

import Header from "../../Components/Header/Header";
import { MalAccount } from "../../interfaces/MalInterfaces";
import { CircularProgress } from "@mui/material";
import "./Library.css";
import LibraryHeader from "../../Components/LibraryHeader/LibraryHeader";
import LibraryContents from "../../Components/LibraryContents/LibraryContents";
import { fetchAccountData, generateLibrary } from "../../api/MalApi";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import {
  getReadingByUserId,
  addReading,
  getReadingByMangaName,
} from "../../api/Reading";
import { fetchMangaById } from "../../api/MangaDexApi";
import { Reading } from "../../interfaces/ReadingInterfaces";

const Library = () => {
  const [library, setLibrary] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [ascending, setAscending] = useState<boolean>(true);
  const [contentFilter, setContentFilter] = useState<string>("favorites");
  const [loadLibrary, setLoadLibrary] = useState<boolean>(true);

  const searchFavorites = async (searchValue: string) => {
    setLibrary([]);
    if (searchValue === "") {
      setLoadLibrary(!loadLibrary);
      return;
    }
    setLoading(true);
    const userId = localStorage.getItem("userId") as number | null;
    if (userId !== null) {
      getReadingByMangaName(userId, searchValue).then(
        (filteredReading: Reading[]) => {
          console.log(filteredReading);
          const promises = filteredReading.map((readingEntry: Reading) => {
            return fetchMangaById(readingEntry.mangaId);
          });
          Promise.all(promises).then((data) => {
            setLibrary(data);
            setLoading(false);
          });
        },
      );
    }
  };

  const handleFetchingLibrary = async (userId: number) => {
    setLoading(true);
    getReadingByUserId(userId).then((data: Reading[]) => {
      const promises = data.map((data: Reading) => {
        return fetchMangaById(data.mangaId);
      });

      Promise.all(promises)
        .then((data) => {
          setLibrary(data);
          setLoading(false);
        })
        .catch((error) => console.log(error));
    });
  };

  const handleAscendingChange = () => {
    setAscending(!ascending);
  };

  const handleContentFilter = (selection: string) => {
    setContentFilter(selection);
  };
  useEffect(() => {
    setLoading(true);
    const userId = localStorage.getItem("userId") as number | null;
    if (userId !== null) {
      const accountName = localStorage.getItem("malAccount");
      if (accountName !== null) {
        fetchAccountData(accountName).then((data: MalAccount) => {
          generateLibrary(data.favorites.manga, ascending).then(
            (library: Manga[]) => {
              library.forEach((manga: Manga) => {
                getReadingByUserId(userId).then((reading: Reading[]) => {
                  console.log(!JSON.stringify(reading).includes(manga.id));
                  if (
                    userId !== null &&
                    !JSON.stringify(reading).includes(manga.id)
                  ) {
                    addReading({
                      userId: userId,
                      mangaId: manga.id,
                      chapter: 1,
                      mangaName: manga.attributes.title.en,
                    });
                  }
                });
              });
            },
          );
        });

        handleFetchingLibrary(userId);
      }
    }
  }, [ascending, loadLibrary]);

  return (
    <div>
      <div>
        <Header />
      </div>
      <LibraryHeader
        searchFavorites={searchFavorites}
        handleAscendingChange={handleAscendingChange}
        handleContentFilter={handleContentFilter}
      />
      {loading === true ? (
        <div className="loading-indicator-container">
          <CircularProgress size={25} sx={{ color: "#ffffff" }} />
        </div>
      ) : (
        <LibraryContents libraryManga={library} />
      )}
    </div>
  );
};

export default Library;
