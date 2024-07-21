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
      const promises = data.map((mangaData: Reading) => {
        return fetchMangaById(mangaData.mangaId);
      });

      Promise.all(promises)
        .then((data: Manga[]) => {
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
          } else if (contentFilter === "Release Date") {
            if (ascending) {
              data = data
                .map(function (e) {
                  return e;
                })
                .sort((a, b) =>
                  a.attributes.year < b.attributes.year ? 1 : -1,
                );
            } else {
              data = data
                .map(function (e) {
                  return e;
                })
                .sort((a, b) =>
                  a.attributes.year > b.attributes.year ? 1 : -1,
                );
            }
          } else if (contentFilter === "Content Rating") {
            const typedData = Object.values(
              data.reduce(
                (accumulator: { [key: string]: Manga[] }, current) => {
                  const currentContentRating = current.attributes.contentRating;
                  (accumulator[currentContentRating] =
                    accumulator[currentContentRating as keyof Manga] ||
                    []).push(current);
                  return accumulator;
                },
                {},
              ),
            );
            if (ascending) {
              setGroupedLibrary(typedData);
            } else {
              setGroupedLibrary(typedData.reverse());
            }
          } else if (contentFilter === "Publication Demographic") {
            const typedData = Object.values(
              data.reduce(
                (accumulator: { [key: string]: Manga[] }, current) => {
                  const currentContentRating =
                    current.attributes.publicationDemographic;
                  (accumulator[currentContentRating] =
                    accumulator[currentContentRating as keyof Manga] ||
                    []).push(current);
                  return accumulator;
                },
                {},
              ),
            );
            if (ascending) {
              setGroupedLibrary(typedData);
            } else {
              setGroupedLibrary(typedData.reverse());
            }
          }

          setLibrary(data);
          setLoading(false);
        })
        .catch((error) => console.log(error));
    });
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
      const promises = bookmarks.map(async (bookmark: Bookmark) => {
        return fetchMangaById(bookmark.mangaId).then((manga: Manga) => {
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
      });

      let enrichedBookmarks = await Promise.all(promises);
      if (contentFilter === "Continue Reading") {
        if (ascending) {
          enrichedBookmarks = enrichedBookmarks.filter(
            (manga: Manga) => manga.bookmarkContinueReading === true,
          );
        } else {
          enrichedBookmarks = enrichedBookmarks
            .filter((manga: Manga) => manga.bookmarkContinueReading === true)
            .reverse();
        }
      } else if (contentFilter === "Alphabetical Order") {
        if (ascending) {
          enrichedBookmarks = enrichedBookmarks
            .map(function (e) {
              return e;
            })
            .sort((a, b) =>
              a.attributes.title.en === undefined
                ? Object.values(a.attributes.title)[0].localeCompare(
                    Object.values(b.attributes.title)[0],
                  )
                : a.attributes.title.en.localeCompare(b.attributes.title.en),
            );
        } else {
          enrichedBookmarks = enrichedBookmarks
            .map(function (e) {
              return e;
            })
            .sort((a, b) =>
              a.attributes.title.en === undefined
                ? -1 *
                  Object.values(a.attributes.title)[0].localeCompare(
                    Object.values(b.attributes.title)[0],
                  )
                : -1 *
                  a.attributes.title.en.localeCompare(b.attributes.title.en),
            );
        }
      } else if (contentFilter === "Recently Updated") {
        if (ascending) {
          enrichedBookmarks = enrichedBookmarks
            .map(function (e) {
              return e;
            })
            .sort((a, b) =>
              a.attributes.updatedAt.localeCompare(b.attributes.updatedAt),
            );
        } else {
          enrichedBookmarks = enrichedBookmarks
            .map(function (e) {
              return e;
            })
            .sort(
              (a, b) =>
                -1 *
                a.attributes.updatedAt.localeCompare(b.attributes.updatedAt),
            );
        }
      } else if (contentFilter === "Release Date") {
        if (ascending) {
          enrichedBookmarks = enrichedBookmarks
            .map(function (e) {
              return e;
            })
            .sort((a, b) => (a.attributes.year < b.attributes.year ? 1 : -1));
        } else {
          enrichedBookmarks = enrichedBookmarks
            .map(function (e) {
              return e;
            })
            .sort((a, b) => (a.attributes.year > b.attributes.year ? 1 : -1));
        }
      } else if (contentFilter === "Content Rating") {
        const typedData = Object.values(
          enrichedBookmarks.reduce(
            (accumulator: { [key: string]: Manga[] }, current) => {
              const currentContentRating = current.attributes.contentRating;
              (accumulator[currentContentRating] =
                accumulator[currentContentRating as keyof Manga] || []).push(
                current,
              );
              return accumulator;
            },
            {},
          ),
        );
        if (ascending) {
          setGroupedBookmarks(typedData);
        } else {
          setGroupedBookmarks(typedData.reverse());
        }
      } else if (contentFilter === "Publication Demographic") {
        const typedData = Object.values(
          enrichedBookmarks.reduce(
            (accumulator: { [key: string]: Manga[] }, current) => {
              const currentContentRating =
                current.attributes.publicationDemographic;
              (accumulator[currentContentRating] =
                accumulator[currentContentRating as keyof Manga] || []).push(
                current,
              );
              return accumulator;
            },
            {},
          ),
        );
        if (ascending) {
          setGroupedBookmarks(typedData);
        } else {
          setGroupedBookmarks(typedData.reverse());
        }
      }

      console.log(enrichedBookmarks);
      setBookmarks(enrichedBookmarks);
      setLoading(false);
    } catch (error) {
      console.log(error);
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
