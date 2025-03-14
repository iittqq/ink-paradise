import { useEffect, useState } from "react";

import Header from "../../Components/Header/Header";
import { CircularProgress } from "@mui/material";
import "./Library.css";
import LibraryHeader from "../../Components/LibraryHeader/LibraryHeader";
import LibraryContents from "../../Components/LibraryContents/LibraryContents";
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
  const [contentFilter, setContentFilter] =
    useState<string>("Alphabetical Order");
  const [loadLibrary, setLoadLibrary] = useState<boolean>(true);
  const [checked, setChecked] = useState<boolean>(false);
  const [libraryEntriesToDelete, setLibraryEntriesToDelete] = useState<
    string[]
  >([]);

  const [accountData, setAccountData] = useState<Account | null>(null);
  const [selectAll, setSelectAll] = useState<boolean>(false);

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
            console.log(data);
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
      if (contentFilter === "Continue Reading") {
        if (ascending) {
          data = data
            .map(function (e) {
              return e;
            })
            .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
        } else {
          data = data
            .map(function (e) {
              return e;
            })
            .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
        }
      } else {
        if (ascending) {
          data = data.sort((a, b) => a.mangaName.localeCompare(b.mangaName));
        } else {
          data = data.sort(
            (a, b) => -1 * a.mangaName.localeCompare(b.mangaName),
          );
        }
      }
      console.log(data);
      const promises = data.map((mangaData: Reading) => {
        return fetchMangaById(mangaData.mangaId);
      });

      Promise.all(promises)
        .then((data) => {
          console.log(data);
          if (contentFilter === "Recently Updated") {
            if (ascending) {
              data = data
                .map(function (e) {
                  return e;
                })
                .sort((a, b) =>
                  a.attributes.updatedAt.localeCompare(b.attributes.updatedAt),
                )
                .reverse();
            } else {
              data = data
                .map(function (e) {
                  return e;
                })
                .sort((a, b) =>
                  a.attributes.updatedAt.localeCompare(b.attributes.updatedAt),
                );
            }
          }
          console.log(data);
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

  const toggleLibraryEntries = (value: boolean) => {
    setChecked(value);
    setLibraryEntriesToDelete([]);
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setLibraryEntriesToDelete([]);
    } else {
      setLibraryEntriesToDelete(library.map((manga) => manga.id));
    }
  };

  const handleLibraryEntryClick = async (manga: Manga) => {
    if (checked || selectAll) {
      if (libraryEntriesToDelete.includes(manga.id)) {
        setLibraryEntriesToDelete(
          libraryEntriesToDelete.filter((id) => id !== manga.id),
        );
      } else {
        console.log(manga);
        setLibraryEntriesToDelete([...libraryEntriesToDelete, manga.id]);
      }
      if (selectAll) {
        setSelectAll(false);
        setChecked(true);
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
    }

    setLoading(false);
  }, [loadLibrary, ascending, contentFilter]);

  return (
    <div className="library-page-container">
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
        toggleSelectAll={toggleSelectAll}
        selectAll={selectAll}
      />
      {loading === true ? (
        <div className="loading-indicator-container">
          <CircularProgress size={25} sx={{ color: "#ffffff" }} />
        </div>
      ) : (
        <LibraryContents
          header={contentFilter}
          libraryManga={library}
          handleLibraryEntryClick={handleLibraryEntryClick}
          checked={checked}
          libraryEntriesToDelete={libraryEntriesToDelete}
          selectAll={selectAll}
        />
      )}
    </div>
  );
};

export default Library;
