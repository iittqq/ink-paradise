import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../Components/Header/Header";
import {
  fetchAccountDetails,
  updateAccountDetails,
} from "../../api/AccountDetails";
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
import InfoIcon from "@mui/icons-material/Info";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import InfoButtonHome from "../../Components/InfoButtonHome/InfoButtonHome";
import ThemeButton from "../../Components/ThemeButton/ThemeButton";
import { useTheme } from "../../contexts/ThemeContext";

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
  const [openInfo, setOpenInfo] = useState(false);
  const [openThemes, setOpenThemes] = useState(false);
  const [newTheme, setNewTheme] = useState<number>(0);
  const [contentFilterState, setContentFilterState] = useState<number>(3);
  const { state } = useLocation();
  const accountId = state?.accountId ?? null;
  const { toggleTheme } = useTheme();

  useEffect(() => {
    if (accountId !== null) {
      fetchAccountDetails(accountId).then((data) => {
        setContentFilterState(data.contentFilter);
        if (data !== null) {
          fetchPopularManga(10, data.contentFilter).then((data: Manga[]) => {
            setPopularManga(data);
          });
          fetchRecentlyUpdated(5, 0, data.contentFilter).then(
            (data: Manga[]) => {
              setRecentlyUpdatedManga(data);
            },
          );
          fetchRecentlyAdded(5, 0, data.contentFilter).then((data: Manga[]) => {
            setRecentlyAddedManga(data);
          });
          if (selectedTag !== null) {
            fetchSimilarManga(5, 0, [selectedTag.id], data.contentFilter).then(
              (data: Manga[]) => {
                setMangaFromTag(data);
              },
            );
          }
        }
      });
    } else {
      fetchPopularManga(10, 3).then((data: Manga[]) => {
        setPopularManga(data);
      });
      fetchRecentlyUpdated(5, 0, 3).then((data: Manga[]) => {
        setRecentlyUpdatedManga(data);
      });
      fetchRecentlyAdded(5, 0, 3).then((data: Manga[]) => {
        setRecentlyAddedManga(data);
      });

      if (selectedTag !== null) {
        fetchSimilarManga(5, 0, [selectedTag.id], 3).then((data: Manga[]) => {
          setMangaFromTag(data);
        });
      }
    }
    {
      /**
    fetchPopularManga(10).then((data: Manga[]) => {
      setPopularManga(data);
    });
    fetchRecentlyUpdated(5, 0).then((data: Manga[]) => {
      setRecentlyUpdatedManga(data);
    });
    fetchRecentlyAdded(5, 0).then((data: Manga[]) => {
      setRecentlyAddedManga(data);
    });
*/
    }
    fetchMangaTags().then((data: MangaTagsInterface[]) => {
      setMangaTags(data);
    });
    {
      /**
    if (selectedTag !== null) {
      fetchSimilarManga(5, 0, [selectedTag.id]).then((data: Manga[]) => {
        setMangaFromTag(data);
      });
    }
    */
    }

    const localTheme = window.localStorage.getItem("theme");
    if (localTheme) {
      toggleTheme(parseInt(localTheme));
    } else {
      if (accountId !== null) {
        fetchAccountDetails(accountId).then((data) => {
          if (data !== null) {
            const theme = data.theme;
            toggleTheme(theme);
          }
        });
      }
    }
  }, [selectedTag]);

  const handleClickedTag = (tag: MangaTagsInterface | null) => {
    setSelectedTag(tag);
    setOpenTags(false);
  };

  const handleClickedOpenTags = () => {
    setOpenTags(true);
  };

  const handleThemeChange = (newTheme: number) => {
    setNewTheme(newTheme);
    toggleTheme(newTheme);
  };

  const handleThemeDialogClose = () => {
    setOpenThemes(false);
    window.localStorage.setItem("theme", newTheme.toString());
    if (state.accountId !== null) {
      fetchAccountDetails(state.accountId).then((data) => {
        if (data !== null) {
          const updatedAccount = data;
          updatedAccount.theme = newTheme;
          updateAccountDetails(state.accountId, updatedAccount);
        }
      });
    }
  };

  const handleClickedOpenThemes = () => {
    setOpenThemes(true);
  };

  const handleTagsDialogClose = () => {
    setOpenTags(false);
  };

  const handleClickedOpenInfo = () => {
    setOpenInfo(true);
  };

  const handleInfoDialogClose = () => {
    setOpenInfo(false);
  };

  return (
    <div>
      <Header
        accountId={accountId === null ? null : state.accountId}
        contentFilter={contentFilterState}
      />
      <div className="home-title-and-dialog-button">
        <Typography className="popular-manga-header"> Popular Manga</Typography>
        <InfoButtonHome
          openInfo={openInfo}
          handleInfoDialogClose={handleInfoDialogClose}
        />
        <ThemeButton
          openThemes={openThemes}
          handleThemeDialogClose={handleThemeDialogClose}
          handleThemeChange={handleThemeChange}
        />

        <MangaTagsHome
          mangaTags={mangaTags}
          handleClickedTag={handleClickedTag}
          selectedTag={selectedTag !== null ? selectedTag : undefined}
          handleClickOpenTags={handleClickedOpenTags}
          openTags={openTags}
          handleTagsDialogClose={handleTagsDialogClose}
        />

        <div>
          <Button onClick={handleClickedOpenThemes} className="tags-button">
            <DarkModeIcon />
          </Button>
          <Button onClick={handleClickedOpenInfo} className="tags-button">
            <InfoIcon />
          </Button>
          <Button onClick={handleClickedOpenTags} className="tags-button">
            <StyleIcon />
          </Button>
        </div>
      </div>
      <TrendingMangaCarousel
        manga={popularManga}
        accountId={accountId === null ? null : state.accountId}
      />
      <div className="bottom-home-page">
        <MangaCategoriesHomePage
          recentlyUpdatedManga={recentlyUpdatedManga}
          recentlyAddedManga={recentlyAddedManga}
          mangaFromTag={mangaFromTag ? mangaFromTag : undefined}
          tag={selectedTag !== null ? selectedTag : undefined}
          accountId={accountId === null ? null : state.accountId}
          contentFilter={contentFilterState}
        />
      </div>
    </div>
  );
};

export default Home;
