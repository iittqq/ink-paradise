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
  fetchSimilarManga,
  fetchMangaCoverBackend,
} from "../../api/MangaDexApi";
import { useNavigate } from "react-router-dom";
import "./MangaCategoriesHomePage.css";

type Props = {
  recentlyUpdatedManga: Manga[];
  recentlyAddedManga: Manga[];
  mangaFromTag?: Manga[];
  tag?: MangaTagsInterface;
  accountId: number | null;
};

const MangaCategoriesHomePage = (props: Props) => {
  const navigate = useNavigate();
  const {
    recentlyUpdatedManga,
    recentlyAddedManga,
    mangaFromTag,
    tag,
    accountId,
  } = props;
  const [coverUrlsRecentlyUpdated, setCoverUrlsRecentlyUpdated] = useState<{
    [key: string]: string;
  }>({});
  const [coverUrlsRecentlyAdded, setCoverUrlsRecentlyAdded] = useState<{
    [key: string]: string;
  }>({});
  const [coverUrlsMangaFromTag, setCoverUrlsMangaFromTag] = useState<{
    [key: string]: string;
  }>({});

  const handleClick = (id: string, coverUrl: string) => {
    const encodedCoverUrl = encodeURIComponent(coverUrl);
    navigate(`/individualView/${id}/${encodedCoverUrl}`, {
      state: { accountId: accountId === null ? null : accountId },
    });
  };

  const handleClickedShowMore = (title: string, manga: Manga[]) => {
    navigate("/mangaCoverList", {
      state: {
        listType: title,
        manga: manga,
        accountId: accountId === null ? null : accountId,
      },
    });
  };

  useEffect(() => {
    const fetchCoverImagesRecentlyUpdated = async () => {
      const coverUrlsRecentlyUpdated: { [key: string]: string } = {};

      for (const manga of recentlyUpdatedManga) {
        const fileName = manga.relationships.find(
          (i: Relationship) => i.type === "cover_art",
        )?.attributes?.fileName;
        if (fileName) {
          const imageBlob = await fetchMangaCoverBackend(manga.id, fileName);
          coverUrlsRecentlyUpdated[manga.id] = URL.createObjectURL(imageBlob);
        }
      }
      setCoverUrlsRecentlyUpdated(coverUrlsRecentlyUpdated);
    };

    const fetchCoverImagesRecentlyAdded = async () => {
      const coverUrlsRecentlyAdded: { [key: string]: string } = {};

      for (const manga of recentlyAddedManga) {
        const fileName = manga.relationships.find(
          (i: Relationship) => i.type === "cover_art",
        )?.attributes?.fileName;
        if (fileName) {
          const imageBlob = await fetchMangaCoverBackend(manga.id, fileName);
          coverUrlsRecentlyAdded[manga.id] = URL.createObjectURL(imageBlob);
        }
      }
      setCoverUrlsRecentlyAdded(coverUrlsRecentlyAdded);
    };

    const fetchCoverImagesMangaFromTag = async () => {
      if (mangaFromTag !== undefined) {
        for (const manga of mangaFromTag) {
          const fileName = manga.relationships.find(
            (i: Relationship) => i.type === "cover_art",
          )?.attributes?.fileName;
          if (fileName) {
            const imageBlob = await fetchMangaCoverBackend(manga.id, fileName);
            const imageUrl = URL.createObjectURL(imageBlob);
            setCoverUrlsMangaFromTag((prevCoverUrls) => {
              return {
                ...prevCoverUrls,
                [manga.id]: imageUrl,
              };
            });
          }
        }
      }
    };

    if (recentlyAddedManga.length > 0) {
      fetchCoverImagesRecentlyAdded();
    }
    if (recentlyUpdatedManga.length > 0) {
      fetchCoverImagesRecentlyUpdated();
    }
    if (mangaFromTag !== undefined) {
      fetchCoverImagesMangaFromTag();
    }
  }, [recentlyUpdatedManga, recentlyAddedManga, mangaFromTag]);

  return (
    <div className="home-category-manga-container">
      {mangaFromTag !== undefined && tag !== undefined ? (
        <Grid container className="home-category-manga-grid-container">
          <Typography className="category-stack-name">
            {tag.attributes.name.en}
          </Typography>
          {mangaFromTag.map((current) => (
            <>
              <Grid item className="home-category-manga-grid-item">
                {" "}
                <Button
                  disableRipple
                  className="home-category-manga-button"
                  onClick={() => {
                    handleClick(current.id, coverUrlsMangaFromTag[current.id]);
                  }}
                >
                  {" "}
                  <Card
                    sx={{
                      width: "80px",
                      height: "110px",
                    }}
                  >
                    <CardMedia
                      sx={{
                        width: "100%",
                        height: "100%",
                      }}
                      image={coverUrlsMangaFromTag[current.id]}
                    />
                  </Card>
                  <div className="home-category-manga-text">
                    <Typography>
                      {current.attributes.title.en === undefined
                        ? Object.values(current.attributes.title)[0]
                        : current.attributes.title.en}
                    </Typography>
                  </div>
                </Button>{" "}
              </Grid>{" "}
              <Divider variant="fullWidth" className="divider" />
            </>
          ))}
          <Button
            className="more-button"
            onClick={() => {
              fetchSimilarManga(50, [tag.id]).then((data: Manga[]) => {
                handleClickedShowMore(tag.attributes.name.en, data);
              });
            }}
          >
            Show More
          </Button>
        </Grid>
      ) : null}
      <Grid container className="home-category-manga-grid-container">
        <Typography className="category-stack-name">
          Recently Updated
        </Typography>
        {recentlyUpdatedManga.map((current) => (
          <>
            <Grid item className="home-category-manga-grid-item">
              <Button
                className="home-category-manga-button"
                onClick={() => {
                  handleClick(current.id, coverUrlsRecentlyUpdated[current.id]);
                }}
              >
                <Card
                  sx={{
                    width: "80px",
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
                  <Typography>
                    {current.attributes.title.en === undefined
                      ? Object.values(current.attributes.title)[0]
                      : current.attributes.title.en}
                  </Typography>
                </div>
              </Button>
            </Grid>
            <Divider variant="fullWidth" className="divider" />
          </>
        ))}
        <Button
          className="more-button"
          onClick={() => {
            fetchRecentlyUpdated(50, 0).then((data: Manga[]) => {
              handleClickedShowMore("Recently Updated", data);
            });
          }}
        >
          Show More
        </Button>
      </Grid>
      <Grid container className="home-category-manga-grid-container">
        <Typography className="category-stack-name"> Recently Added</Typography>
        {recentlyAddedManga.map((current) => (
          <>
            <Grid item className="home-category-manga-grid-item">
              <Button
                className="home-category-manga-button"
                onClick={() => {
                  handleClick(current.id, coverUrlsRecentlyAdded[current.id]);
                }}
              >
                <Card
                  sx={{
                    width: "80px",
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
                  <Typography>
                    {current.attributes.title.en === undefined
                      ? Object.values(current.attributes.title)[0]
                      : current.attributes.title.en}
                  </Typography>
                </div>
              </Button>
            </Grid>
            <Divider variant="fullWidth" className="divider" />
          </>
        ))}
        <Button
          className="more-button"
          onClick={() => {
            fetchRecentlyAdded(50, 0).then((data: Manga[]) => {
              handleClickedShowMore("Recently Updated", data);
            });
          }}
        >
          Show More
        </Button>
      </Grid>
    </div>
  );
};

export default MangaCategoriesHomePage;
