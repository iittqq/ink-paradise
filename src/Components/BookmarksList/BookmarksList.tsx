import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Button } from "@mui/material";
import { ChapterDetails, Manga } from "../../interfaces/MangaDexInterfaces";
import MangaClickable from "../MangaClickable/MangaClickable";
import {
  fetchChapterDetails,
  fetchMangaCoverBackend,
} from "../../api/MangaDexApi";
import "./BookmarksList.css";

type Props = {
  bookmarks: Manga[];
  bookmarksToDelete: number[];
  handleBookmarkEntryClick: (bookmarkId: number) => void;
  checked: boolean;
};

const BookmarksList = (props: Props) => {
  const { bookmarks, bookmarksToDelete, handleBookmarkEntryClick, checked } =
    props;
  const [bookmarkCoverUrls, setBookmarkCoverUrls] = useState<{
    [key: string]: string;
  }>({});
  const navigate = useNavigate();

  const handleBookmarkClick = (
    mangaId: string,
    chapterId: string,
    mangaName: string,
    coverUrl: string,
  ) => {
    console.log(chapterId);
    fetchChapterDetails(chapterId).then((response: ChapterDetails) => {
      console.log(response);
      navigate("/reader", {
        state: {
          mangaId: mangaId,
          chapterId: chapterId,
          title: response.attributes.title,
          volume: response.attributes.volume,
          chapter: response.attributes.chapter,
          mangaName: mangaName,
          chapterNumber: response.attributes.chapter,
          externalUrl: response.attributes.externalUrl,
          scanlationGroup:
            response.relationships[0].type === "scanlation_group"
              ? response.relationships[0].attributes.name
              : "Unknown",
          coverUrl: coverUrl,
        },
      });
    });
  };

  useEffect(() => {
    const fetchCoverImages = async () => {
      const coverUrls: { [key: string]: string } = {};
      for (const manga of bookmarks) {
        const fileName = manga.relationships.find((i) => i.type === "cover_art")
          ?.attributes?.fileName;
        if (fileName) {
          const imageBlob = await fetchMangaCoverBackend(manga.id, fileName);
          coverUrls[manga.id] = URL.createObjectURL(imageBlob);
        }
      }
      setBookmarkCoverUrls(coverUrls);
    };
    if (bookmarks.length > 0) {
      fetchCoverImages();
    }
  }, [bookmarks]);

  return (
    <div>
      <Grid
        container
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {bookmarks.length === 0 ? (
          <Button
            className="redirect-button"
            onClick={() => {
              navigate("/");
            }}
          >
            <Typography fontFamily="Figtree">Start Browsing</Typography>
          </Button>
        ) : null}
        {bookmarks.map((manga: Manga) => (
          <Grid item>
            <div className="chapter-number-overlay">{manga.chapterNumber}</div>
            <Button
              className="manga-entry-overlay-button"
              onClick={() => {
                console.log(manga);
                checked
                  ? handleBookmarkEntryClick(manga.bookmarkId!)
                  : handleBookmarkClick(
                      manga.id,
                      manga.chapterId!,
                      manga.attributes.title.en,
                      bookmarkCoverUrls[manga.id]!,
                    );
              }}
              sx={{
                opacity: bookmarksToDelete.includes(manga.bookmarkId!)
                  ? 0.2
                  : 1,
              }}
            >
              <MangaClickable
                id={manga.id}
                title={manga.attributes.title.en}
                coverUrl={bookmarkCoverUrls[manga.id]}
                updatedAt={manga.attributes.updatedAt}
                disabled={true}
              />
            </Button>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default BookmarksList;
