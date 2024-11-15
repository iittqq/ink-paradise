import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  Card,
  Grid,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Manga,
  MangaTagsInterface,
  MangaFeedScanlationGroup,
  ChapterDetails,
  MangaInfo,
} from "../../interfaces/MangaDexInterfaces";
import { Bookmark } from "../../interfaces/BookmarkInterfaces";
import {
  fetchMangaById,
  fetchMangaCoverBackend,
  fetchMangaFeed,
  fetchChapterDetails,
  fetchSimilarManga,
} from "../../api/MangaDexApi";
import { getBookmarksByUserId, deleteBookmark } from "../../api/Bookmarks";
import { useNavigate } from "react-router-dom";
import "./MangaDetailsDialog.css";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import {
  addMangaFolderEntry,
  getMangaFolderEntries,
} from "../../api/MangaFolderEntry";
import { MangaFolderEntry } from "../../interfaces/MangaFolderEntriesInterfaces";
import MangaPageButtonHeader from "../MangaPageButtonHeader/MangaPageButtonHeader";
import { getMangaFolders } from "../../api/MangaFolder";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";
import LaunchIcon from "@mui/icons-material/Launch";

type Props = {
  mangaDetails: Manga;
  openDetailsDialog: boolean;
  handleDetailsDialogClose: () => void;
  coverUrl: string;
  handleClick: (id: string) => void;
  accountId: number | null;
  contentFilter: number;
};

const MangaDetailsDialog = (props: Props) => {
  const {
    mangaDetails,
    openDetailsDialog,
    handleDetailsDialogClose,
    coverUrl,
    handleClick,
    accountId,
    contentFilter,
  } = props;
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<Manga | null>(null);
  const [bookmarks, setBookmarks] = useState<Manga[]>([]);
  const [bookmarkCoverUrls, setBookmarkCoverUrls] = useState<{
    [key: string]: string;
  }>({});
  const [uiState, setUIState] = useState({
    open: false,
    mangaExistsError: false,
    showInfoToggled: false,
    showCategoriesToggled: false,
    mangaAddedAlert: false,
  });
  const [loading, setLoading] = useState(false);

  const [mangaInfo, setMangaInfo] = useState<MangaInfo>({
    name: "",
    description: "",
    altTitles: [],
    languages: [],
    contentRating: "",
    rawLink: "",
    tags: [],
    author: "",
    status: "",
    coverUrl: "",
  });
  const [folders, setFolders] = useState<MangaFolder[]>([]);

  const fetchSimilarMangaByTags = useCallback(
    async (tags: string[]) => {
      if (tags.length === 0) return; // Exit if tags are empty

      try {
        const data = await fetchSimilarManga(10, 0, tags, contentFilter ?? 3);
        return data;
      } catch (error) {
        console.error("Error fetching similar manga:", error);
      }
    },
    [contentFilter],
  );

  const fetchFolders = useCallback(async () => {
    if (accountId) {
      const response = await getMangaFolders();
      setFolders(response.filter((folder) => folder.userId === accountId));
    }
  }, [accountId]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleDelete = async () => {
    console.log(selectedBookmark);
    if (
      selectedBookmark !== null &&
      selectedBookmark.bookmarkId !== undefined
    ) {
      await deleteBookmark(selectedBookmark.bookmarkId);
      await handleFetchingBookmarks();
    }
    setDialogOpen(false);
    setSelectedBookmark(null);
  };

  const handleBookmarkClick = (bookmark: Manga) => {
    setSelectedBookmark(bookmark);
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedBookmark(null);
  };
  const handleMangaCategoryClicked = (category: MangaTagsInterface) => {
    fetchSimilarMangaByTags([category.id]).then((data: Manga[] | undefined) =>
      navigate("/mangaCoverList", {
        state: {
          listType: category.attributes.name.en,
          manga: data,
          accountId: accountId,
        },
      }),
    );
  };

  const handleAddToFolder = (folderId: number) => {
    if (!folderId || !mangaDetails.id) return;
    getMangaFolderEntries().then((response) => {
      const exists = response.some(
        (entry: MangaFolderEntry) =>
          entry.folderId === folderId && entry.mangaId === mangaDetails.id,
      );
      if (!exists) {
        addMangaFolderEntry({ folderId, mangaId: mangaDetails.id });
        setUIState((prev) => ({ ...prev, mangaAddedAlert: true }));
        setTimeout(
          () => setUIState((prev) => ({ ...prev, mangaAddedAlert: false })),
          3000,
        );
      } else {
        setUIState((prev) => ({ ...prev, mangaExistsError: true }));
        setTimeout(
          () => setUIState((prev) => ({ ...prev, mangaExistsError: false })),
          3000,
        );
      }
    });
  };

  const handleStartReading = () => {
    if (selectedBookmark !== null && selectedBookmark.index !== undefined) {
      fetchMangaFeed(
        selectedBookmark.id,
        100,
        Math.max(0, selectedBookmark.index - 10),
        "asc",
        "en",
      ).then((mangaFeed: MangaFeedScanlationGroup[]) => {
        console.log(mangaFeed);
        if (selectedBookmark.chapterId !== undefined) {
          fetchChapterDetails(selectedBookmark.chapterId).then(
            (response: ChapterDetails) => {
              console.log(response);
              console.log(selectedBookmark);
              navigate("/reader", {
                state: {
                  mangaId: selectedBookmark.id,
                  chapterId: selectedBookmark.chapterId,
                  title: response.attributes.title,
                  volume: response.attributes.volume,
                  mangaName:
                    selectedBookmark.attributes.title.en === undefined
                      ? Object.values(selectedBookmark.attributes.title)[0]
                      : selectedBookmark.attributes.title.en,
                  chapterNumber: selectedBookmark.chapterNumber,
                  externalUrl: response.attributes.externalUrl,
                  scanlationGroup:
                    response.relationships[0].type === "scanlation_group"
                      ? response.relationships[0].attributes.name
                      : "Unknown",
                  coverUrl: bookmarkCoverUrls[selectedBookmark.id],
                  accountId: accountId,
                  chapterIndex: selectedBookmark.index,
                  mangaFeed: mangaFeed,
                  pageNumber:
                    selectedBookmark.bookmarkContinueReading === true
                      ? 0
                      : selectedBookmark.bookmarkPageNumber === undefined
                        ? null
                        : selectedBookmark.bookmarkPageNumber - 1,
                },
              });
            },
          );
        }
      });
    }
  };

  const handleFetchingBookmarks = async () => {
    setLoading(true);
    try {
      if (accountId !== null) {
        const bookmarks: Bookmark[] = await getBookmarksByUserId(accountId);

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

        const enrichedBookmarks = await Promise.all(mangaPromises);
        const filteredBookmarks = enrichedBookmarks.filter(
          (bookmark) => bookmark.id === mangaDetails.id,
        );

        setBookmarks(filteredBookmarks);
        console.log("Bookmarks:", filteredBookmarks);
      }
    } catch (error) {
      console.error("Error fetching bookmarks data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoverImages = async () => {
    for (const manga of bookmarks) {
      const fileName = manga.relationships.find((i) => i.type === "cover_art")
        ?.attributes?.fileName;
      if (fileName) {
        const imageBlob = await fetchMangaCoverBackend(manga.id, fileName);
        setBookmarkCoverUrls((prevCoverUrls) => ({
          ...prevCoverUrls,
          [manga.id]: URL.createObjectURL(imageBlob),
        }));
      }
    }
  };

  useEffect(() => {
    if (accountId) {
      handleFetchingBookmarks();
    }
    if (bookmarks && bookmarks.length > 0) {
      fetchCoverImages();
    }
    setMangaInfo({
      name: mangaDetails.attributes.title.en || "",
      description: mangaDetails.attributes.description.en || "",
      altTitles: mangaDetails.attributes.altTitles || [],
      languages: mangaDetails.attributes.availableTranslatedLanguages || [],
      contentRating: mangaDetails.attributes.contentRating || "",
      rawLink: mangaDetails.attributes.links?.raw || "",
      tags: mangaDetails.attributes.tags || [],
      author:
        mangaDetails.relationships.find((element) => element.type === "author")
          ?.attributes.name || "",
      status: mangaDetails.attributes.status || "",
      coverUrl,
    });
  }, [accountId, props]);

  return (
    <>
      <Dialog
        id="clicked-manga-dialog"
        open={openDetailsDialog}
        onClose={handleDetailsDialogClose}
      >
        <DialogTitle className="clicked-manga-dialog-title">
          <Button
            className="manga-details-dialog-header"
            onClick={() => {
              handleClick(mangaDetails.id);
            }}
          >
            <Typography className="manga-details-dialog-header-text">
              {mangaDetails.attributes.title.en === undefined
                ? Object.values(mangaDetails.attributes.title)[0]
                : mangaDetails.attributes.title.en}
            </Typography>
            <LaunchIcon sx={{ paddingLeft: "5px" }} />
          </Button>
        </DialogTitle>
        <div className="manga-details-dialog-contents">
          <div className="manga-details-cover-section">
            <Card
              sx={{
                maxWidth: "110px",
                minWidth: "110px",
                height: "160px",
              }}
            >
              <CardMedia
                sx={{
                  width: "100%",
                  height: "160px",
                }}
                image={coverUrl}
              />
            </Card>
            <div className="manga-details-stack">
              <div className="author-container">
                <Typography className="manga-details-header-text-author">
                  Author:&nbsp;
                </Typography>
                <Typography className="manga-details-header-text-author-name">
                  {
                    mangaDetails.relationships.find(
                      (element) => element.type === "author",
                    )?.attributes.name
                  }
                </Typography>
              </div>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                className="manga-categories-dialog"
              >
                {mangaDetails.attributes.tags.map(
                  (current: MangaTagsInterface) => (
                    <Grid item>
                      <Typography
                        noWrap
                        className="manga-categories-dialog-text"
                      >
                        {current.attributes.name.en}&nbsp;/&nbsp;
                      </Typography>
                    </Grid>
                  ),
                )}
              </Grid>
              <div className="details-row">
                <Typography className="manga-details-header-text">
                  {mangaDetails.attributes.status}
                </Typography>
                <Typography className="manga-details-header-text">
                  {mangaDetails.attributes.publicationDemographic}
                </Typography>
              </div>
              <div>
                <MangaPageButtonHeader
                  mangaRaw={mangaInfo.rawLink}
                  folders={folders}
                  mangaAltTitles={mangaInfo.altTitles}
                  mangaTags={mangaInfo.tags}
                  id={mangaDetails.id !== undefined ? mangaDetails.id : ""}
                  handleAddToFolder={handleAddToFolder}
                  handleClickOpen={() =>
                    setUIState((prev) => ({ ...prev, open: true }))
                  }
                  handleCloseCategories={() =>
                    setUIState((prev) => ({
                      ...prev,
                      showCategoriesToggled: false,
                    }))
                  }
                  handleCloseInfo={() =>
                    setUIState((prev) => ({ ...prev, showInfoToggled: false }))
                  }
                  handleOpenCategories={() =>
                    setUIState((prev) => ({
                      ...prev,
                      showCategoriesToggled: true,
                    }))
                  }
                  handleOpenInfo={() =>
                    setUIState((prev) => ({ ...prev, showInfoToggled: true }))
                  }
                  open={uiState.open}
                  showInfoToggled={uiState.showInfoToggled}
                  showCategoriesToggled={uiState.showCategoriesToggled}
                  mangaExistsError={uiState.mangaExistsError}
                  handleClose={() =>
                    setUIState((prev) => ({
                      ...prev,
                      open: false,
                      mangaExistsError: false,
                    }))
                  }
                  mangaContentRating={mangaInfo.contentRating}
                  mangaAddedAlert={uiState.mangaAddedAlert}
                  handleMangaCategoryClicked={handleMangaCategoryClicked}
                />
              </div>
            </div>
          </div>
          <div
            className="manga-details-description"
            style={{
              marginBottom:
                accountId !== null && bookmarks.length > 0 ? "0px" : "10px",
            }}
          >
            <Typography className="manga-description-header-text">
              Description:
            </Typography>
            <Typography className="manga-details-description-text">
              {mangaDetails.attributes.description.en}
            </Typography>
          </div>
          {accountId !== null && bookmarks.length > 0 ? (
            loading === true ? (
              <div className="loading-indicator-dialog">
                <CircularProgress size={25} className="loading-icon" />
              </div>
            ) : (
              <>
                <Typography className="manga-dialog-bookmarks-header">
                  Bookmarks
                </Typography>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                  className="manga-dialog-bookmarks"
                >
                  {bookmarks.map((bookmark) => {
                    if (mangaDetails.id === bookmark.id) {
                      const buttonIcon = bookmark.bookmarkContinueReading ? (
                        <BookmarkIcon />
                      ) : (
                        <>
                          <BookmarksIcon /> {bookmark.chapterNumber} :{" "}
                          {bookmark.bookmarkPageNumber}
                        </>
                      );

                      return (
                        <Grid item key={bookmark.id}>
                          <Button
                            className="manga-dialog-continue-button"
                            onClick={() => {
                              handleBookmarkClick(bookmark);
                            }}
                          >
                            {buttonIcon}
                          </Button>
                        </Grid>
                      );
                    }
                    return null;
                  })}
                </Grid>
              </>
            )
          ) : null}
          <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            className="bookmark-clicked-dialog"
          >
            <DialogTitle className="bookmark-clicked-dialog-title">
              Options
            </DialogTitle>

            <DialogActions className="bookmark-clicked-dialog-option-list">
              <Button
                onClick={handleStartReading}
                className="bookmark-clicked-dialog-option"
              >
                <AutoStoriesIcon />
                <Typography color="#fff" fontFamily={"Figtree"}>
                  Read
                </Typography>
              </Button>
              <Button
                onClick={handleDelete}
                color="error"
                className="bookmark-clicked-dialog-option"
              >
                <DeleteIcon />
                <Typography color="#fff" fontFamily={"Figtree"}>
                  Delete
                </Typography>
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Dialog>
    </>
  );
};

export default MangaDetailsDialog;
