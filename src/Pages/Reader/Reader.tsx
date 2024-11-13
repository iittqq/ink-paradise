import { Typography, Button, SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../../Components/Header/Header";
import PageAndControls from "../../Components/PageAndControls/PageAndControls";
import "./Reader.css";

import { updateOrCreateReading } from "../../api/Reading";
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
import { updateOrCreateBookmark } from "../../api/Bookmarks";

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
  const [pageNumber, setPageNumber] = useState<number>(state.pageNumber);
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

  const handleEditAccountInfo = () => {
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

    const tempBookmarks: number[] = [];

    if (state.accountId !== null) {
      updateOrCreateReading({
        userId: parseInt(state.accountId),
        mangaId: state.mangaId,
        chapter: state.chapterNumber,
        mangaName: state.mangaName.replace(/[^a-zA-Z]/g, " "),
        timestamp: new Date().toISOString(),
      });

      updateOrCreateBookmark({
        userId: parseInt(state.accountId),
        mangaId: state.mangaId,
        mangaName: state.mangaName.replace(/[^a-zA-Z]/g, " "),
        chapterNumber: state.chapterNumber,
        chapterId: state.chapterId,
        chapterIndex: Math.trunc(state.chapterNumber),
        continueReading: true,
      }).then(() => {
        handleBookmarksChange(tempBookmarks);
      });
    }
  }, [state, selectedLanguage, mangaFeedState, newReaderMode]);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh();
    window.addEventListener("resize", setVh);

    const scrollToBottom = () => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      });
    };

    const timeout = setTimeout(scrollToBottom, 100);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", setVh);
    };
  }, []);

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
            pageNumber === null || state.pageNumber === undefined
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
