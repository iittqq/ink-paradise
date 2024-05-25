import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import Header from "../../Components/Header/Header";
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
  Relationship,
} from "../../interfaces/MangaDexInterfaces";

import MangaClickable from "../../Components/MangaClickable/MangaClickable";

const Home = () => {
  const [open, setOpen] = useState(false);
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

  const handleClickMangaCoverListRA = async () => {
    fetchRecentlyAdded(75, 0).then((data: Manga[]) => {
      navigate("/mangaCoverList", {
        state: { listType: "RecentlyAdded", manga: data },
      });
    });
  };
  const handleClick = async (tagId: string) => {
    navigate("mangaList", {
      state: { tagId: tagId },
    });
  };

  useEffect(() => {
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
    <div className="home-page-container">
      <Header />

      <div className="manga-category-section">
        <div className="manga-column">
          <Typography
            className="manga-category-label"
            textTransform="none"
            noWrap
            color={"white"}
            fontSize={13}
          >
            Recently Added
          </Typography>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            className="manga-entries"
            spacing={1}
          >
            {recentlyAddedManga.map((element: Manga) => (
              <Grid item>
                <MangaClickable
                  id={element.id}
                  title={element.attributes.title.en}
                  coverId={
                    element.relationships.find(
                      (i: Relationship) => i.type === "cover_art",
                    )?.id
                  }
                  updatedAt={element.attributes.updatedAt}
                />
              </Grid>
            ))}
          </Grid>

          <Button className="show-more-button">
            <ExpandMore
              sx={{ color: "#333333" }}
              onClick={() => handleClickMangaCoverListRA()}
            />
          </Button>
        </div>

        <div className="manga-column">
          <Typography color="white" noWrap>
            Recently Updated
          </Typography>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            className="manga-entries"
            spacing={1}
          >
            {recentlyUpdatedManga.map((element: Manga) => (
              <Grid item>
                <MangaClickable
                  id={element.id}
                  title={element.attributes.title.en}
                  coverId={
                    element.relationships.find(
                      (i: Relationship) => i.type === "cover_art",
                    )?.id
                  }
                  updatedAt={element.attributes.updatedAt}
                />
              </Grid>
            ))}
          </Grid>
          <Button className="show-more-button">
            <ExpandMore
              sx={{ color: "#333333" }}
              onClick={() => handleClickRecentlyUpdated()}
            />
          </Button>
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

export default Home;
