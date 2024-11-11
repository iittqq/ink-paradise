import "./TrendingMangaCarousel.css";
import { Manga, Relationship } from "../../interfaces/MangaDexInterfaces";
import { Grid, Button, Card, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useHorizontalScroll } from "./HorizontalScroll";
import { useEffect, useState } from "react";
import { fetchMangaCoverBackend } from "../../api/MangaDexApi";
import MangaDetailsDialog from "../MangaDetailsDialog/MangaDetailsDialog";

type Props = { manga: Manga[]; accountId: number | null };

const TrendingMangaCarousel = (props: Props) => {
  const scrollRef = useHorizontalScroll();
  const { manga, accountId } = props;
  const [coverUrls, setCoverUrls] = useState<{ [key: string]: string }>({});
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [mangaDetailsToDisplay, setMangaDetailsToDisplay] = useState<Manga>();
  const [mangaCoverToDisplay, setMangaCoverToDisplay] = useState<string>();
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate(`/manga/${id}`, {
      state: { accountId: accountId === null ? null : accountId },
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
    const fetchCoverImages = async () => {
      for (const mangaCurrent of manga) {
        const fileName = mangaCurrent.relationships.find(
          (i: Relationship) => i.type === "cover_art",
        )?.attributes?.fileName;
        if (fileName) {
          const imageBlob = await fetchMangaCoverBackend(
            mangaCurrent.id,
            fileName,
          );
          const imageUrl = URL.createObjectURL(imageBlob);
          setCoverUrls((prevCoverUrls) => ({
            ...prevCoverUrls,
            [mangaCurrent.id]: imageUrl,
          }));
        }
      }
    };
    if (manga.length > 0) {
      fetchCoverImages();
    }
  }, [manga]);

  return (
    <div ref={scrollRef} className="popular-carousel-container">
      <>
        {mangaDetailsToDisplay && (
          <MangaDetailsDialog
            mangaDetails={mangaDetailsToDisplay}
            openDetailsDialog={openDetailsDialog}
            handleDetailsDialogClose={handleDetailsDialogClose}
            coverUrl={mangaCoverToDisplay!}
            handleClick={handleClick}
            accountId={accountId}
          />
        )}
      </>
      <Grid
        container
        spacing={1}
        className="popular-carousel-grid"
        wrap="nowrap"
      >
        <Grid item />
        {manga.map((current: Manga, index: number) => (
          <Grid item className="popular-carousel-grid-item">
            <div className="popular-carousel-grid-item-text-container">
              <Typography className="popular-carousel-grid-item-title">
                {current.attributes.title.en === undefined
                  ? Object.values(current.attributes.title)[0]
                  : current.attributes.title.en}
              </Typography>
              <Typography className="popular-carousel-grid-item-rank">
                {index + 1}
              </Typography>
            </div>
            <Button
              disableRipple
              className="manga-button-trending-carousel"
              onClick={() => {
                handleMangaClicked(current, coverUrls[current.id]);
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
                  image={coverUrls[current.id]}
                />
              </Card>
            </Button>
          </Grid>
        ))}
        <Grid item />
      </Grid>
    </div>
  );
};

export default TrendingMangaCarousel;
