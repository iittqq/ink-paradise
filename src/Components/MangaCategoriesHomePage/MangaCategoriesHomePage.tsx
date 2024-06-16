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
import { useNavigate } from "react-router-dom";
import "./MangaCategoriesHomePage.css";

type Props = {
  recentlyUpdatedManga: Manga[];
  recentlyAddedManga: Manga[];
  mangaFromTag?: Manga[];
  tag?: MangaTagsInterface;
};

const MangaCategoriesHomePage = (props: Props) => {
  const navigate = useNavigate();
  const { recentlyUpdatedManga, recentlyAddedManga, mangaFromTag, tag } = props;
  const handleClick = (id: string, coverUrl: string) => {
    navigate("/individualView", {
      state: { id: id, coverUrl: coverUrl },
    });
  };

  return (
    <div className="home-category-manga-container">
      <Grid container className="home-category-manga-grid-container">
        <Typography className="category-stack-name">
          {" "}
          Recently Updated
        </Typography>
        {recentlyUpdatedManga.map((current) => (
          <>
            <Grid item className="home-category-manga-grid-item">
              <Button
                className="home-category-manga-button"
                onClick={() => {
                  handleClick(
                    current.id,
                    "https://uploads.mangadex.org/covers/" +
                      current.id +
                      "/" +
                      current.relationships.find(
                        (i: Relationship) => i.type === "cover_art",
                      )?.attributes?.fileName,
                  );
                }}
              >
                <Card
                  sx={{
                    width: {
                      xs: "140px",
                      sm: "180px",
                      md: "180px",
                      lg: "80px",
                    },
                    height: {
                      xs: "200px",
                      sm: "250px",
                      md: "250px",
                      lg: "100px",
                    },
                    position: "relative",
                  }}
                >
                  <CardMedia
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                    image={
                      "https://uploads.mangadex.org/covers/" +
                      current.id +
                      "/" +
                      current.relationships.find(
                        (i: Relationship) => i.type === "cover_art",
                      )?.attributes?.fileName
                    }
                  />
                </Card>
              </Button>
              <div className="home-category-manga-text">
                <Typography>{current.attributes.title.en}</Typography>
              </div>
            </Grid>
            <Divider variant="fullWidth" className="divider" />
          </>
        ))}
        <Button className="more-button"> Show More</Button>{" "}
      </Grid>
      <Grid container className="home-category-manga-grid-container">
        <Typography className="category-stack-name"> Recently Added</Typography>
        {recentlyAddedManga.map((current) => (
          <>
            <Grid item className="home-category-manga-grid-item">
              <Button
                className="home-category-manga-button"
                onClick={() => {
                  handleClick(
                    current.id,
                    "https://uploads.mangadex.org/covers/" +
                      current.id +
                      "/" +
                      current.relationships.find(
                        (i: Relationship) => i.type === "cover_art",
                      )?.attributes?.fileName,
                  );
                }}
              >
                <Card
                  sx={{
                    width: {
                      xs: "140px",
                      sm: "180px",
                      md: "180px",
                      lg: "80px",
                    },
                    height: {
                      xs: "200px",
                      sm: "250px",
                      md: "250px",
                      lg: "100px",
                    },
                    position: "relative",
                  }}
                >
                  <CardMedia
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                    image={
                      "https://uploads.mangadex.org/covers/" +
                      current.id +
                      "/" +
                      current.relationships.find(
                        (i: Relationship) => i.type === "cover_art",
                      )?.attributes?.fileName
                    }
                  />
                </Card>
              </Button>
              <div className="home-category-manga-text">
                <Typography>{current.attributes.title.en}</Typography>
              </div>{" "}
            </Grid>
            <Divider variant="fullWidth" className="divider" />
          </>
        ))}
        <Button className="more-button"> Show More</Button>{" "}
      </Grid>
      {mangaFromTag !== undefined && tag !== undefined ? (
        <Grid container className="home-category-manga-grid-container">
          <Typography className="category-stack-name">
            {tag.attributes.name.en}
          </Typography>
          {mangaFromTag.map((current) => (
            <>
              <Grid item className="home-category-manga-grid-item">
                <Button
                  className="home-category-manga-button"
                  onClick={() => {
                    handleClick(
                      current.id,
                      "https://uploads.mangadex.org/covers/" +
                        current.id +
                        "/" +
                        current.relationships.find(
                          (i: Relationship) => i.type === "cover_art",
                        )?.attributes?.fileName,
                    );
                  }}
                >
                  <Card
                    sx={{
                      width: {
                        xs: "140px",
                        sm: "180px",
                        md: "180px",
                        lg: "80px",
                      },
                      height: {
                        xs: "200px",
                        sm: "250px",
                        md: "250px",
                        lg: "100px",
                      },
                      position: "relative",
                    }}
                  >
                    <CardMedia
                      sx={{
                        width: "100%",
                        height: "100%",
                      }}
                      image={
                        "https://uploads.mangadex.org/covers/" +
                        current.id +
                        "/" +
                        current.relationships.find(
                          (i: Relationship) => i.type === "cover_art",
                        )?.attributes?.fileName
                      }
                    />
                  </Card>
                </Button>
                <div className="home-category-manga-text">
                  <Typography>{current.attributes.title.en}</Typography>
                </div>{" "}
              </Grid>
              <Divider variant="fullWidth" className="divider" />
            </>
          ))}
          <Button className="more-button"> Show More</Button>{" "}
        </Grid>
      ) : null}
    </div>
  );
};

export default MangaCategoriesHomePage;
