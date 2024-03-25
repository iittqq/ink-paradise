import { useEffect, useState } from "react";

import Header from "../../Components/Header/Header";
import { MalAccount } from "../../interfaces/MalInterfaces";
import { CircularProgress } from "@mui/material";
import "./Library.css";
import LibraryHeader from "../../Components/LibraryHeader/LibraryHeader";
import LibraryContents from "../../Components/LibraryContents/LibraryContents";
import { fetchAccountData, generateLibrary } from "../../api/MalApi";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import { getReadingByUserId } from "../../api/Reading";
import { fetchMangaById } from "../../api/MangaDexApi";
import { Reading } from "../../interfaces/ReadingInterfaces";

const Library = () => {
  const [library, setLibrary] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [ascending, setAscending] = useState<boolean>(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [contentFilter, setContentFilter] = useState<string>("favorites");
  const searchFavorites = async (searchValue: string) => {
    if (searchValue !== "") {
      setFilter(searchValue);
      console.log(library);
    } else {
      setFilter(null);
    }
  };

  const handleAscendingChange = () => {
    setAscending(!ascending);
  };

  const handleContentFilter = (selection: string) => {
    setContentFilter(selection);
  };
  useEffect(() => {
    const userId = localStorage.getItem("userId") as number | null;
    if (userId !== null) {
      getReadingByUserId(userId).then((data: Reading[]) => {
        data.forEach((data: Reading) => {
          fetchMangaById(data.mangaId).then((library: Manga) => {
            setLibrary((oldLibrary) => [...oldLibrary, library]);
            setLoading(false);
          });
        });
      });
    }
    const accountName = localStorage.getItem("malAccount");
    if (accountName !== null) {
      if (filter === null) {
        fetchAccountData(accountName).then((data: MalAccount) => {
          generateLibrary(data.favorites.manga, ascending).then(
            (library: Manga[]) => {
              setLibrary((oldLibrary) => [...oldLibrary, ...library]);
            },
          );
        });
      } else {
        fetchAccountData(accountName).then((data: MalAccount) => {
          generateLibrary(data.favorites.manga, ascending).then(
            (library: Manga[]) => {
              setLibrary(
                library.filter((manga: Manga) =>
                  manga.attributes.title.en.toLowerCase().includes(filter),
                ),
              );
            },
          );
        });
      }
    }
  }, [filter, ascending]);

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
