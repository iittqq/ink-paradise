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
import { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useNavigate } from "react-router-dom";
import "./PageAndControls.css";
import SettingsIcon from "@mui/icons-material/Settings";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { MangaFeedScanlationGroup } from "../../interfaces/MangaDexInterfaces";
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
    chapterIndex,
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
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(pages.length).fill(false),
  );
  const [longStripReaderWidth] = useState(
    window.innerWidth > 900 ? "50%" : "100%",
  );
  const [pageHeight] = useState(window.innerWidth > 900 ? "90vh" : "");
  const [open, setOpen] = useState<boolean>(false);
  const [chapterIndexState, setChapterIndexState] =
    useState<number>(chapterIndex);
  const [orderState] = useState<string>(order || "asc");
  const [leftToRight, setLeftToRight] = useState<boolean>(
    readerMode === 2 || readerMode === 4 ? true : false,
  );
  const [vertical, setVertical] = useState<boolean>(
    readerMode === 3 || readerMode === 4 ? true : false,
  );

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(startPage);

  const handleNextChapter = () => {
    setCurrentPage(0);
    handleChangePageNumber(0);

    let chapterFound = false;
    const tempMangaFeed =
      orderState === "desc" ? mangaFeedState.reverse() : mangaFeedState;

    for (let index = 0; index < tempMangaFeed.length; index++) {
      const current = tempMangaFeed[index];
      if (
        parseFloat(current.attributes.chapter) > parseFloat(currentChapter) &&
        tempMangaFeed[index].attributes.externalUrl === null
      ) {
        chapterFound = true;
        handleClick(
          mangaId,
          tempMangaFeed[index].id,
          tempMangaFeed[index].attributes.title,
          tempMangaFeed[index].attributes.volume,
          tempMangaFeed[index].attributes.chapter,
          mangaName,
          scanlationGroup,
          chapterIndexState + 1,
        );
        break;
      }
    }
    if (!chapterFound) {
      fetchMangaFeed(
        mangaId,
        10,
        chapterIndexState - 1,
        orderState,
        selectedLanguage,
      ).then((data: MangaFeedScanlationGroup[]) => {
        setMangaFeedState([...mangaFeedState, ...data]);
      });
    }
    setChapterIndexState(chapterIndexState + 1);
  };

  const handlePreviousChapter = () => {
    setCurrentPage(0);
    handleChangePageNumber(0);
    let chapterFound = false;
    const tempMangaFeed =
      orderState === "desc" ? mangaFeedState.reverse() : mangaFeedState;

    for (let index = tempMangaFeed.length - 1; index >= 0; index--) {
      const current = tempMangaFeed[index];
      if (
        parseFloat(current.attributes.chapter) < parseFloat(currentChapter) &&
        tempMangaFeed[index].attributes.externalUrl === null
      ) {
        chapterFound = true;
        handleClick(
          mangaId,
          tempMangaFeed[index].id,
          tempMangaFeed[index].attributes.title,
          tempMangaFeed[index].attributes.volume,
          tempMangaFeed[index].attributes.chapter,
          mangaName,
          scanlationGroup,
          Math.max(0, chapterIndexState - 10),
        );
        break;
      }
    }
    if (!chapterFound) {
      fetchMangaFeed(
        mangaId,
        20,
        Math.max(0, chapterIndexState - 10),
        orderState,
        selectedLanguage,
      ).then((data: MangaFeedScanlationGroup[]) => {
        console.log(data);
        console.log([...data, ...mangaFeedState]);
        setMangaFeedState(data);
      });
    }
    setChapterIndexState(chapterIndex - 1);
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
    const promises = pages.map(async (page, index) => {
      setLoadingStates((prev) => {
        const newLoadingStates = [...prev];
        newLoadingStates[index] = true;
        return newLoadingStates;
      });

      return fetchPageImageBackend(hash, page)
        .then((blob) => {
          // Assuming setImageBlob is modified to handle multiple blobs
          setImageBlob((prevBlobs) => ({
            ...prevBlobs,
            [page]: blob,
          }));

          setLoadingStates((prev) => {
            const newLoadingStates = [...prev];
            newLoadingStates[index] = false;
            return newLoadingStates;
          });
        })
        .catch((error) => {
          setLoadingStates((prev) => {
            const newLoadingStates = [...prev];
            newLoadingStates[index] = false;
            return newLoadingStates;
          });
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
    chapterIndex: number,
  ) => {
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
        mangaFeed: mangaFeedState,
        chapterIndex: chapterIndex,
        pageNumber: 0,
      },
    });
  };

  useEffect(() => {
    let localPage = currentPage; // Local variable to track the current page

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          if (readerMode === 1 || readerMode === 3) {
            if (localPage === pages.length - 1 || readerMode === 3) {
              handleNextChapter();
              localPage = 0; // Reset localPage for the next chapter
            } else {
              localPage += 1;
              handleChangePageNumber(localPage);
              setCurrentPage(localPage);
            }
          } else if (readerMode === 2 || readerMode === 4) {
            if (localPage === 0 || readerMode === 4) {
              handlePreviousChapter();
              localPage = pages.length - 1; // Set localPage to last page of the previous chapter
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
              localPage = pages.length - 1; // Set localPage to last page of the previous chapter
            } else {
              localPage -= 1;
              handleChangePageNumber(localPage);
              setCurrentPage(localPage);
            }
          } else if (readerMode === 2 || readerMode === 4) {
            if (localPage === pages.length - 1 || readerMode === 4) {
              handleNextChapter();
              localPage = 0; // Reset localPage for the next chapter
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
                      if (!vertical) {
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
                      if (!vertical) {
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
                      outline: !vertical ? "1px solid #fff" : "none",
                    }}
                    onClick={() => {
                      setVertical(!vertical);
                      if (vertical) {
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
            {loadingStates[currentPage] ? (
              <div className="loading">
                <CircularProgress size={25} className="loading-icon" />
              </div>
            ) : (
              <>
                {readerMode === 3 || readerMode === 4
                  ? pages.map((page, index) =>
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
                      ) : null,
                    )
                  : imageBlob[pages[currentPage]] && (
                      <img
                        className="page"
                        src={URL.createObjectURL(imageBlob[pages[currentPage]])}
                        alt=""
                        style={{ maxHeight: pageHeight }}
                      />
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
            )}{" "}
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
        />
      </Collapse>
    </div>
  );
};

export default PageAndControls;
