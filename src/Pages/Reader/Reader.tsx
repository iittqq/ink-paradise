import { Typography, Button, SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../../Components/Header/Header";
import dayjs from "dayjs";
import { Reading } from "../../interfaces/ReadingInterfaces";
import PageAndControls from "../../Components/PageAndControls/PageAndControls";
import "./Reader.css";
import { Bookmark } from "../../interfaces/BookmarkInterfaces";

import {
  updateReading,
  addReading,
  getReadingByUserId,
} from "../../api/Reading";
import { fetchChapterData } from "../../api/MangaDexApi";
import { AccountDetails } from "../../interfaces/AccountDetailsInterfaces";
import {
  MangaChapter,
  MangaFeedScanlationGroup,
} from "../../interfaces/MangaDexInterfaces";
import {
  fetchAccountDetails,
  updateAccountDetails,
} from "../../api/AccountDetails";
import {
  addBookmark,
  getBookmarksByUserId,
  updateBookmark,
} from "../../api/Bookmarks";

const Reader = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [pages, setPages] = useState<string[]>([]);
  const [hash, setHash] = useState<string>("");
  const [selectedLanguage] = useState<string>("en");
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [readerMode, setReaderMode] = useState<string>("");
  const [readerInteger, setReaderInteger] = useState<number>(1);
  const [mangaFeedState, setMangaFeedState] = useState<
    MangaFeedScanlationGroup[]
  >(state.mangaFeed);
  const [pageNumber, setPageNumber] = useState<number>(
    state.pageNumber === null || state.pageNumber === undefined
      ? 0
      : state.pageNumber,
  );
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [newReaderMode, setNewReaderMode] = useState<boolean>(false);

  const handleChangePageNumber = (newPageNumber: number) => {
    setPageNumber(newPageNumber);
  };

  function handleClickTitle() {
    navigate(`/manga/${state.mangaId}`, {
      state: { accountId: state.accountId === null ? null : state.accountId },
    });
  }

  const handleScrollPosition = () => {
    const scrollPosition = window.localStorage.getItem("position");
    const readerMode = window.localStorage.getItem("readerMode");

    if (
      scrollPosition &&
      readerMode &&
      parseInt(readerMode) !== 3 &&
      parseInt(readerMode) !== 4
    ) {
      console.log(scrollPosition);
      window.scrollTo(0, parseInt(scrollPosition));
      window.localStorage.removeItem("position");
    } else {
      window.scrollTo(0, 0);
      console.log("no scroll position");
    }
  };

  const handleEditAccountInfo = () => {
    if (state.accountId !== null) {
      if (state.accountId !== null) {
        fetchAccountDetails(parseInt(state.accountId)).then(
          (data: AccountDetails) => {
            updateAccountDetails(parseInt(state.accountId), {
              accountId: data.accountId,
              bio: data.bio,
              profilePicture: data.profilePicture,
              headerPicture: data.headerPicture,
              contentFilter: data.contentFilter,
              readerMode: readerInteger,
              theme: data.theme,
            });
          },
        );
      }
    }
    window.localStorage.setItem("readerMode", readerInteger.toString());
    setOpenSettings(false);
    setNewReaderMode(!newReaderMode);
  };

  const handleSettingsDialogClose = () => {
    setOpenSettings(false);
  };

  const handleBookmarksChange = (pages: number[]) => {
    setBookmarks(pages);
  };

  const handleChangeNewReaderMode = (event: SelectChangeEvent) => {
    setReaderInteger(parseInt(event.target.value));
    setReaderMode(event.target.value as string);
  };

  useEffect(() => {
    setBookmarks([]);
    fetchChapterData(state.chapterId).then((data: MangaChapter) => {
      setPages(data.chapter.data);
      setHash(data.chapter.hash);
    });
    window.localStorage.setItem("position", window.scrollY.toString());
    const readerMode = window.localStorage.getItem("readerMode");
    setReaderMode(readerMode === null ? "1" : readerMode);
    setReaderInteger(readerMode === null ? 1 : parseInt(readerMode));

    const date = dayjs();
    let readingExists = false;
    let bookmarkExists = false;
    const tempBookmarks: number[] = [];
    if (state.accountId !== null) {
      getReadingByUserId(parseInt(state.accountId)).then((data: Reading[]) => {
        data.forEach((reading: Reading) => {
          if (reading.mangaId === state.mangaId) {
            updateReading({
              id: reading.id,
              userId: reading.userId,
              mangaId: reading.mangaId,
              chapter: state.chapterNumber,
              mangaName: reading.mangaName,
              timestamp: date.toISOString(),
            });
            readingExists = true;
          }
        });
        if (readingExists === false) {
          if (state.accountId !== null) {
            const simpleMangaName = state.mangaName.replace(/[^a-zA-Z]/g, " ");
            addReading({
              userId: parseInt(state.accountId),
              mangaId: state.mangaId,
              chapter: state.chapterNumber,
              mangaName: simpleMangaName,
              timestamp: date.toISOString(),
            });
          }
        }
      });

      getBookmarksByUserId(parseInt(state.accountId)).then(
        (data: Bookmark[]) => {
          data.forEach((bookmark: Bookmark) => {
            if (state.pageNumber === null || state.pageNumber === undefined) {
              if (
                bookmark.mangaId === state.mangaId &&
                bookmark.continueReading === true
              ) {
                updateBookmark({
                  id: bookmark.id,
                  userId: parseInt(state.accountId),
                  mangaId: bookmark.mangaId,
                  mangaName: bookmark.mangaName,
                  chapterNumber: parseFloat(state.chapterNumber),
                  chapterId: state.chapterId,
                  chapterIndex: Math.trunc(state.chapterNumber),
                  continueReading: true,
                });
                bookmarkExists = true;
              }
            }
            if (
              bookmark.mangaId === state.mangaId &&
              bookmark.continueReading === false &&
              state.chapterId === bookmark.chapterId
            ) {
              bookmarkExists = true;
              const readerMode = window.localStorage.getItem("readerMode");
              if (readerMode && parseInt(readerMode) === 3) {
                tempBookmarks.push(bookmark.chapterNumber!);
              } else {
                tempBookmarks.push(bookmark.pageNumber!);
              }
            }
          });
          handleBookmarksChange(tempBookmarks);
          if (bookmarkExists === false) {
            const simpleMangaName = state.mangaName.replace(/[^a-zA-Z]/g, " ");
            addBookmark({
              userId: parseInt(state.accountId),
              mangaId: state.mangaId,
              mangaName: simpleMangaName,
              chapterNumber: state.chapterNumber,
              chapterId: state.chapterId,
              chapterIndex: Math.trunc(state.chapterNumber),
              continueReading: true,
            });
          }
        },
      );
    }
    handleScrollPosition();
  }, [state, selectedLanguage, mangaFeedState, newReaderMode]);

  return (
    <div className="reader-page">
      <div className="header">
        <Header
          accountId={state.accountId === undefined ? null : state.accountId}
          contentFilter={
            state.contentFilter === undefined ? 3 : state.contentFilter
          }
        />
      </div>
      <div className="active-page-area">
        <div className="current-manga-details">
          <Button
            className="manga-name-button"
            onClick={() => {
              handleClickTitle();
            }}
          >
            <Typography className="reader-page-text" fontSize={20}>
              {state.mangaName}
            </Typography>
          </Button>
          <Typography className="reader-page-text">{state.title}</Typography>
          <Typography className="reader-page-text">
            {" "}
            Scanlation Group: {state.scanlationGroup}
          </Typography>
        </div>
        <PageAndControls
          pages={pages}
          hash={hash}
          currentChapter={state.chapterNumber}
          mangaId={state.mangaId}
          mangaName={state.mangaName}
          scanlationGroup={state.scanlationGroup}
          readerMode={readerInteger}
          accountId={state.accountId === undefined ? null : state.accountId}
          order={state.sortOrder}
          selectedLanguage={selectedLanguage}
          chapterIndex={Math.trunc(state.chapterNumber)}
          setMangaFeedState={setMangaFeedState}
          mangaFeedState={mangaFeedState}
          handleChangePageNumber={handleChangePageNumber}
          startPage={
            state.pageNumber === null || state.pageNumber === undefined
              ? 0
              : state.pageNumber
          }
          volume={state.volume}
          chapterNumber={state.chapterNumber}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          pageNumber={pageNumber}
          setOpenSettings={setOpenSettings}
          handleSettingsDialogClose={handleSettingsDialogClose}
          handleChangeNewReaderMode={handleChangeNewReaderMode}
          handleEditAccountInfo={handleEditAccountInfo}
          chapterId={state.chapterId}
          openSettings={openSettings}
          readerModeString={readerMode}
          coverUrl={state.coverUrl}
          contentFilter={state.contentFilter}
        />
      </div>
    </div>
  );
};

export default Reader;
