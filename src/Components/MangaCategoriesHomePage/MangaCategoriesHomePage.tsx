import { useState, useEffect } from "react";
import {
  Manga,
  Relationship,
  MangaTagsInterface,
} from "../../interfaces/MangaDexInterfaces";
import {
  Grid,
  Typography,
  Card,
  CardMedia,
  Button,
  Divider,
} from "@mui/material";
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
    navigate(`/manga/${id}`);
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
        tagId: tagId,
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
          accountId={accountId}
          contentFilter={contentFilter}
        />
      )}
      <div className="category-stack">
        <Typography className="category-stack-name">
          Recently Updated
        </Typography>
        <Grid
          container
          spacing={1}
          columns={{ xs: 12, sm: 12, md: 16, lg: 20, xl: 28 }}
          className="home-category-manga-grid-container"
        >
          {recentlyUpdatedManga.map((current) => (
            <>
              <Grid item className="home-category-manga-grid-item" xs={4}>
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
                      minWidth: "100%",
                      height: "auto",
                    }}
                  >
                    <CardMedia
                      sx={{
                        width: "100%",
                        aspectRatio: "7 / 10",
                      }}
                      image={coverUrlsRecentlyUpdated[current.id]}
                    />
                  </Card>
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
      <Divider
        orientation="vertical"
        className="divider-home"
        variant="middle"
        flexItem
      />
      <div className="category-stack">
        <Typography className="category-stack-name">Recently Added</Typography>
        <Grid
          container
          spacing={1}
          columns={{ xs: 12, sm: 12, md: 16, lg: 20, xl: 28 }}
          className="home-category-manga-grid-container"
        >
          {recentlyAddedManga.map((current) => (
            <>
              <Grid item className="home-category-manga-grid-item" xs={4}>
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
                      minWidth: "100%",
                      height: "auto",
                    }}
                  >
                    <CardMedia
                      sx={{
                        width: "100%",
                        aspectRatio: "7 / 10",
                      }}
                      image={coverUrlsRecentlyAdded[current.id]}
                    />
                  </Card>
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
