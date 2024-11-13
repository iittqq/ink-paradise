import { useState, useEffect } from "react";
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
} from "../../interfaces/MangaDexInterfaces";
import { Bookmark } from "../../interfaces/BookmarkInterfaces";
import {
  fetchMangaById,
  fetchMangaCoverBackend,
  fetchMangaFeed,
  fetchChapterDetails,
} from "../../api/MangaDexApi";
import { getBookmarksByUserId, deleteBookmark } from "../../api/Bookmarks";
import { useNavigate } from "react-router-dom";
import "./MangaDetailsDialog.css";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarksIcon from "@mui/icons-material/Bookmarks";

type Props = {
  mangaDetails: Manga;
  openDetailsDialog: boolean;
  handleDetailsDialogClose: () => void;
  coverUrl: string;
  handleClick: (id: string) => void;
  accountId: number | null;
};

const MangaDetailsDialog = (props: Props) => {
  const {
    mangaDetails,
    openDetailsDialog,
    handleDetailsDialogClose,
    coverUrl,
    handleClick,
    accountId,
  } = props;
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<Manga | null>(null);
  const [bookmarks, setBookmarks] = useState<Manga[]>([]);
  const [bookmarkCoverUrls, setBookmarkCoverUrls] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState(false);

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
                {" "}
                <Typography className="manga-details-header-text">
                  {mangaDetails.attributes.contentRating}
                </Typography>
                <Typography className="manga-details-header-text">
                  {mangaDetails.attributes.status}
                </Typography>
                <Typography className="manga-details-header-text">
                  {mangaDetails.attributes.publicationDemographic}
                </Typography>
              </div>{" "}
            </div>
          </div>
          <div className="manga-details-description">
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
