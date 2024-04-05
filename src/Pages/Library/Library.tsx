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
  getReadingByMangaName,
  deleteReadingByMangaIdAndUserId,
} from "../../api/Reading";
import { fetchMangaById } from "../../api/MangaDexApi";
import { Reading } from "../../interfaces/ReadingInterfaces";
import { Account } from "../../interfaces/AccountInterfaces";

const Library = () => {
  const [library, setLibrary] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [ascending, setAscending] = useState<boolean>(true);
  const [contentFilter, setContentFilter] = useState<string>("Reading");
  const [loadLibrary, setLoadLibrary] = useState<boolean>(true);
  const [checked, setChecked] = useState<boolean>(false);
  const [libraryEntriesToDelete, setLibraryEntriesToDelete] = useState<
    string[]
  >([]);
  const [filteredUpdateEntries, setFilteredUpdateEntries] = useState<Manga[]>(
    [],
  );
  const [favoriteMangas, setFavoriteMangas] = useState<Manga[]>([]);
  const [accountData, setAccountData] = useState<Account | null>(null);

  const searchFavorites = async (searchValue: string) => {
    setLibrary([]);
    if (searchValue === "") {
      setLoadLibrary(!loadLibrary);
      return;
    }
    setLoading(true);
    if (accountData !== null) {
      getReadingByMangaName(accountData.id, searchValue).then(
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

  const handleFetchingLibrary = async (userId: number, ascending: boolean) => {
    setLoading(true);

    getReadingByUserId(userId).then((data: Reading[]) => {
      const promises = data.map((data: Reading) => {
        return fetchMangaById(data.mangaId);
      });

      Promise.all(promises)
        .then((data) => {
          if (ascending) {
            setLibrary(
              data.sort((a, b) =>
                a.attributes.title.en.localeCompare(b.attributes.title.en),
              ),
            );
          } else {
            setLibrary(
              data.sort(
                (a, b) =>
                  -1 *
                  a.attributes.title.en.localeCompare(b.attributes.title.en),
              ),
            );
          }
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

  const toggleLibraryEntries = (value: boolean) => {
    setChecked(value);
    setLibraryEntriesToDelete([]);
  };

  const handleLibraryEntryClick = async (manga: Manga) => {
    if (checked) {
      if (libraryEntriesToDelete.includes(manga.id)) {
        setLibraryEntriesToDelete(
          libraryEntriesToDelete.filter((id) => id !== manga.id),
        );
      } else {
        console.log(manga);
        setLibraryEntriesToDelete([...libraryEntriesToDelete, manga.id]);
      }
    }
  };

  const handleDeleteLibraryEntries = async () => {
    setChecked(false);
    if (accountData !== null) {
      libraryEntriesToDelete.forEach((id) => {
        deleteReadingByMangaIdAndUserId(id, accountData.id).then(() => {
          setLibraryEntriesToDelete([]);
          handleFetchingLibrary(accountData.id, ascending);
        });
      });
    }
  };

  useEffect(() => {
    const accountString = window.localStorage.getItem("account") as
      | string
      | null;
    let account: Account | null = null;
    if (accountString !== null) {
      setAccountData(JSON.parse(accountString));
      account = JSON.parse(accountString) as Account | null;
    }
    console.log(account);

    setLoading(true);
    if (account !== null) {
      handleFetchingLibrary(account.id, ascending);
      fetchAccountData(account.username).then((data: MalAccount) => {
        generateLibrary(undefined, data.updates.manga).then(
          (malLibrary: Manga[]) => {
            setFilteredUpdateEntries(
              malLibrary.filter((manga) => manga.status === contentFilter),
            );
          },
        );
        generateLibrary(data.favorites.manga, undefined).then(
          (malLibrary: Manga[]) => {
            setFavoriteMangas(malLibrary);
          },
        );
      });
    }

    setLoading(false);
  }, [loadLibrary, ascending, contentFilter]);

  return (
    <div>
      <div>
        <Header />
      </div>
      <LibraryHeader
        searchFavorites={searchFavorites}
        handleAscendingChange={handleAscendingChange}
        handleContentFilter={handleContentFilter}
        checked={checked}
        toggleLibraryEntries={toggleLibraryEntries}
        handleDeleteLibraryEntries={handleDeleteLibraryEntries}
      />
      {loading === true ? (
        <div className="loading-indicator-container">
          <CircularProgress size={25} sx={{ color: "#ffffff" }} />
        </div>
      ) : contentFilter === "Reading" ? (
        <LibraryContents
          header={contentFilter}
          libraryManga={[
            ...library,
            ...filteredUpdateEntries.filter((manga) => library.includes(manga)),
          ]}
          handleLibraryEntryClick={handleLibraryEntryClick}
          checked={checked}
          libraryEntriesToDelete={libraryEntriesToDelete}
        />
      ) : contentFilter === "Favorites" ? (
        <LibraryContents
          header={contentFilter}
          libraryManga={favoriteMangas}
          handleLibraryEntryClick={handleLibraryEntryClick}
          checked={checked}
          libraryEntriesToDelete={libraryEntriesToDelete}
        />
      ) : (
        <LibraryContents
          header={contentFilter}
          libraryManga={filteredUpdateEntries}
          handleLibraryEntryClick={handleLibraryEntryClick}
          checked={checked}
          libraryEntriesToDelete={libraryEntriesToDelete}
        />
      )}
    </div>
  );
};

export default Library;
