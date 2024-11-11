import { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  Card,
  Grid,
  CardMedia,
  CircularProgress,
} from "@mui/material";
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
import { getBookmarksByUserId } from "../../api/Bookmarks";
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

  const [bookmarks, setBookmarks] = useState<Manga[]>([]);
  const [bookmarkCoverUrls, setBookmarkCoverUrls] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleBookmarkClick = (
    mangaId: string,
    chapterId: string,
    chapterNumber: number,
    mangaName: string,
    coverUrl: string,
    index: number,
    pageNumber: number | null,
  ) => {
    fetchMangaFeed(mangaId, 100, Math.max(0, index - 10), "asc", "en").then(
      (mangaFeed: MangaFeedScanlationGroup[]) => {
        fetchChapterDetails(chapterId).then((response: ChapterDetails) => {
          navigate("/reader", {
            state: {
              mangaId: mangaId,
              chapterId: chapterId,
              title: response.attributes.title,
              volume: response.attributes.volume,
              mangaName: mangaName,
              chapterNumber: chapterNumber,
              externalUrl: response.attributes.externalUrl,
              scanlationGroup:
                response.relationships[0].type === "scanlation_group"
                  ? response.relationships[0].attributes.name
                  : "Unknown",
              coverUrl: coverUrl,
              accountId: accountId,
              chapterIndex: index,
              mangaFeed: mangaFeed,
              pageNumber: pageNumber === null ? null : pageNumber - 1,
            },
          });
        });
      },
    );
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
            {mangaDetails.attributes.title.en}
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
                            handleBookmarkClick(
                              bookmark.id,
                              bookmark.chapterId!,
                              bookmark.chapterNumber!,
                              bookmark.attributes.title.en === undefined
                                ? Object.values(bookmark.attributes.title)[0]
                                : bookmark.attributes.title.en,
                              bookmarkCoverUrls[bookmark.id]!,
                              bookmark.index!,
                              bookmark.bookmarkPageNumber! === 0
                                ? null
                                : bookmark.bookmarkPageNumber!,
                            );
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
            )
          ) : null}
        </div>
      </Dialog>
    </>
  );
};

export default MangaDetailsDialog;
