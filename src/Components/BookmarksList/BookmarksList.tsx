import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Button } from "@mui/material";
import {
  ChapterDetails,
  Manga,
  MangaFeedScanlationGroup,
} from "../../interfaces/MangaDexInterfaces";
import MangaClickable from "../MangaClickable/MangaClickable";
import {
  fetchChapterDetails,
  fetchMangaCoverBackend,
  fetchMangaFeed,
} from "../../api/MangaDexApi";
import "./BookmarksList.css";

type Props = {
  bookmarks: Manga[];
  bookmarksToDelete: number[];
  handleBookmarkEntryClick: (bookmarkId: number) => void;
  checked: boolean;
  accountId: number;
  groupedBookmarks: Manga[][] | null;
  contentFilter: string;
};

const BookmarksList = (props: Props) => {
  const {
    bookmarks,
    bookmarksToDelete,
    handleBookmarkEntryClick,
    checked,
    accountId,
    groupedBookmarks,
    contentFilter,
  } = props;
  const [bookmarkCoverUrls, setBookmarkCoverUrls] = useState<{
    [key: string]: string;
  }>({});
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchCoverImages = async () => {
      // Flatten grouped bookmarks into a single array if groupedBookmarks exist, otherwise use bookmarks directly
      const allBookmarks = groupedBookmarks
        ? groupedBookmarks.flat()
        : bookmarks;

      for (const manga of allBookmarks) {
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

    // Only fetch if we have either bookmarks or groupedBookmarks
    if (
      (bookmarks && bookmarks.length > 0) ||
      (groupedBookmarks && groupedBookmarks.length > 0)
    ) {
      fetchCoverImages();
    }
  }, [bookmarks, groupedBookmarks]);

  return (
    <div>
      {bookmarks.length === 0 ? null : (
        <Typography
          fontFamily={"Figtree"}
          sx={{ textAlign: "center", paddingBottom: "5px" }}
        >
          {" "}
          Continue Reading
        </Typography>
      )}
      <Grid
        container
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        wrap={"wrap"}
        spacing={1}
      >
        {bookmarks.length === 0 && groupedBookmarks?.length === 0 ? (
          <Button
            className="redirect-button"
            onClick={() => {
              navigate("/");
            }}
          >
            <Typography fontFamily="Figtree">Start Browsing</Typography>
          </Button>
        ) : null}
        {groupedBookmarks !== null
          ? contentFilter === "Content Rating"
            ? groupedBookmarks.map((manga: Manga[]) => (
                <>
                  <Typography
                    fontFamily={"Figtree"}
                    sx={{
                      paddingTop: "5px",
                      width: "100%",
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {manga[0].attributes.contentRating}
                  </Typography>
                  {manga.map((manga: Manga) =>
                    manga.bookmarkContinueReading === true ? (
                      <Grid item className="bookmark-overlay-grid-item">
                        <div className="chapter-number-overlay">
                          <div className="bookmark-details-column">
                            <Typography className="overlay-text-bookmark">
                              Chapter: {manga.chapterNumber}
                            </Typography>
                          </div>
                        </div>

                        <Button
                          className="manga-entry-overlay-button"
                          onClick={() => {
                            checked
                              ? handleBookmarkEntryClick(manga.bookmarkId!)
                              : handleBookmarkClick(
                                  manga.id,
                                  manga.chapterId!,
                                  manga.chapterNumber!,
                                  manga.attributes.title.en === undefined
                                    ? Object.values(manga.attributes.title)[0]
                                    : manga.attributes.title.en,
                                  bookmarkCoverUrls[manga.id]!,
                                  manga.index!,
                                  manga.bookmarkPageNumber! === 0
                                    ? null
                                    : manga.bookmarkPageNumber!,
                                );
                          }}
                          sx={{
                            opacity: bookmarksToDelete.includes(
                              manga.bookmarkId!,
                            )
                              ? 0.2
                              : 1,
                          }}
                        >
                          <MangaClickable
                            manga={manga}
                            id={manga.id}
                            title={
                              manga.attributes.title.en === undefined
                                ? Object.values(manga.attributes.title)[0]
                                : manga.attributes.title.en
                            }
                            coverUrl={bookmarkCoverUrls[manga.id]}
                            disabled={true}
                            accountId={accountId}
                          />
                        </Button>
                      </Grid>
                    ) : null,
                  )}
                </>
              ))
            : groupedBookmarks.map((manga: Manga[]) => (
                <>
                  <Typography
                    fontFamily={"Figtree"}
                    sx={{
                      paddingTop: "5px",
                      width: "100%",
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {manga[0].attributes.publicationDemographic !== null
                      ? manga[0].attributes.publicationDemographic
                      : "unknown"}
                  </Typography>
                  {manga.map((manga: Manga) =>
                    manga.bookmarkContinueReading === true ? (
                      <Grid item className="bookmark-overlay-grid-item">
                        <div className="chapter-number-overlay">
                          <div className="bookmark-details-column">
                            <Typography className="overlay-text-bookmark">
                              Chapter: {manga.chapterNumber}
                            </Typography>
                          </div>
                        </div>

                        <Button
                          className="manga-entry-overlay-button"
                          onClick={() => {
                            checked
                              ? handleBookmarkEntryClick(manga.bookmarkId!)
                              : handleBookmarkClick(
                                  manga.id,
                                  manga.chapterId!,
                                  manga.chapterNumber!,
                                  manga.attributes.title.en === undefined
                                    ? Object.values(manga.attributes.title)[0]
                                    : manga.attributes.title.en,
                                  bookmarkCoverUrls[manga.id]!,
                                  manga.index!,
                                  manga.bookmarkPageNumber! === 0
                                    ? null
                                    : manga.bookmarkPageNumber!,
                                );
                          }}
                          sx={{
                            opacity: bookmarksToDelete.includes(
                              manga.bookmarkId!,
                            )
                              ? 0.2
                              : 1,
                          }}
                        >
                          <MangaClickable
                            manga={manga}
                            id={manga.id}
                            title={
                              manga.attributes.title.en === undefined
                                ? Object.values(manga.attributes.title)[0]
                                : manga.attributes.title.en
                            }
                            coverUrl={bookmarkCoverUrls[manga.id]}
                            disabled={true}
                            accountId={accountId}
                          />
                        </Button>
                      </Grid>
                    ) : null,
                  )}
                </>
              ))
          : bookmarks.map((manga: Manga) =>
              manga.bookmarkContinueReading === true ? (
                <Grid item className="bookmark-overlay-grid-item">
                  <div className="chapter-number-overlay">
                    <div className="bookmark-details-column">
                      <Typography className="overlay-text-bookmark">
                        Chapter: {manga.chapterNumber}
                      </Typography>
                    </div>
                  </div>
                  <Button
                    className="manga-entry-overlay-button"
                    onClick={() => {
                      checked
                        ? handleBookmarkEntryClick(manga.bookmarkId!)
                        : handleBookmarkClick(
                            manga.id,
                            manga.chapterId!,
                            manga.chapterNumber!,
                            manga.attributes.title.en === undefined
                              ? Object.values(manga.attributes.title)[0]
                              : manga.attributes.title.en,
                            bookmarkCoverUrls[manga.id]!,
                            manga.index!,
                            manga.bookmarkPageNumber! === 0
                              ? null
                              : manga.bookmarkPageNumber!,
                          );
                    }}
                    sx={{
                      opacity: bookmarksToDelete.includes(manga.bookmarkId!)
                        ? 0.2
                        : 1,
                    }}
                  >
                    <MangaClickable
                      manga={manga}
                      id={manga.id}
                      title={
                        manga.attributes.title.en === undefined
                          ? Object.values(manga.attributes.title)[0]
                          : manga.attributes.title.en
                      }
                      coverUrl={bookmarkCoverUrls[manga.id]}
                      disabled={true}
                      accountId={accountId}
                    />
                  </Button>
                </Grid>
              ) : null,
            )}
      </Grid>
      {bookmarks.length === 0 ? null : (
        <Typography
          fontFamily={"Figtree"}
          sx={{ textAlign: "center", paddingTop: "5px", paddingBottom: "5px" }}
        >
          {" "}
          Custom Bookmarks
        </Typography>
      )}
      <Grid
        container
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        wrap={"wrap"}
        spacing={1}
      >
        {groupedBookmarks !== null
          ? contentFilter === "Content Rating"
            ? groupedBookmarks.map((manga: Manga[]) => (
                <>
                  <Typography
                    fontFamily={"Figtree"}
                    sx={{
                      paddingTop: "5px",
                      width: "100%",
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {manga[0].attributes.contentRating}
                  </Typography>
                  {manga.map((manga: Manga) =>
                    manga.bookmarkContinueReading === false ? (
                      <Grid item className="bookmark-overlay-grid-item">
                        <div className="chapter-number-overlay">
                          <div className="bookmark-details-column">
                            <Typography className="overlay-text-bookmark">
                              Chapter: {manga.chapterNumber}
                            </Typography>

                            <div className="page-number-overlay">
                              <Typography className="overlay-text-bookmark">
                                Page: {manga.bookmarkPageNumber}
                              </Typography>
                            </div>
                          </div>
                        </div>

                        <Button
                          className="manga-entry-overlay-button"
                          onClick={() => {
                            checked
                              ? handleBookmarkEntryClick(manga.bookmarkId!)
                              : handleBookmarkClick(
                                  manga.id,
                                  manga.chapterId!,
                                  manga.chapterNumber!,
                                  manga.attributes.title.en === undefined
                                    ? Object.values(manga.attributes.title)[0]
                                    : manga.attributes.title.en,
                                  bookmarkCoverUrls[manga.id]!,
                                  manga.index!,
                                  manga.bookmarkPageNumber! === 0
                                    ? null
                                    : manga.bookmarkPageNumber!,
                                );
                          }}
                          sx={{
                            opacity: bookmarksToDelete.includes(
                              manga.bookmarkId!,
                            )
                              ? 0.2
                              : 1,
                          }}
                        >
                          <MangaClickable
                            manga={manga}
                            id={manga.id}
                            title={
                              manga.attributes.title.en === undefined
                                ? Object.values(manga.attributes.title)[0]
                                : manga.attributes.title.en
                            }
                            coverUrl={bookmarkCoverUrls[manga.id]}
                            disabled={true}
                            accountId={accountId}
                          />
                        </Button>
                      </Grid>
                    ) : null,
                  )}
                </>
              ))
            : groupedBookmarks.map((manga: Manga[]) => (
                <>
                  <Typography
                    fontFamily={"Figtree"}
                    sx={{
                      paddingTop: "5px",
                      width: "100%",
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {manga[0].attributes.publicationDemographic !== null
                      ? manga[0].attributes.publicationDemographic
                      : "unknown"}
                  </Typography>
                  {manga.map((manga: Manga) =>
                    manga.bookmarkContinueReading === false ? (
                      <Grid item className="bookmark-overlay-grid-item">
                        <div className="chapter-number-overlay">
                          <div className="bookmark-details-column">
                            <Typography className="overlay-text-bookmark">
                              Chapter: {manga.chapterNumber}
                            </Typography>

                            <div className="page-number-overlay">
                              <Typography className="overlay-text-bookmark">
                                Page: {manga.bookmarkPageNumber}
                              </Typography>
                            </div>
                          </div>
                        </div>
                        <Button
                          className="manga-entry-overlay-button"
                          onClick={() => {
                            checked
                              ? handleBookmarkEntryClick(manga.bookmarkId!)
                              : handleBookmarkClick(
                                  manga.id,
                                  manga.chapterId!,
                                  manga.chapterNumber!,
                                  manga.attributes.title.en === undefined
                                    ? Object.values(manga.attributes.title)[0]
                                    : manga.attributes.title.en,
                                  bookmarkCoverUrls[manga.id]!,
                                  manga.index!,
                                  manga.bookmarkPageNumber! === 0
                                    ? null
                                    : manga.bookmarkPageNumber!,
                                );
                          }}
                          sx={{
                            opacity: bookmarksToDelete.includes(
                              manga.bookmarkId!,
                            )
                              ? 0.2
                              : 1,
                          }}
                        >
                          <MangaClickable
                            manga={manga}
                            id={manga.id}
                            title={
                              manga.attributes.title.en === undefined
                                ? Object.values(manga.attributes.title)[0]
                                : manga.attributes.title.en
                            }
                            coverUrl={bookmarkCoverUrls[manga.id]}
                            disabled={true}
                            accountId={accountId}
                          />
                        </Button>
                      </Grid>
                    ) : null,
                  )}
                </>
              ))
          : bookmarks.map((manga: Manga) =>
              manga.bookmarkContinueReading === false ? (
                <Grid item className="bookmark-overlay-grid-item">
                  <div className="chapter-number-overlay">
                    <div className="bookmark-details-column">
                      <Typography className="overlay-text-bookmark">
                        Chapter: {manga.chapterNumber}
                      </Typography>

                      <div className="page-number-overlay">
                        <Typography className="overlay-text-bookmark">
                          Page: {manga.bookmarkPageNumber}
                        </Typography>{" "}
                      </div>
                    </div>
                  </div>
                  <Button
                    className="manga-entry-overlay-button"
                    onClick={() => {
                      checked
                        ? handleBookmarkEntryClick(manga.bookmarkId!)
                        : handleBookmarkClick(
                            manga.id,
                            manga.chapterId!,
                            manga.chapterNumber!,
                            manga.attributes.title.en === undefined
                              ? Object.values(manga.attributes.title)[0]
                              : manga.attributes.title.en,
                            bookmarkCoverUrls[manga.id]!,
                            manga.index!,
                            manga.bookmarkPageNumber! === 0
                              ? null
                              : manga.bookmarkPageNumber!,
                          );
                    }}
                    sx={{
                      opacity: bookmarksToDelete.includes(manga.bookmarkId!)
                        ? 0.2
                        : 1,
                    }}
                  >
                    <MangaClickable
                      manga={manga}
                      id={manga.id}
                      title={
                        manga.attributes.title.en === undefined
                          ? Object.values(manga.attributes.title)[0]
                          : manga.attributes.title.en
                      }
                      coverUrl={bookmarkCoverUrls[manga.id]}
                      disabled={true}
                      accountId={accountId}
                    />
                  </Button>
                </Grid>
              ) : null,
            )}
      </Grid>
    </div>
  );
};

export default BookmarksList;
