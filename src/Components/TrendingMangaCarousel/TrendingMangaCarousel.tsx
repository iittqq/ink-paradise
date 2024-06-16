import "./TrendingMangaCarousel.css";
import { Manga, Relationship } from "../../interfaces/MangaDexInterfaces";
import { Grid, Button, Card, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useHorizontalScroll } from "./HorizontalScroll";

type Props = { manga: Manga[] };

const TrendingMangaCarousel = (props: Props) => {
  const scrollRef = useHorizontalScroll();
  const { manga } = props;
  const navigate = useNavigate();

  const handleClick = (id: string, coverUrl: string) => {
    navigate("/individualView", {
      state: { id: id, coverUrl: coverUrl },
    });
  };

  return (
    <div ref={scrollRef} className="popular-carousel-container">
      <Grid container className="popular-carousel-grid" wrap="nowrap">
        {manga.map((current: Manga, index: number) => (
          <Grid item className="popular-carousel-grid-item">
            <div className="popular-carousel-grid-item-text-container">
              {" "}
              <Typography className="popular-carousel-grid-item-title">
                {current.attributes.title.en}
              </Typography>
              <Typography className="popular-carousel-grid-item-rank">
                {index + 1}
              </Typography>{" "}
            </div>
            <Button
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
                  width: { xs: "140px", sm: "180px", md: "180px", lg: "180px" },
                  height: {
                    xs: "200px",
                    sm: "250px",
                    md: "250px",
                    lg: "250px",
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
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default TrendingMangaCarousel;
