import "./TrendingMangaCarousel.css";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import { Grid, Button, Card, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = { manga: Manga[]; coverFiles: string[] };

const TrendingMangaCarousel = (props: Props) => {
  const { manga, coverFiles } = props;
  const navigate = useNavigate();

  const handleClick = (id: string, coverFile: string) => {
    navigate("/individualView", {
      state: { id: id, coverFile: coverFile },
    });
  };

  return (
    <div>
      <Grid container className="popular-carousel-grid">
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
                handleClick(current.id, coverFiles[index]);
              }}
            >
              <Card
                sx={{
                  width: { xs: "150px", sm: "200px", md: "200px", lg: "200px" },
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
                  image={coverFiles[index]}
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
