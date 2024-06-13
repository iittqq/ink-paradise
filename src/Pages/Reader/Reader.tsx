import {
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import { useEffect, useState } from "react";
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
  Relationship,
} from "../../interfaces/MangaDexInterfaces";

const pageBaseUrl = "https://uploads.mangadex.org/data/";

const Reader = () => {
  const { state } = useLocation();
  const [pages, setPages] = useState<string[]>([]);
  const [hash, setHash] = useState<string>("");
  const [chapters, setChapters] = useState<MangaFeedScanlationGroup[]>([]);
  const [selectedLanguage] = useState("en");
  const [open, setOpen] = useState(false);
  const [order] = useState("desc");
  const [scanlationGroups, setScanlationGroups] = useState<object[]>([]);

  const handleOpenChapters = () => {
    /** 
		chapters.forEach((current) => {
			fetchScantalationGroup(current["relationships"][0]["id"]);
		});*/
    setOpen(!open);
  };
  /** 
	const fetchScantalationGroup = async (id: string) => {
		fetch(`${baseUrl}/group/${id}`)
			.then((response) => response.json())
			.then((group) => {
				setScantalationGroups((scantalationGroups) => [
					...scantalationGroups,
					group["data"]["attributes"]["name"],
				]);
				console.log(group);
			});
	};
*/
  useEffect(() => {
    fetchChapterData(state.chapterId).then((data: MangaChapter) => {
      if (data.chapter.data.length === 0) {
        window.location.replace(state.externalUrl);
      } else {
        setPages(data.chapter.data);
        setHash(data.chapter.hash);
      }
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

        setScanlationGroups([
          ...new Set(
            data.map(
              (current: MangaFeedScanlationGroup) =>
                current.relationships.filter(
                  (rel: Relationship) => rel.type === "scanlation_group",
                )[0],
            ),
          ),
        ]);
      },
    );
  }, [state, order, selectedLanguage]);

  return (
    <div className="reader-page">
      <div className="header">
        <Header />
      </div>
      <div className="reader-page">
        <Typography color="white">{state.mangaName}</Typography>
        <Typography color="white">{state.title}</Typography>
        <List className="reader-feed">
          <ListItemButton
            className="reader-feed-button"
            onClick={() => handleOpenChapters()}
          >
            <ListItemText
              primary={
                <Typography color="white" sx={{ width: "100%" }} noWrap>
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
          offsetStart={
            isNaN(state.startingPage) === true ||
            state.startingPage === undefined
              ? 0
              : state.startingPage
          }
        />
      )}
    </div>
  );
};

export default Reader;
