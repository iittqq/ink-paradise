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
import { fetchAccountData } from "../../api/Account";
import BookmarksList from "../../Components/BookmarksList/BookmarksList";
import { Bookmark } from "../../interfaces/BookmarkInterfaces";
import { getBookmarksByUserId, deleteBookmark } from "../../api/Bookmarks";
import { useLocation } from "react-router-dom";

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
  const [groupedLibrary, setGroupedLibrary] = useState<Manga[][] | null>(null);

  const [accountData, setAccountData] = useState<Account | null>(null);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const [bookmarksVisible, setBookmarksVisible] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<Manga[]>([]);
  const [bookmarksToDelete, setBookmarksToDelete] = useState<number[]>([]);
  const [groupedBookmarks, setGroupedBookmarks] = useState<Manga[][] | null>(
    null,
  );
  const { state } = useLocation();

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

    try {
      const data: Reading[] = await getReadingByUserId(userId);
      const sortedData = sortLibraryData(data, contentFilter, ascending);

      const mangaPromises = sortedData.map((entry: Reading) =>
        fetchMangaById(entry.mangaId),
      );
      const mangaData: Manga[] = await Promise.all(mangaPromises);

      const sortedMangaData = sortMangaData(
        mangaData,
        contentFilter,
        ascending,
      );
      setLibrary(sortedMangaData);
      setGroupedLibrary(
        groupLibraryData(sortedMangaData, contentFilter, ascending),
      );
    } catch (error) {
      console.error("Error fetching library data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortLibraryData = (
    data: Reading[],
    filter: string,
    ascending: boolean,
  ): Reading[] => {
    return filter === "Continue Reading"
      ? data.sort((a, b) =>
          ascending
            ? Date.parse(b.timestamp) - Date.parse(a.timestamp)
            : Date.parse(a.timestamp) - Date.parse(b.timestamp),
        )
      : data.sort((a, b) =>
          ascending
            ? a.mangaName.localeCompare(b.mangaName)
            : b.mangaName.localeCompare(a.mangaName),
        );
  };

  const sortMangaData = (
    data: Manga[],
    filter: string,
    ascending: boolean,
  ): Manga[] => {
    switch (filter) {
      case "Recently Updated":
        return data.sort((a, b) =>
          ascending
            ? b.attributes.updatedAt.localeCompare(a.attributes.updatedAt)
            : a.attributes.updatedAt.localeCompare(b.attributes.updatedAt),
        );
      case "Release Date":
        return data.sort((a, b) =>
          ascending
            ? b.attributes.year - a.attributes.year
            : a.attributes.year - b.attributes.year,
        );
      default:
        return data;
    }
  };

  const groupLibraryData = (
    data: Manga[],
    filter: string,
    ascending: boolean,
  ): Manga[][] | null => {
    let groupedData: Manga[][] | null = null;

    if (filter === "Content Rating") {
      groupedData = Object.values(
        data.reduce((acc: { [key: string]: Manga[] }, manga) => {
          const rating = manga.attributes.contentRating;
          (acc[rating] = acc[rating] || []).push(manga);
          return acc;
        }, {}),
      );
    } else if (filter === "Publication Demographic") {
      groupedData = Object.values(
        data.reduce((acc: { [key: string]: Manga[] }, manga) => {
          const demographic = manga.attributes.publicationDemographic;
          (acc[demographic] = acc[demographic] || []).push(manga);
          return acc;
        }, {}),
      );
    }

    return groupedData
      ? ascending
        ? groupedData
        : groupedData.reverse()
      : null;
  };

  const handleBookmarkClick = () => {
    setBookmarksVisible(!bookmarksVisible);
  };

  const handleAscendingChange = () => {
    setAscending(!ascending);
  };

  const handleContentFilter = (selection: string) => {
    setContentFilter(selection);
    setLibrary([]);
    setBookmarks([]);
    setGroupedLibrary(null);
    setGroupedBookmarks(null);
  };

  const toggleLibraryEntries = (value: boolean) => {
    setChecked(value);
    setLibraryEntriesToDelete([]);
    setBookmarksToDelete([]);
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setLibraryEntriesToDelete([]);
    } else {
      setLibraryEntriesToDelete(library.map((manga) => manga.id));
    }
  };

  const toggleSelectAllBookmarks = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setBookmarksToDelete([]);
    } else {
      setBookmarksToDelete(bookmarks.map((bookmark) => bookmark.bookmarkId!));
    }
  };

  const handleLibraryEntryClick = async (manga: Manga) => {
    if (checked || selectAll) {
      if (libraryEntriesToDelete.includes(manga.id)) {
        setLibraryEntriesToDelete(
          libraryEntriesToDelete.filter((id) => id !== manga.id),
        );
      } else {
        setLibraryEntriesToDelete([...libraryEntriesToDelete, manga.id]);
      }
      if (selectAll) {
        setSelectAll(false);
        setChecked(true);
      }
    }
  };

  const handleBookmarkEntryClick = async (bookmarkId: number) => {
    if (checked || selectAll) {
      if (bookmarksToDelete.includes(bookmarkId)) {
        setBookmarksToDelete(
          bookmarksToDelete.filter((id) => id !== bookmarkId),
        );
      } else {
        setBookmarksToDelete([...bookmarksToDelete, bookmarkId]);
      }
      if (selectAll) {
        setSelectAll(false);
        setChecked(true);
      }
    }
  };

  const handleDeleteLibraryEntries = async () => {
    setChecked(false);
    setSelectAll(false);
    if (accountData !== null) {
      libraryEntriesToDelete.forEach((id) => {
        deleteReadingByMangaIdAndUserId(id, accountData.id).then(() => {
          setLibraryEntriesToDelete([]);

          handleFetchingLibrary(accountData.id, ascending);
        });
      });
    }
  };

  const handleDeleteBookmarks = async () => {
    setChecked(false);
    setSelectAll(false);
    if (accountData !== null) {
      bookmarksToDelete.forEach((id) => {
        deleteBookmark(id).then(() => {
          setBookmarksToDelete([]);
          handleFetchingBookmarks(accountData.id);
        });
      });
    }
  };

  const handleFetchingBookmarks = async (userId: number) => {
    setLoading(true);

    try {
      const bookmarks: Bookmark[] = await getBookmarksByUserId(userId);

      const mangaPromises = bookmarks.map(async (bookmark) => {
        const manga = await fetchMangaById(bookmark.mangaId);
        return {
          ...manga,
          chapterNumber: bookmark.chapterNumber,
          chapterId: bookmark.chapterId,
          bookmarkId: bookmark.id,
          index: bookmark.chapterIndex,
          bookmarkPageNumber: bookmark.pageNumber,
          bookmarkContinueReading: bookmark.continueReading,
        } as Manga;
      });

      let enrichedBookmarks = await Promise.all(mangaPromises);
      enrichedBookmarks = filterAndSortBookmarks(
        enrichedBookmarks,
        contentFilter,
        ascending,
      );

      if (
        contentFilter === "Content Rating" ||
        contentFilter === "Publication Demographic"
      ) {
        setGroupedBookmarks(
          groupLibraryData(enrichedBookmarks, contentFilter, ascending),
        );
      } else {
        setBookmarks(enrichedBookmarks);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookmarks data:", error);
    }
  };

  // Helper function to filter and sort bookmarks
  const filterAndSortBookmarks = (
    data: Manga[],
    filter: string,
    ascending: boolean,
  ): Manga[] => {
    switch (filter) {
      case "Continue Reading":
        return data
          .filter((manga) => manga.bookmarkContinueReading === true)
          .sort(
            (a, b) =>
              (ascending ? 1 : -1) *
              (Date.parse(a.attributes.updatedAt) -
                Date.parse(b.attributes.updatedAt)),
          );

      case "Alphabetical Order":
        return data.sort((a, b) => {
          const titleA =
            a.attributes.title.en || Object.values(a.attributes.title)[0];
          const titleB =
            b.attributes.title.en || Object.values(b.attributes.title)[0];
          return ascending
            ? titleA.localeCompare(titleB)
            : titleB.localeCompare(titleA);
        });

      case "Recently Updated":
        return data.sort(
          (a, b) =>
            (ascending ? 1 : -1) *
            a.attributes.updatedAt.localeCompare(b.attributes.updatedAt),
        );

      case "Release Date":
        return data.sort((a, b) =>
          ascending
            ? b.attributes.year - a.attributes.year
            : a.attributes.year - b.attributes.year,
        );

      default:
        return data;
    }
  };

  useEffect(() => {
    if (state.accountId !== null) {
      fetchAccountData(state.accountId).then((data: Account | null) => {
        setAccountData(data);
        if (data !== null) {
          handleFetchingLibrary(state.accountId, ascending);
          handleFetchingBookmarks(state.accountId);
        }
      });
    }
  }, [loadLibrary, ascending, contentFilter]);

  return (
    <div className="library-page-container">
      <div>
        <Header
          accountId={state.accountId === undefined ? null : state.accountId}
          contentFilter={
            state.contentFilter === undefined ? null : state.contentFilter
          }
        />
      </div>
      <LibraryHeader
        searchFavorites={searchFavorites}
        handleAscendingChange={handleAscendingChange}
        handleContentFilter={handleContentFilter}
        checked={checked}
        toggleLibraryEntries={toggleLibraryEntries}
        handleDeleteLibraryEntries={handleDeleteLibraryEntries}
        toggleSelectAll={
          bookmarksVisible ? toggleSelectAllBookmarks : toggleSelectAll
        }
        selectAll={selectAll}
        header={bookmarksVisible ? "Bookmarks" : "Library"}
        libraryEntriesToDelete={libraryEntriesToDelete}
        bookmarksToDelete={bookmarksToDelete}
        handleBookmarkClick={handleBookmarkClick}
        handleDeleteBookmarks={handleDeleteBookmarks}
        contentFilter={contentFilter}
      />
      {loading === true ? (
        <div className="loading-indicator-container">
          <CircularProgress className="loading-icon" size={25} />
        </div>
      ) : bookmarksVisible === true ? (
        <BookmarksList
          bookmarks={bookmarks}
          bookmarksToDelete={bookmarksToDelete}
          handleBookmarkEntryClick={handleBookmarkEntryClick}
          checked={checked}
          accountId={state.accountId === undefined ? null : state.accountId}
          groupedBookmarks={groupedBookmarks}
          contentFilter={contentFilter}
        />
      ) : (
        <LibraryContents
          libraryManga={library}
          handleLibraryEntryClick={handleLibraryEntryClick}
          currentMetric={contentFilter}
          checked={checked}
          libraryEntriesToDelete={libraryEntriesToDelete}
          selectAll={selectAll}
          groupedLibraryManga={groupedLibrary}
          accountId={state.accountId === undefined ? null : state.accountId}
        />
      )}
    </div>
  );
};

export default Library;
