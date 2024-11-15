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
import InfoButtonHome from "../../Components/InfoButtonHome/InfoButtonHome";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import { Typography, Button } from "@mui/material";
import { useTheme } from "../../contexts/ThemeContext";
import InfoIcon from "@mui/icons-material/Info";

const Home = () => {
  const [popularManga, setPopularManga] = useState<Manga[]>([]);
  const [recentlyUpdatedManga, setRecentlyUpdatedManga] = useState<Manga[]>([]);
  const [recentlyAddedManga, setRecentlyAddedManga] = useState<Manga[]>([]);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [contentFilterState, setContentFilterState] = useState<number>(3);
  const [openInfo, setOpenInfo] = useState(false);
  const { toggleTheme } = useTheme();
  const handleClickedOpenInfo = () => {
    setOpenInfo(true);
  };
  const handleInfoDialogClose = () => {
    setOpenInfo(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      const account = await getUserDetails();

      if (account) {
        setAccountId(account.id);

        const accountDetails = await fetchAccountDetails(account.id);
        setContentFilterState(accountDetails.contentFilter);

        const localTheme = window.localStorage.getItem("theme");
        if (localTheme) {
          toggleTheme(parseInt(localTheme));
        } else {
          if (accountDetails) {
            const theme = accountDetails.theme;
            toggleTheme(theme);
          }
        }

        const popularManga = await fetchPopularManga(
          15,
          accountDetails.contentFilter,
        );
        setPopularManga(popularManga);

        const recentlyUpdatedManga = await fetchRecentlyUpdated(
          6,
          0,
          accountDetails.contentFilter,
        );
        setRecentlyUpdatedManga(recentlyUpdatedManga);

        const recentlyAddedManga = await fetchRecentlyAdded(
          6,
          0,
          accountDetails.contentFilter,
        );
        setRecentlyAddedManga(recentlyAddedManga);
      } else {
        const defaultContentFilter = 3;
        const popularManga = await fetchPopularManga(15, defaultContentFilter);
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
      <InfoButtonHome
        openInfo={openInfo}
        handleInfoDialogClose={handleInfoDialogClose}
      />
      <div className="home-title-and-dialog-button">
        <Typography className="popular-manga-header"> Popular Manga</Typography>
        <Button className="home-info-button" onClick={handleClickedOpenInfo}>
          <div className="info-button-column">
            <InfoIcon />{" "}
          </div>
        </Button>
      </div>
      <TrendingMangaCarousel
        manga={popularManga}
        accountId={accountId === null ? null : accountId}
        contentFilter={contentFilterState}
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
