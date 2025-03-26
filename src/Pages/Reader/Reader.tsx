import { Typography, Button } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PageAndControls from "../../Components/PageAndControls/PageAndControls";
import "./Reader.css";
import { Account } from "../../interfaces/AccountInterfaces";
import { updateOrCreateReading } from "../../api/Reading";
import { fetchChapterData, fetchMangaAggregated } from "../../api/MangaDexApi";
import { AccountDetails } from "../../interfaces/AccountDetailsInterfaces";
import {
  MangaAggregated,
  MangaChapter,
  MangaFeedScanlationGroup,
} from "../../interfaces/MangaDexInterfaces";
import {
  fetchAccountDetails,
  updateAccountDetails,
} from "../../api/AccountDetails";
import { updateOrCreateBookmark } from "../../api/Bookmarks";

interface ReaderProps {
  account: Account | null;
}
const Reader = ({ account }: ReaderProps) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [pages, setPages] = useState<string[]>([]);
  const [hash, setHash] = useState<string>("");
  const [selectedLanguage] = useState<string>("en");
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [readerMode, setReaderMode] = useState<string>("");
  const [readerInteger, setReaderInteger] = useState<number>(1);
  const [mangaAggregated, setMangaAggregated] = useState<MangaAggregated>();
  const [pageNumber, setPageNumber] = useState<number>(state.pageNumber);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [newReaderMode, setNewReaderMode] = useState<boolean>(false);
  const [mangaFeedState, setMangaFeedState] = useState<
    MangaFeedScanlationGroup[]
  >(state.mangaFeed);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleChangePageNumber = (newPageNumber: number) => {
    setPageNumber(newPageNumber);
  };

  function handleClickTitle() {
    navigate(`/manga/${state.mangaId}`, {});
  }

  const handleEditAccountInfo = () => {
    if (account !== null) {
      fetchAccountDetails(account.id).then((data: AccountDetails) => {
        updateAccountDetails(account.id, {
          accountId: data.accountId,
          bio: data.bio,
          profilePicture: data.profilePicture,
          headerPicture: data.headerPicture,
          contentFilter: data.contentFilter,
          readerMode: readerInteger,
          theme: data.theme,
        });
      });
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

  const handleChangeNewReaderMode = (newReaderMode: number) => {
    setReaderInteger(newReaderMode);
    setReaderMode(String(newReaderMode));
  };

  useEffect(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setBookmarks([]);
    fetchChapterData(state.chapterId, abortControllerRef.current.signal).then(
      (data: MangaChapter) => {
        setPages(data.chapter.data);
        setHash(data.chapter.hash);
      },
    );
    if (state.mangaId) {
      fetchMangaAggregated(
        state.mangaId,
        selectedLanguage,
        abortControllerRef.current.signal,
      ).then((data: MangaAggregated) => {
        setMangaAggregated(data);
        console.log(data);
      });
    }
    window.localStorage.setItem("position", window.scrollY.toString());
    const readerMode = window.localStorage.getItem("readerMode");
    setReaderMode(readerMode === null ? "1" : readerMode);
    setReaderInteger(readerMode === null ? 1 : parseInt(readerMode));

    const tempBookmarks: number[] = [];

    if (account !== null) {
      updateOrCreateReading({
        userId: account.id,
        mangaId: state.mangaId,
        chapter: state.chapterNumber,
        mangaName: state.mangaName.replace(/[^a-zA-Z]/g, " "),
        timestamp: new Date().toISOString(),
      });

      updateOrCreateBookmark({
        userId: account.id,
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
  }, [state, selectedLanguage, newReaderMode]);

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
      <div className="active-page-area">
        <div className="current-manga-details">
          <Button
            className="manga-name-button"
            onClick={() => {
              handleClickTitle();
            }}
          >
            <Typography className="reader-page-text-name" fontSize={20}>
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
          id={state.mangaId}
          pages={pages}
          hash={hash}
          currentChapter={state.chapterNumber}
          mangaId={state.mangaId}
          mangaName={state.mangaName}
          scanlationGroup={state.scanlationGroup}
          readerMode={readerInteger}
          accountId={account === null ? null : account.id}
          order={state.sortOrder}
          selectedLanguage={selectedLanguage}
          chapterIndex={Math.trunc(state.chapterNumber)}
          mangaAggregated={mangaAggregated!}
          mangaFeedState={mangaFeedState}
          setMangaFeedState={setMangaFeedState}
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
          oneshot={state.oneshot}
        />
      </div>
    </div>
  );
};

export default Reader;
