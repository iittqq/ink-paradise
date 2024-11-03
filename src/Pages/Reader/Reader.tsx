import {
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../../Components/Header/Header";
import dayjs from "dayjs";
import { Reading } from "../../interfaces/ReadingInterfaces";
import SettingsIcon from "@mui/icons-material/Settings";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import PageAndControls from "../../Components/PageAndControls/PageAndControls";
import MangaChapterList from "../../Components/MangaChapterList/MangaChapterList";
import "./Reader.css";
import { Bookmark } from "../../interfaces/BookmarkInterfaces";

import {
  updateReading,
  addReading,
  getReadingByUserId,
} from "../../api/Reading";

import { fetchChapterData } from "../../api/MangaDexApi";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
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
  const [open, setOpen] = useState<boolean>(false);
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

  const handleOpenChapters = () => {
    setOpen(!open);
  };

  const handleChangePageNumber = (newPageNumber: number) => {
    setPageNumber(newPageNumber);
  };

  function handleClickTitle() {
    const encodedCoverUrl = encodeURIComponent(state.coverUrl);
    navigate(`/individualView/${state.mangaId}/${encodedCoverUrl}`, {
      state: { accountId: state.accountId === null ? null : state.accountId },
    });
  }

  const handleScrollPosition = () => {
    const scrollPosition = sessionStorage.getItem("position");
    const readerMode = window.localStorage.getItem("readerMode");

    if (scrollPosition && readerMode && parseInt(readerMode) !== 3) {
      window.scrollTo(0, parseInt(scrollPosition));
      sessionStorage.removeItem("position");
    } else {
      window.scrollTo(0, 0);
      sessionStorage.removeItem("position");
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
                  chapterIndex: state.chapterIndex,
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
              chapterIndex: state.chapterIndex,
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
        <div className="settings-icon">
          <Button
            disabled={
              readerMode === "3"
                ? bookmarks.includes(state.chapterNumber) ||
                  state.accountId === null
                : bookmarks.includes(pageNumber + 1) || state.accountId === null
            }
            onClick={() => {
              const simpleMangaName = state.mangaName.replace(
                /[^a-zA-Z]/g,
                " ",
              );
              addBookmark({
                userId: parseInt(state.accountId),
                mangaId: state.mangaId,
                mangaName: simpleMangaName,
                chapterNumber: state.chapterNumber,
                chapterId: state.chapterId,
                chapterIndex: state.chapterIndex,
                continueReading: false,
                pageNumber: pageNumber + 1,
              });
              setBookmarks([...bookmarks, pageNumber]);
            }}
            sx={{ color: "unset", minWidth: "40px" }}
          >
            {" "}
            {readerMode === "3" ? (
              bookmarks.includes(state.chapterNumber) === true ? (
                <BookmarkAddedIcon />
              ) : (
                <BookmarkAddIcon />
              )
            ) : bookmarks.includes(pageNumber + 1) === true ? (
              <BookmarkAddedIcon />
            ) : (
              <BookmarkAddIcon />
            )}
          </Button>
          <Button
            onClick={() => {
              setOpenSettings(true);
            }}
            sx={{ minWidth: "40px", color: "unset" }}
          >
            {" "}
            <SettingsIcon />{" "}
          </Button>
          <Dialog
            id="settings-dialog"
            open={openSettings}
            onClose={() => {
              handleSettingsDialogClose();
            }}
          >
            <DialogTitle
              sx={{ color: "#fff", textAlign: "center", fontFamily: "Figtree" }}
            >
              Settings
            </DialogTitle>
            <DialogContent>
              <Typography color="white" fontFamily="Figtree">
                Reader Mode
              </Typography>
              <FormControl fullWidth>
                <Select
                  id="edit-reader-mode-select"
                  className="edit-reader-mode-dropdown"
                  value={readerMode}
                  label="Reader Mode"
                  variant="standard"
                  disableUnderline={true}
                  onChange={handleChangeNewReaderMode}
                  sx={{
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                  }}
                  MenuProps={{
                    PaperProps: { style: { backgroundColor: "#333333" } },
                  }}
                >
                  <MenuItem className="edit-reader-mode-item" value={1}>
                    Right to Left
                  </MenuItem>
                  <MenuItem className="edit-reader-mode-item" value={2}>
                    Left to Right
                  </MenuItem>
                  <MenuItem className="edit-reader-mode-item" value={3}>
                    Vertical
                  </MenuItem>
                </Select>
              </FormControl>
              <div className="edit-reader-mode-container">
                <Button
                  className="save-reader-mode-button"
                  onClick={() => {
                    handleEditAccountInfo();
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
                    {"Volume " +
                      state.volume +
                      " Chapter " +
                      state.chapterNumber}
                  </Typography>
                }
              />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse className="reader-feed-collapse" in={open} timeout="auto">
              <MangaChapterList
                mangaId={state.mangaId}
                mangaFeed={mangaFeedState}
                mangaName={state.mangaName}
                selectedLanguage={selectedLanguage}
                insideReader={true}
                setOpen={setOpen}
                coverUrl={state.coverUrl}
                accountId={
                  state.accountId === undefined ? null : state.accountId
                }
                contentFilter={state.contentFilter}
                sortOrder={state.sortOrder}
              />
            </Collapse>
          </List>
        </div>
        {open === true ? null : (
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
            chapterIndex={state.chapterIndex}
            setMangaFeedState={setMangaFeedState}
            mangaFeedState={mangaFeedState}
            handleChangePageNumber={handleChangePageNumber}
            startPage={
              state.pageNumber === null || state.pageNumber === undefined
                ? 0
                : state.pageNumber
            }
          />
        )}
      </div>
    </div>
  );
};

export default Reader;
