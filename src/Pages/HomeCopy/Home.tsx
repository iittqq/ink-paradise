import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Card,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import {
  fetchRecentlyUpdated,
  fetchRecentlyAdded,
  fetchMangaTags,
} from "../../api/MangaDexApi";

import {
  MangaTagsInterface,
  Manga,
  TopManga,
  Relationship,
} from "../../interfaces/MangaDexInterfaces";

import { fetchTopManga } from "../../api/MalApi";
import MangaClickable from "../../Components/MangaClickable/MangaClickable";
import HotMangaCarousel, {
  CarouselItem,
} from "../../Components/HotMangaCarousel/HotMangaCarousel";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import React from "react";

const Home2 = () => {
  const [open, setOpen] = useState(false);
  const [topMangaData, setTopMangaData] = useState<TopManga[]>([]);
  const [recentlyUpdatedManga, setRecentlyUpdatedManga] = useState<Manga[]>([]);
  const [recentlyAddedManga, setRecentlyAddedManga] = useState<Manga[]>([]);
  const [mangaTags, setMangaTags] = useState<MangaTagsInterface[]>([]);
  const navigate = useNavigate();

  const handleClickRecentlyUpdated = async () => {
    fetchRecentlyUpdated(75, 0).then((data: Manga[]) => {
      navigate("/mangaCoverList", {
        state: { listType: "RecentlyUpdated", manga: data },
      });
    });
  };

  const handleClickTrendingNow = async () => {};

  const handleClickMangaCoverListRA = async () => {
    fetchRecentlyAdded(75, 0).then((data: Manga[]) => {
      navigate("/mangaCoverList", {
        state: { listType: "RecentlyAdded", manga: data },
      });
    });
  };
  const handleClick = async (tagId: string) => {
    console.log(tagId);
    navigate("mangaList", {
      state: { tagId: tagId },
    });
  };

  useEffect(() => {
    fetchTopManga().then((data: TopManga[]) => {
      setTopMangaData(data);
    });

    fetchRecentlyUpdated(10, 0).then((data: Manga[]) => {
      setRecentlyUpdatedManga(data);
    });

    fetchMangaTags().then((data: MangaTagsInterface[]) => {
      setMangaTags(data);
    });

    fetchRecentlyAdded(10, 0).then((data: Manga[]) => {
      setRecentlyAddedManga(data);
    });
  }, []);

  const handleOpenTags = () => {
    setOpen(!open);
  };

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="trending-manga-section">
        <Typography
          color="white"
          variant="h5"
          sx={{
            paddingBottom: "15px",
            alignSelf: "center",
          }}
        >
          Trending Now
        </Typography>
        <div className="carousel-block">
          <HotMangaCarousel>
            {topMangaData
              .sort((a: any, b: any) => a.rank - b.rank)
              .map((currentManga: TopManga) => (
                <CarouselItem
                  id={currentManga.mal_id}
                  rank={currentManga.rank}
                  image={currentManga.images.jpg.image_url}
                  title={currentManga.title}
                  author={currentManga.authors[0].name}
                ></CarouselItem>
              ))}
          </HotMangaCarousel>
        </div>
      </div>

      <List className="tags-list">
        <ListItemButton
          className="tags-list-button"
          onClick={() => handleOpenTags()}
        >
          <ListItemText sx={{ color: "white" }} primary="Tags" />
          {open ? (
            <ExpandLess sx={{ color: "#333333" }} />
          ) : (
            <ExpandMore sx={{ color: "#333333" }} />
          )}
        </ListItemButton>
        <Collapse
          sx={{
            width: "100%",
          }}
          in={open}
          timeout="auto"
        >
          <Grid
            container
            justifyContent="center"
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ paddingBottom: "40px" }}
          >
            {mangaTags.map((element: MangaTagsInterface) => (
              <Grid item>
                <Button
                  className="tag-button"
                  variant="contained"
                  onClick={() => handleClick(element.id)}
                >
                  <Typography fontSize={10} textTransform="none">
                    {element.attributes.name.en}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </List>
    </div>
  );
};

export default Home2;
