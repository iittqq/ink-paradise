import {
  Button,
  Typography,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  Collapse,
  Grid,
} from "@mui/material";
import {
  fetchAccountData,
  isTokenExpired,
  refreshTokenFunction,
} from "../../api/Account";
import { Account } from "../../interfaces/AccountInterfaces";
import { useEffect, useState, useCallback, useRef } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useNavigate } from "react-router-dom";
import "./PageAndControls.css";
import SettingsIcon from "@mui/icons-material/Settings";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  MangaAggregated,
  MangaFeedScanlationGroup,
} from "../../interfaces/MangaDexInterfaces";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookIcon from "@mui/icons-material/Book";
import { updateOrCreateBookmark } from "../../api/Bookmarks";
import MangaChapterList from "../MangaChapterList/MangaChapterList";
import HomeIcon from "@mui/icons-material/Home";
import { fetchPageImageBackend, fetchMangaFeed } from "../../api/MangaDexApi";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

type Props = {
  id: string;
  pages: string[];
  hash: string;
  currentChapter: string;
  mangaId: string;
  mangaName: string;
  scanlationGroup: string;
  readerMode: number;
  accountId: number | null;
  order: string;
  selectedLanguage: string;
  chapterIndex: number;
  mangaAggregated: MangaAggregated;
  setMangaFeedState: React.Dispatch<
    React.SetStateAction<MangaFeedScanlationGroup[]>
  >;
  mangaFeedState: MangaFeedScanlationGroup[];
  handleChangePageNumber: (pageNumber: number) => void;
  startPage: number;
  volume: string;
  chapterNumber: string;
  bookmarks: number[];
  setBookmarks: React.Dispatch<React.SetStateAction<number[]>>;
  pageNumber: number;
  setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>;
  handleSettingsDialogClose: () => void;
  handleChangeNewReaderMode: (newReaderMode: number) => void;
  handleEditAccountInfo: () => void;
  chapterId: string;
  openSettings: boolean;
  readerModeString: string;
  coverUrl: string;
  contentFilter: number;
  oneshot: boolean;
};

const PageAndControls = (props: Props) => {
  const {
    id,
    pages,
    hash,
    currentChapter,
    mangaId,
    mangaName,
    scanlationGroup,
    readerMode,
    accountId,
    order,
    selectedLanguage,
    mangaAggregated,
    setMangaFeedState,
    mangaFeedState,
    handleChangePageNumber,
    startPage,
    volume,
    chapterNumber,
    bookmarks,
    setBookmarks,
    pageNumber,
    setOpenSettings,
    handleSettingsDialogClose,
    handleChangeNewReaderMode,
    handleEditAccountInfo,
    chapterId,
    openSettings,
    coverUrl,
    contentFilter,
    oneshot,
  } = props;
  const [imageBlob, setImageBlob] = useState<{ [key: string]: Blob }>({});

  const [longStripReaderWidth] = useState(
    window.innerWidth > 900 ? "50%" : "100%",
  );
  const [currentOffset, setCurrentOffset] = useState(0);
  const [pageHeight] = useState(window.innerWidth > 900 ? "90vh" : "");
  const [open, setOpen] = useState<boolean>(false);

  const [orderState] = useState<string>(order || "asc");
  const [leftToRight, setLeftToRight] = useState<boolean>(
    readerMode === 2 || readerMode === 4 ? true : false,
  );
  const [vertical, setVertical] = useState<boolean>(
    readerMode === 3 || readerMode === 4 ? true : false,
  );

  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(startPage);

  const fetchFeedData = useCallback(async () => {
    if (id) {
      const data = await fetchMangaFeed(
        id,
        100,
        currentOffset,
        "asc",
        selectedLanguage,
        abortControllerRef.current!.signal,
      );
      if (currentOffset === 0) {
        setMangaFeedState(data);
      } else {
        setMangaFeedState((previousFeed) => [...previousFeed, ...data]);
      }
    }
  }, [id, selectedLanguage, currentOffset]);

  const handleShowMore = () => {
    setCurrentOffset(currentOffset + 100);
    console.log(currentOffset);
  };

  useEffect(() => {
    fetchFeedData();
  }, [fetchFeedData]);
  const handleNextChapter = () => {
    setCurrentPage(0);
    handleChangePageNumber(0);

    console.log(mangaAggregated);

    let chapterFound = false;
    let nextChapter: { id: string; chapter: string; volume: string } | null =
      null;

    const volumeKeys = Object.keys(mangaAggregated.volumes).sort(
      (a, b) => parseFloat(a) - parseFloat(b),
    );
    for (let vIndex = 0; vIndex < volumeKeys.length; vIndex++) {
      const volume = mangaAggregated.volumes[volumeKeys[vIndex]];

      const chapters = Object.values(volume.chapters);
      console.log(chapters);

      for (let cIndex = 0; cIndex < chapters.length; cIndex++) {
        const current = chapters[cIndex];
        if (parseFloat(current.chapter) > parseFloat(currentChapter)) {
          chapterFound = true;
          nextChapter = {
            id: current.id,
            chapter: current.chapter,
            volume: volumeKeys[vIndex],
          };
          console.log(nextChapter);
          break;
        }
      }

      if (chapterFound) break;
    }

    if (nextChapter) {
      handleClick(
        mangaId,
        nextChapter.id,
        nextChapter.chapter,
        nextChapter.volume,
        nextChapter.chapter,
        mangaName,
        scanlationGroup,
      );
    }
  };

  const handlePreviousChapter = () => {
    setCurrentPage(0);
    handleChangePageNumber(0);

    let chapterFound = false;
    let prevChapter: { id: string; chapter: string; volume: string } | null =
      null;

    const volumeKeys = Object.keys(mangaAggregated.volumes)
      .sort((a, b) => parseFloat(a) - parseFloat(b))
      .reverse();

    console.log(volumeKeys);
    console.log(volume);

    for (let vIndex = 0; vIndex < volumeKeys.length; vIndex++) {
      const volume = mangaAggregated.volumes[volumeKeys[vIndex]];
      const chapters = Object.values(volume.chapters).sort(
        (a, b) => parseFloat(b.chapter) - parseFloat(a.chapter),
      );
      console.log(chapters);

      for (let cIndex = 0; cIndex < chapters.length; cIndex++) {
        const current = chapters[cIndex];

        if (parseFloat(current.chapter) < parseFloat(currentChapter)) {
          chapterFound = true;
          prevChapter = {
            id: current.id,
            chapter: current.chapter,
            volume: volumeKeys[vIndex],
          };
          break;
        }
      }

      if (chapterFound) break;
    }

    if (prevChapter) {
      handleClick(
        mangaId,
        prevChapter.id,
        prevChapter.chapter,
        prevChapter.volume,
        prevChapter.chapter,
        mangaName,
        scanlationGroup,
      );
    }
  };
  const handlePreviousPage = () => {
    console.log("Previous page");
    if (currentPage === 0 || readerMode === 3 || readerMode === 4) {
      handlePreviousChapter();
    } else {
      console.log(currentPage);
      setCurrentPage(currentPage - 1);
      handleChangePageNumber(currentPage - 1);
    }
    window.localStorage.setItem("position", window.scrollY.toString());
  };

  const handleNextPage = () => {
    console.log("Next page");
    if (
      currentPage === pages.length - 1 ||
      readerMode === 3 ||
      readerMode === 4
    ) {
      handleNextChapter();
    } else {
      console.log(currentPage);
      setCurrentPage(currentPage + 1);
      handleChangePageNumber(currentPage + 1);
    }
    window.localStorage.setItem("position", window.scrollY.toString());
  };

  const handleLoadImage = async (
    hash: string,
    pages: string[],
  ): Promise<void> => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const promises = pages.map(async (page) => {
      return fetchPageImageBackend(
        hash,
        page,
        abortControllerRef.current!.signal,
      )
        .then((blob) => {
          // Assuming setImageBlob is modified to handle multiple blobs
          setImageBlob((prevBlobs) => ({
            ...prevBlobs,
            [page]: blob,
          }));
        })
        .catch((error) => {
          console.error("Error loading image:", error);
          throw error;
        });
    });

    await Promise.all(promises);
  };

  const handleOpenChapters = () => {
    setOpen(!open);
  };

  const handleClickLogo = async () => {
    abortControllerRef.current?.abort();

    navigate("/", { state: { accountId: accountId } });
  };

  const handleClickLibrary = async () => {
    let accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    console.log(accessToken);
    console.log(refreshToken);

    if (accessToken !== null) {
      if (isTokenExpired(accessToken)) {
        console.error("Access token is expired. Attempting to refresh.");

        if (refreshToken) {
          try {
            accessToken = await refreshTokenFunction(refreshToken);
            localStorage.setItem("accessToken", accessToken);
          } catch (error) {
            console.error("Refresh token failed. Please log in again.");
            navigate("/login");
            return;
          }
        } else {
          console.error("No refresh token found. Please log in again.");
          navigate("/login");
          return;
        }
      }
    }

    if (accountId !== null) {
      fetchAccountData(accountId).then((data: Account | null) => {
        if (data !== null && data.verified === true) {
          navigate("/library", {
            state: { accountId: accountId, contentFilter: contentFilter },
          });
        }
      });
    } else {
      navigate("/login");
    }
  };

  const handleClick = (
    mangaId: string,
    chapterId: string,
    title: string,
    volume: string,
    chapterNumber: string,
    mangaName: string,
    scanlationGroup: string,
  ) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    navigate("/reader", {
      state: {
        mangaId: mangaId,
        chapterId: chapterId,
        title: title,
        volume: volume,
        chapterNumber: chapterNumber,
        mangaName: mangaName,
        scanlationGroup: scanlationGroup,
        accountId: accountId,
        mangaAggregated: mangaAggregated,
        pageNumber: 0,
      },
    });
  };

  useEffect(() => {
    let localPage = currentPage;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          if (readerMode === 1 || readerMode === 3) {
            if (localPage === pages.length - 1 || readerMode === 3) {
              handleNextChapter();
              localPage = 0;
            } else {
              localPage += 1;
              handleChangePageNumber(localPage);
              setCurrentPage(localPage);
            }
          } else if (readerMode === 2 || readerMode === 4) {
            if (localPage === 0 || readerMode === 4) {
              handlePreviousChapter();
              localPage = pages.length - 1;
            } else {
              localPage -= 1;
              handleChangePageNumber(localPage);
              setCurrentPage(localPage);
            }
          }
          window.localStorage.setItem("position", window.scrollY.toString());
          break;

        case "ArrowRight":
          if (readerMode === 1 || readerMode === 3) {
            if (localPage === 0 || readerMode === 3) {
              handlePreviousChapter();
              localPage = pages.length - 1;
            } else {
              localPage -= 1;
              handleChangePageNumber(localPage);
              setCurrentPage(localPage);
            }
          } else if (readerMode === 2 || readerMode === 4) {
            if (localPage === pages.length - 1 || readerMode === 4) {
              handleNextChapter();
              localPage = 0;
            } else {
              localPage += 1;
              handleChangePageNumber(localPage);
              setCurrentPage(localPage);
            }
          }
          window.localStorage.setItem("position", window.scrollY.toString());
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    currentPage,
    pages.length,
    readerMode,
    handleNextChapter,
    handlePreviousChapter,
    handleChangePageNumber,
  ]);

  useEffect(() => {
    console.log(readerMode);
    console.log(vertical);
    setCurrentPage(startPage);
    setImageBlob({});
    handleLoadImage(hash, pages).catch((error) => {
      throw error;
    });
  }, [hash, pages]);

  return (
    <div className="reader-screen-container">
      <List className="reader-feed">
        <ListItemButton
          className="reader-feed-button"
          onClick={() => handleOpenChapters()}
        >
          <AutoStoriesIcon sx={{ paddingLeft: "4px" }} />
          <ListItemText
            primary={
              <Typography
                className="reader-page-text"
                sx={{ width: "100%" }}
                noWrap
              >
                {(oneshot === true ? 1 : volume) +
                  " : " +
                  (oneshot === true ? 1 : chapterNumber) +
                  " : " +
                  (currentPage + 1) +
                  " / " +
                  pages.length}
              </Typography>
            }
          />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <div className="title-settings-row">
          <Button
            className="home-button"
            onClick={() => handleClickLogo()}
            sx={{
              minWidth: "40px",
              color: "unset",
            }}
          >
            <HomeIcon />
          </Button>
          {accountId === null ? null : (
            <Button
              className="library-button-reader"
              onClick={() => {
                handleClickLibrary();
              }}
              sx={{
                minWidth: "40px",
                color: "unset",
              }}
            >
              <BookIcon />
            </Button>
          )}
          {readerMode === 3 || readerMode === 4 ? (
            bookmarks.includes(parseInt(chapterNumber)) || accountId === null
          ) : bookmarks.includes(pageNumber + 1) ||
            accountId === null ? null : (
            <Button
              className="bookmark-button"
              sx={{ minWidth: "40px", color: "unset" }}
              onClick={async () => {
                const simpleMangaName = mangaName.replace(/[^a-zA-Z]/g, " ");
                const newBookmark = {
                  userId: accountId,
                  mangaId: mangaId,
                  mangaName: simpleMangaName,
                  chapterNumber: parseInt(chapterNumber),
                  chapterId: chapterId,
                  chapterIndex: Math.trunc(parseInt(chapterNumber)),
                  continueReading: false,
                  pageNumber: pageNumber + 1,
                };

                try {
                  // Call the API to update or create the bookmark
                  const response = await updateOrCreateBookmark(newBookmark);

                  // Update the state with the new bookmark if the API call succeeds
                  setBookmarks((prevBookmarks) => [
                    ...prevBookmarks,
                    pageNumber + 1,
                  ]);

                  console.log(
                    "Bookmark updated or created successfully:",
                    response,
                  );
                } catch (error) {
                  console.error("Failed to update or create bookmark:", error);
                }
              }}
            >
              <BookmarkAddIcon />
            </Button>
          )}
          <Button
            className="settings-button"
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
              handleEditAccountInfo();
            }}
          >
            <DialogTitle
              sx={{
                color: "#fff",
                textAlign: "center",
                fontFamily: "Figtree",
              }}
            >
              Reader Settings
            </DialogTitle>
            <DialogContent>
              <Grid
                container
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                className="reader-options-buttons"
              >
                <Grid item>
                  <Button
                    className="reader-options-button"
                    sx={{
                      outline: !leftToRight ? "1px solid #fff" : "none",
                    }}
                    onClick={() => {
                      setLeftToRight(false);
                      if (vertical) {
                        handleChangeNewReaderMode(3);
                      } else {
                        handleChangeNewReaderMode(1);
                      }
                    }}
                  >
                    <ArrowBackIcon />
                    Right to Left
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    className="reader-options-button"
                    sx={{
                      outline: leftToRight ? "1px solid #fff" : "none",
                    }}
                    onClick={() => {
                      setLeftToRight(true);
                      if (vertical) {
                        handleChangeNewReaderMode(4);
                      } else {
                        handleChangeNewReaderMode(2);
                      }
                    }}
                  >
                    <ArrowForwardIcon />
                    Left to Right
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    className="reader-options-button"
                    sx={{
                      outline:
                        vertical || readerMode === 3 || readerMode === 4
                          ? "1px solid #fff"
                          : "none",
                    }}
                    onClick={() => {
                      setVertical(!vertical);
                      if (!vertical) {
                        if (leftToRight) {
                          handleChangeNewReaderMode(4);
                        } else {
                          handleChangeNewReaderMode(3);
                        }
                      } else {
                        if (leftToRight) {
                          handleChangeNewReaderMode(2);
                        } else {
                          handleChangeNewReaderMode(1);
                        }
                      }
                    }}
                  >
                    <ArrowDownwardIcon />
                    Vertical
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </div>
      </List>
      {open === true ? null : (
        <>
          <div
            className="page-container"
            style={{
              width:
                readerMode === 3 || readerMode === 4
                  ? longStripReaderWidth
                  : "",
              display:
                readerMode === 3 || readerMode === 4 ? "inline-block" : "flex",
              //maxHeight: pageHeight,
            }}
          >
            <>
              {readerMode === 3 || readerMode === 4 ? (
                pages.map((page, index) =>
                  imageBlob[page] ? (
                    <img
                      key={index}
                      className="page"
                      src={URL.createObjectURL(imageBlob[page])}
                      style={{
                        display: "block",
                        width: "100%",
                      }}
                    />
                  ) : (
                    <div className="loading">
                      <CircularProgress size={25} className="loading-icon" />
                    </div>
                  ),
                )
              ) : imageBlob[pages[currentPage]] ? (
                <img
                  className="page"
                  src={URL.createObjectURL(imageBlob[pages[currentPage]])}
                  alt=""
                  style={{ maxHeight: pageHeight }}
                />
              ) : (
                <div className="loading">
                  <CircularProgress size={25} className="loading-icon" />
                </div>
              )}
              <div className="overlay-buttons" style={{}}>
                <Button
                  className="chapter-page-traversal"
                  onClick={() => {
                    if (readerMode === 1 || readerMode === 3) {
                      handleNextPage();
                    } else if (readerMode === 2 || readerMode === 4) {
                      handlePreviousPage();
                    }
                  }}
                ></Button>
                <Button
                  className="chapter-page-traversal"
                  onClick={() => {
                    if (readerMode === 1 || readerMode === 3) {
                      handlePreviousPage();
                    } else if (readerMode === 2 || readerMode === 4) {
                      handleNextPage();
                    }
                  }}
                ></Button>
              </div>
            </>
          </div>

          <div className="centered">
            <Button
              className="chapter-page-traversal-buttons"
              onClick={() => {
                if (readerMode === 1 || readerMode === 3) {
                  handleNextChapter();
                } else if (readerMode === 2 || readerMode === 4) {
                  handlePreviousChapter();
                }
              }}
            >
              <KeyboardDoubleArrowLeftIcon />
            </Button>
            <Button
              className="chapter-page-traversal-buttons"
              onClick={() => {
                if (readerMode === 1 || readerMode === 3) {
                  handleNextPage();
                } else if (readerMode === 2 || readerMode === 4) {
                  handlePreviousPage();
                }
              }}
            >
              <KeyboardArrowLeftIcon />
            </Button>
            <Button
              className="chapter-page-traversal-buttons"
              onClick={() => {
                if (readerMode === 1 || readerMode === 3) {
                  handlePreviousPage();
                } else if (readerMode === 2 || readerMode === 4) {
                  handleNextPage();
                }
              }}
            >
              <KeyboardArrowRightIcon />
            </Button>
            <Button
              className="chapter-page-traversal-buttons"
              onClick={() => {
                if (readerMode === 1 || readerMode === 3) {
                  handlePreviousChapter();
                } else if (readerMode === 2 || readerMode === 4) {
                  handleNextChapter();
                }
              }}
            >
              <KeyboardDoubleArrowRightIcon />
            </Button>
          </div>
        </>
      )}
      <Collapse
        className="reader-feed-collapse"
        sx={{
          paddingTop: open === true ? "5px" : "0px !important",
          maxHeight: open === true ? "auto" : "30px !important",
          display: open === true ? "auto" : "none",
        }}
        in={open}
        timeout="auto"
      >
        <MangaChapterList
          mangaId={mangaId}
          mangaFeed={mangaFeedState}
          mangaName={mangaName}
          selectedLanguage={selectedLanguage}
          insideReader={true}
          setOpen={setOpen}
          coverUrl={coverUrl}
          accountId={accountId}
          contentFilter={contentFilter}
          sortOrder={orderState}
          oneshot={oneshot}
          handleShowMore={handleShowMore}
          offset={currentOffset}
        />
      </Collapse>
    </div>
  );
};

export default PageAndControls;
