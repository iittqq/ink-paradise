import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../Components/Header/Header";
import { fetchAccountDetails } from "../../api/AccountDetails";
import "./Home.css";
import {
  fetchPopularManga,
  fetchRecentlyUpdated,
  fetchRecentlyAdded,
} from "../../api/MangaDexApi";
import TrendingMangaCarousel from "../../Components/TrendingMangaCarousel/TrendingMangaCarousel";
import MangaCategoriesHomePage from "../../Components/MangaCategoriesHomePage/MangaCategoriesHomePage";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import { Typography } from "@mui/material";

import { useTheme } from "../../contexts/ThemeContext";

const Home = () => {
  const [popularManga, setPopularManga] = useState<Manga[]>([]);
  const [recentlyUpdatedManga, setRecentlyUpdatedManga] = useState<Manga[]>([]);
  const [recentlyAddedManga, setRecentlyAddedManga] = useState<Manga[]>([]);

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
          fetchRecentlyUpdated(6, 0, data.contentFilter).then(
            (data: Manga[]) => {
              setRecentlyUpdatedManga(data);
            },
          );
          fetchRecentlyAdded(6, 0, data.contentFilter).then((data: Manga[]) => {
            setRecentlyAddedManga(data);
          });
        }
      });
    } else {
      fetchPopularManga(10, 3).then((data: Manga[]) => {
        setPopularManga(data);
      });
      fetchRecentlyUpdated(6, 0, 3).then((data: Manga[]) => {
        setRecentlyUpdatedManga(data);
      });
      fetchRecentlyAdded(6, 0, 3).then((data: Manga[]) => {
        setRecentlyAddedManga(data);
      });
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
  }, []);

  return (
    <div>
      <Header
        accountId={accountId === null ? null : state.accountId}
        contentFilter={contentFilterState}
      />
      <div className="home-title-and-dialog-button">
        <Typography className="popular-manga-header"> Popular Manga</Typography>
      </div>
      <TrendingMangaCarousel
        manga={popularManga}
        accountId={accountId === null ? null : state.accountId}
      />
      <div className="bottom-home-page">
        <MangaCategoriesHomePage
          recentlyUpdatedManga={recentlyUpdatedManga}
          recentlyAddedManga={recentlyAddedManga}
          accountId={accountId === null ? null : state.accountId}
          contentFilter={contentFilterState}
        />
      </div>
    </div>
  );
};

export default Home;
