import {
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../../Components/Header/Header";
import dayjs from "dayjs";
import { Reading } from "../../interfaces/ReadingInterfaces";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import PageAndControls from "../../Components/PageAndControls/PageAndControls";
import MangaChapterList from "../../Components/MangaChapterList/MangaChapterList";
import "./Reader.css";

import {
  updateReading,
  addReading,
  getReadingByUserId,
} from "../../api/Reading";

import { fetchChapterData, fetchMangaFeed } from "../../api/MangaDexApi";

import { Account } from "../../interfaces/AccountInterfaces";
import {
  MangaChapter,
  MangaFeedScanlationGroup,
} from "../../interfaces/MangaDexInterfaces";

const pageBaseUrl = "https://uploads.mangadex.org/data/";

const Reader = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [pages, setPages] = useState<string[]>([]);
  const [hash, setHash] = useState<string>("");
  const [chapters, setChapters] = useState<MangaFeedScanlationGroup[]>([]);
  const [selectedLanguage] = useState("en");
  const [open, setOpen] = useState(false);
  const [order] = useState("asc");

  const handleOpenChapters = () => {
    setOpen(!open);
  };

  function handleClickTitle() {
    navigate(-1);
  }
  useEffect(() => {
    fetchChapterData(state.chapterId).then((data: MangaChapter) => {
      setPages(data.chapter.data);
      setHash(data.chapter.hash);
    });
    const date = dayjs();

    const account = window.localStorage.getItem("account") as string | null;
    let accountData: Account | null = null;
    if (account !== null) {
      accountData = JSON.parse(account);
    }
    let readingExists = false;
    if (accountData !== null) {
      getReadingByUserId(accountData.id).then((data: Reading[]) => {
        console.log(data);
        data.forEach((reading: Reading) => {
          if (reading.mangaId === state.mangaId) {
            updateReading({
              id: reading.id,
              userId: reading.userId,
              mangaId: reading.mangaId,
              chapter: state.chapter,
              mangaName: reading.mangaName,
              timestamp: date.toISOString(),
            });
            readingExists = true;
          }
        });
        if (readingExists === false) {
          console.log(state.mangaId, state.chapterNumber);
          const account = window.localStorage.getItem("account") as
            | string
            | null;
          let accountData: Account | null = null;
          if (account !== null) {
            accountData = JSON.parse(account);
          }

          if (accountData !== null) {
            addReading({
              userId: accountData.id,
              mangaId: state.mangaId,
              chapter: state.chapterNumber,
              mangaName: state.mangaName,
              timestamp: date.toISOString(),
            }).then((data) => {
              console.log(data);
            });
          }
        }
      });
    }
    fetchMangaFeed(state.mangaId, 100, 0, order, selectedLanguage).then(
      (data: MangaFeedScanlationGroup[]) => {
        setChapters(data);
      },
    );
  }, [state, order, selectedLanguage]);

  return (
    <div className="reader-page">
      <div className="header">
        <Header />
      </div>
      <div className="current-manga-details">
        <Button
          sx={{ textTransform: "none" }}
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
        <List className="reader-feed">
          <ListItemButton
            className="reader-feed-button"
            onClick={() => handleOpenChapters()}
          >
            <ListItemText
              primary={
                <Typography
                  className="reader-page-text"
                  sx={{ width: "100%" }}
                  noWrap
                >
                  {"Volume " + state.volume + " Chapter " + state.chapter}
                </Typography>
              }
            />
            {open ? (
              <ExpandLess sx={{ color: "white" }} />
            ) : (
              <ExpandMore sx={{ color: "white" }} />
            )}
          </ListItemButton>
          <Collapse className="reader-feed-collapse" in={open} timeout="auto">
            <MangaChapterList
              mangaId={state.mangaId}
              mangaFeed={chapters}
              mangaName={state.mangaName}
              selectedLanguage={selectedLanguage}
              insideReader={true}
              setOpen={setOpen}
            />
          </Collapse>
        </List>
      </div>
      {open === true ? null : (
        <PageAndControls
          chapters={chapters}
          pages={pages}
          pageBaseUrl={pageBaseUrl}
          hash={hash}
          currentChapter={state.chapter}
          mangaId={state.mangaId}
          mangaName={state.mangaName}
          scanlationGroup={state.scanlationGroup}
        />
      )}
    </div>
  );
};

export default Reader;
