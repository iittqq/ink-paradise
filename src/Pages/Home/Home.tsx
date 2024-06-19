import { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import "./Home.css";
import {
  fetchPopularManga,
  fetchRecentlyUpdated,
  fetchRecentlyAdded,
  fetchMangaTags,
  fetchSimilarManga,
} from "../../api/MangaDexApi";
import TrendingMangaCarousel from "../../Components/TrendingMangaCarousel/TrendingMangaCarousel";
import MangaCategoriesHomePage from "../../Components/MangaCategoriesHomePage/MangaCategoriesHomePage";
import { Manga, MangaTagsInterface } from "../../interfaces/MangaDexInterfaces";
import { Button, Typography } from "@mui/material";
import MangaTagsHome from "../../Components/MangaTagsHome/MangaTagsHome";
import StyleIcon from "@mui/icons-material/Style";

const Home = () => {
  const [popularManga, setPopularManga] = useState<Manga[]>([]);
  const [recentlyUpdatedManga, setRecentlyUpdatedManga] = useState<Manga[]>([]);
  const [recentlyAddedManga, setRecentlyAddedManga] = useState<Manga[]>([]);
  const [mangaTags, setMangaTags] = useState<MangaTagsInterface[]>([]);
  const [mangaFromTag, setMangaFromTag] = useState<Manga[]>([]);
  const [selectedTag, setSelectedTag] = useState<MangaTagsInterface | null>(
    null,
  );
  const [openTags, setOpenTags] = useState(false);

  useEffect(() => {
    fetchPopularManga(10).then((data: Manga[]) => {
      setPopularManga(data);
    });
    fetchRecentlyUpdated(5, 0).then((data: Manga[]) => {
      setRecentlyUpdatedManga(data);
    });
    fetchRecentlyAdded(5, 0).then((data: Manga[]) => {
      setRecentlyAddedManga(data);
    });

    fetchMangaTags().then((data: MangaTagsInterface[]) => {
      setMangaTags(data);
    });

    if (selectedTag !== null) {
      fetchSimilarManga(5, [selectedTag.id]).then((data: Manga[]) => {
        setMangaFromTag(data);
        console.log(data);
      });
    }
    console.log(selectedTag);
  }, [selectedTag]);

  const handleClickedTag = (tag: MangaTagsInterface | null) => {
    setSelectedTag(tag);
  };

  const handleClickedOpenTags = () => {
    setOpenTags(true);
  };

  const handleTagsDialogClose = () => {
    setOpenTags(false);
  };

  return (
    <div>
      <Header />
      <div className="home-title-and-dialog-button">
        <Typography className="popular-manga-header"> Popular Manga</Typography>
        <MangaTagsHome
          mangaTags={mangaTags}
          handleClickedTag={handleClickedTag}
          selectedTag={selectedTag !== null ? selectedTag : undefined}
          handleClickOpenTags={handleClickedOpenTags}
          openTags={openTags}
          handleTagsDialogClose={handleTagsDialogClose}
        />
        <Button onClick={handleClickedOpenTags} className="tags-button">
          <StyleIcon />
        </Button>
      </div>
      <TrendingMangaCarousel manga={popularManga} />
      <div className="bottom-home-page">
        <MangaCategoriesHomePage
          recentlyUpdatedManga={recentlyUpdatedManga}
          recentlyAddedManga={recentlyAddedManga}
          mangaFromTag={mangaFromTag ? mangaFromTag : undefined}
          tag={selectedTag !== null ? selectedTag : undefined}
        />
      </div>
    </div>
  );
};

export default Home;
