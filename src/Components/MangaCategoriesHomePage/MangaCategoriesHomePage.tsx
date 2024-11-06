import { useState, useEffect } from "react";
import {
  Manga,
  Relationship,
  MangaTagsInterface,
} from "../../interfaces/MangaDexInterfaces";
import { Grid, Typography, Card, CardMedia, Button } from "@mui/material";
import {
  fetchRecentlyUpdated,
  fetchRecentlyAdded,
  fetchMangaCoverBackend,
} from "../../api/MangaDexApi";
import { useNavigate } from "react-router-dom";
import MangaDetailsDialog from "../MangaDetailsDialog/MangaDetailsDialog";
import "./MangaCategoriesHomePage.css";

type Props = {
  recentlyUpdatedManga: Manga[];
  recentlyAddedManga: Manga[];
  tag?: MangaTagsInterface;
  accountId: number | null;
  contentFilter: number;
};

const MangaCategoriesHomePage = (props: Props) => {
  const navigate = useNavigate();
  const { recentlyUpdatedManga, recentlyAddedManga, accountId, contentFilter } =
    props;
  const [coverUrlsRecentlyUpdated, setCoverUrlsRecentlyUpdated] = useState<{
    [key: string]: string;
  }>({});
  const [coverUrlsRecentlyAdded, setCoverUrlsRecentlyAdded] = useState<{
    [key: string]: string;
  }>({});
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [mangaDetailsToDisplay, setMangaDetailsToDisplay] = useState<Manga>();
  const [mangaCoverToDisplay, setMangaCoverToDisplay] = useState<string>();

  const handleClick = (id: string) => {
    navigate(`/manga/${id}`, {
      state: { accountId: accountId === null ? null : accountId },
    });
  };

  const handleClickedShowMore = (
    title: string,
    manga: Manga[],
    tagId?: string,
  ) => {
    navigate("/mangaCoverList", {
      state: {
        listType: title,
        manga: manga,
        accountId: accountId === null ? null : accountId,
        tagId: tagId,
        contentFilter: contentFilter,
      },
    });
  };

  const handleDetailsDialogClose = () => {
    setOpenDetailsDialog(false);
  };

  const handleMangaClicked = (manga: Manga, cover: string) => {
    setOpenDetailsDialog(true);
    setMangaDetailsToDisplay(manga);
    setMangaCoverToDisplay(cover);
  };

  useEffect(() => {
    const fetchCoverImagesRecentlyUpdated = async () => {
      for (const manga of recentlyUpdatedManga) {
        const fileName = manga.relationships.find(
          (i: Relationship) => i.type === "cover_art",
        )?.attributes?.fileName;
        if (fileName) {
          const imageBlob = await fetchMangaCoverBackend(manga.id, fileName);
          setCoverUrlsRecentlyUpdated((prevCoverUrlsRecentlyUpdated) => ({
            ...prevCoverUrlsRecentlyUpdated,
            [manga.id]: URL.createObjectURL(imageBlob),
          }));
        }
      }
    };

    const fetchCoverImagesRecentlyAdded = async () => {
      for (const manga of recentlyAddedManga) {
        const fileName = manga.relationships.find(
          (i: Relationship) => i.type === "cover_art",
        )?.attributes?.fileName;
        if (fileName) {
          const imageBlob = await fetchMangaCoverBackend(manga.id, fileName);
          setCoverUrlsRecentlyAdded((prevCoverUrlsRecentlyAdded) => ({
            ...prevCoverUrlsRecentlyAdded,
            [manga.id]: URL.createObjectURL(imageBlob),
          }));
        }
      }
    };

    if (recentlyAddedManga.length > 0) {
      fetchCoverImagesRecentlyAdded();
    }
    if (recentlyUpdatedManga.length > 0) {
      fetchCoverImagesRecentlyUpdated();
    }
  }, [recentlyUpdatedManga, recentlyAddedManga]);

  return (
    <div className="home-category-manga-container">
      {mangaDetailsToDisplay && (
        <MangaDetailsDialog
          mangaDetails={mangaDetailsToDisplay}
          openDetailsDialog={openDetailsDialog}
          handleDetailsDialogClose={handleDetailsDialogClose}
          coverUrl={mangaCoverToDisplay!}
          handleClick={handleClick}
        />
      )}
      <div className="category-stack">
        <Typography className="category-stack-name">
          Recently Updated
        </Typography>
        <Grid
          container
          spacing={1}
          className="home-category-manga-grid-container"
        >
          {recentlyUpdatedManga.map((current) => (
            <>
              <Grid item className="home-category-manga-grid-item">
                <Button
                  className="home-category-manga-button"
                  onClick={() => {
                    handleMangaClicked(
                      current,
                      coverUrlsRecentlyUpdated[current.id],
                    );
                  }}
                >
                  <Card
                    sx={{
                      minWidth: "80px",
                      height: "110px",
                    }}
                  >
                    <CardMedia
                      sx={{
                        width: "100%",
                        height: "100%",
                      }}
                      image={coverUrlsRecentlyUpdated[current.id]}
                    />
                  </Card>
                  <div className="home-category-manga-text">
                    <Typography className="home-category-manga-name">
                      {current.attributes.title.en === undefined
                        ? Object.values(current.attributes.title)[0]
                        : current.attributes.title.en}
                    </Typography>
                    <Typography className="home-category-manga-details">
                      {current.attributes.status}
                    </Typography>
                    <Typography className="home-category-manga-details">
                      {current.attributes.contentRating}
                    </Typography>
                  </div>
                </Button>
              </Grid>
            </>
          ))}
        </Grid>
        <Button
          className="more-button"
          onClick={() => {
            fetchRecentlyUpdated(100, 0, contentFilter).then(
              (data: Manga[]) => {
                handleClickedShowMore("Recently Updated", data);
              },
            );
          }}
        >
          Show More
        </Button>
      </div>
      <div className="category-stack">
        <Typography className="category-stack-name"> Recently Added</Typography>
        <Grid
          container
          spacing={1}
          className="home-category-manga-grid-container"
        >
          {recentlyAddedManga.map((current) => (
            <>
              <Grid item className="home-category-manga-grid-item">
                <Button
                  className="home-category-manga-button"
                  onClick={() => {
                    handleMangaClicked(
                      current,
                      coverUrlsRecentlyAdded[current.id],
                    );
                  }}
                >
                  <Card
                    sx={{
                      minWidth: "80px",
                      height: "110px",
                    }}
                  >
                    <CardMedia
                      sx={{
                        width: "100%",
                        height: "100%",
                      }}
                      image={coverUrlsRecentlyAdded[current.id]}
                    />
                  </Card>
                  <div className="home-category-manga-text">
                    <Typography className="home-category-manga-name">
                      {current.attributes.title.en === undefined
                        ? Object.values(current.attributes.title)[0]
                        : current.attributes.title.en}
                    </Typography>
                    <Typography className="home-category-manga-details">
                      {current.attributes.status}
                    </Typography>
                    <Typography className="home-category-manga-details">
                      {current.attributes.contentRating}
                    </Typography>
                  </div>
                </Button>
              </Grid>
            </>
          ))}
        </Grid>
        <Button
          className="more-button"
          onClick={() => {
            fetchRecentlyAdded(100, 0, contentFilter).then((data: Manga[]) => {
              handleClickedShowMore("Recently Added", data);
            });
          }}
        >
          Show More
        </Button>
      </div>
    </div>
  );
};

export default MangaCategoriesHomePage;
