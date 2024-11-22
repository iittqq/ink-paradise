import "./TrendingMangaCarousel.css";
import { Manga, Relationship } from "../../interfaces/MangaDexInterfaces";
import { Grid, Button, Card, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { fetchMangaCoverBackend } from "../../api/MangaDexApi";
import MangaDetailsDialog from "../MangaDetailsDialog/MangaDetailsDialog";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

type Props = {
  manga: Manga[];
  accountId: number | null;
  contentFilter: number;
  numbered: boolean;
};

const TrendingMangaCarousel = (props: Props) => {
  const { manga, accountId, contentFilter, numbered } = props;
  const [coverUrls, setCoverUrls] = useState<{ [key: string]: string }>({});
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [mangaDetailsToDisplay, setMangaDetailsToDisplay] = useState<Manga>();
  const [mangaCoverToDisplay, setMangaCoverToDisplay] = useState<string>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtLeft, setIsAtLeft] = useState(true);
  const [isAtRight, setIsAtRight] = useState(false);
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate(`/manga/${id}`);
  };

  const handleDetailsDialogClose = () => {
    setOpenDetailsDialog(false);
  };

  const handleMangaClicked = (manga: Manga, cover: string) => {
    setOpenDetailsDialog(true);
    setMangaDetailsToDisplay(manga);
    setMangaCoverToDisplay(cover);
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300; // Adjust scroll amount as needed
      const maxScrollLeft =
        scrollRef.current.scrollWidth - scrollRef.current.clientWidth;

      let newScrollLeft =
        direction === "right"
          ? scrollRef.current.scrollLeft + scrollAmount
          : scrollRef.current.scrollLeft - scrollAmount;

      // Ensure new scroll position is within bounds
      newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      setIsAtLeft(newScrollLeft === 0);
      setIsAtRight(newScrollLeft === maxScrollLeft);
    }
  };

  useEffect(() => {
    const handleScrollBounds = () => {
      if (scrollRef.current) {
        const maxScrollLeft =
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        const scrollLeft = scrollRef.current.scrollLeft;

        setIsAtLeft(scrollLeft === 0);
        setIsAtRight(scrollLeft >= maxScrollLeft);
      }
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScrollBounds);
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScrollBounds);
      }
    };
  }, []);

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
    <div className="carousel-container">
      {!isAtLeft && (
        <button
          className="carousel-button left"
          onClick={() => scrollCarousel("left")}
        >
          <KeyboardArrowLeftIcon />
        </button>
      )}{" "}
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
              contentFilter={contentFilter}
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
                {numbered === true ? (
                  <Typography className="popular-carousel-grid-item-rank">
                    {index + 1}
                  </Typography>
                ) : null}
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
                    width: {
                      xs: "140px",
                      sm: "180px",
                      md: "180px",
                      lg: "180px",
                    },
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
          <Grid />
        </Grid>
      </div>
      {!isAtRight && (
        <button
          className="carousel-button right"
          onClick={() => scrollCarousel("right")}
        >
          <KeyboardArrowRightIcon />
        </button>
      )}{" "}
    </div>
  );
};

export default TrendingMangaCarousel;
