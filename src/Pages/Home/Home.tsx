import { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import { fetchAccountDetails } from "../../api/AccountDetails";
import { getUserDetails } from "../../api/Account";
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
  const [accountId, setAccountId] = useState<number | null>(null);
  const [contentFilterState, setContentFilterState] = useState<number>(3);
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const account = await getUserDetails();

      // Check if account is not null
      if (account) {
        setAccountId(account.id);

        // Fetch account details since the user is logged in
        const accountDetails = await fetchAccountDetails(account.id);
        setContentFilterState(accountDetails.contentFilter);

        // Get the theme from local storage or account details
        const localTheme = window.localStorage.getItem("theme");
        if (localTheme) {
          toggleTheme(parseInt(localTheme));
        } else {
          if (accountDetails) {
            const theme = accountDetails.theme;
            toggleTheme(theme);
          }
        }

        // Fetch popular manga based on user's content filter
        const popularManga = await fetchPopularManga(
          10,
          accountDetails.contentFilter,
        );
        setPopularManga(popularManga);

        // Fetch recently updated manga
        const recentlyUpdatedManga = await fetchRecentlyUpdated(
          6,
          0,
          accountDetails.contentFilter,
        );
        setRecentlyUpdatedManga(recentlyUpdatedManga);

        // Fetch recently added manga
        const recentlyAddedManga = await fetchRecentlyAdded(
          6,
          0,
          accountDetails.contentFilter,
        );
        setRecentlyAddedManga(recentlyAddedManga);
      } else {
        // If account is null, make the default calls
        const defaultContentFilter = 3; // Or whatever default filter you want
        const popularManga = await fetchPopularManga(10, defaultContentFilter);
        setPopularManga(popularManga);

        const recentlyUpdatedManga = await fetchRecentlyUpdated(
          6,
          0,
          defaultContentFilter,
        );
        setRecentlyUpdatedManga(recentlyUpdatedManga);

        const recentlyAddedManga = await fetchRecentlyAdded(
          6,
          0,
          defaultContentFilter,
        );
        setRecentlyAddedManga(recentlyAddedManga);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header
        accountId={accountId === null ? null : accountId}
        contentFilter={contentFilterState}
      />
      <div className="home-title-and-dialog-button">
        <Typography className="popular-manga-header"> Popular Manga</Typography>
      </div>
      <TrendingMangaCarousel
        manga={popularManga}
        accountId={accountId === null ? null : accountId}
      />
      <div className="bottom-home-page">
        <MangaCategoriesHomePage
          recentlyUpdatedManga={recentlyUpdatedManga}
          recentlyAddedManga={recentlyAddedManga}
          accountId={accountId === null ? null : accountId}
          contentFilter={contentFilterState}
        />
      </div>
    </div>
  );
};

export default Home;
