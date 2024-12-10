import { useState, useEffect } from "react";
import "./Home.css";
import {
  fetchPopularManga,
  fetchRecentlyUpdated,
  fetchPopularNewManga,
  fetchMangaListById,
  fetchRecentlyAdded,
} from "../../api/MangaDexApi";
import TrendingMangaCarousel from "../../Components/TrendingMangaCarousel/TrendingMangaCarousel";
import MangaCategoriesHomePage from "../../Components/MangaCategoriesHomePage/MangaCategoriesHomePage";
import InfoButtonHome from "../../Components/InfoButtonHome/InfoButtonHome";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import { Typography, Button } from "@mui/material";
import { useTheme } from "../../contexts/ThemeContext";
import InfoIcon from "@mui/icons-material/Info";
import { Account } from "../../interfaces/AccountInterfaces";
import { AccountDetails } from "../../interfaces/AccountDetailsInterfaces";

interface HomeProps {
  account: Account | null;
  accountDetails: AccountDetails | null;
}

const Home = ({ account, accountDetails }: HomeProps) => {
  const [popularManga, setPopularManga] = useState<Manga[]>([]);
  const [recentlyUpdatedManga, setRecentlyUpdatedManga] = useState<Manga[]>([]);
  const [popularNewManga, setPopularNewManga] = useState<Manga[]>([]);
  const [recentlyAddedManga, setRecentlyAddedManga] = useState<Manga[]>([]);
  const [selectedManga, setSelectedManga] = useState<Manga[]>([]);
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
      const selectedMangaIds = [
        "e5ce88e2-8c46-482d-8acf-5c6d5a64a585",

        "53c628b3-d1f5-43aa-8df3-080034285cb4",

        "f29d4785-396a-494e-b48f-47d02f583276",

        "90ea8757-c0d8-42f1-b4a8-4594b5065eb4",

        "e1e38166-20e4-4468-9370-187f985c550e",

        "6fef1f74-a0ad-4f0d-99db-d32a7cd24098",

        "34f45c13-2b78-4900-8af2-d0bb551101f4",

        "2e0fdb3b-632c-4f8f-a311-5b56952db647",

        "65263bf9-4f87-4513-b72f-ad6436b3911c",

        "a4b39b6e-a448-4644-a540-64ceff1d8305",
      ];

      if (account && accountDetails) {
        setAccountId(account.id);

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
        const popularNewManga = await fetchPopularNewManga(
          15,
          0,
          accountDetails.contentFilter,
        );
        setPopularNewManga(popularNewManga);
        const selectedManga = await fetchMangaListById(selectedMangaIds);
        setSelectedManga(selectedManga);
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

        const popularNewManga = await fetchPopularNewManga(
          15,
          0,
          defaultContentFilter,
        );
        setPopularNewManga(popularNewManga);

        const selectedManga = await fetchMangaListById(selectedMangaIds);
        setSelectedManga(selectedManga);
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
        numbered={true}
      />
      <Typography className="popular-manga-header">
        Popular New Manga
      </Typography>
      <TrendingMangaCarousel
        manga={popularNewManga}
        accountId={accountId}
        contentFilter={contentFilterState}
        numbered={true}
      />
      <Typography className="popular-manga-header">
        Looking for something new?
      </Typography>{" "}
      <TrendingMangaCarousel
        manga={selectedManga}
        accountId={accountId === null ? null : accountId}
        contentFilter={contentFilterState}
        numbered={false}
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
