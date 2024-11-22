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
        "db692d58-4b13-4174-ae8c-30c515c0689c",

        "29ab6984-7c1d-4d45-b925-25aa082b492e",

        "baa95345-24fb-47a9-83e9-434ff671f968",

        "a77742b1-befd-49a4-bff5-1ad4e6b0ef7b",

        "566ab917-4893-423a-8b0c-787ba77b6def",

        "8946189d-682f-4838-9c2a-3c2dd5132f2c",

        "44a5cbe1-0204-4cc7-a1ff-0fda2ac004b6",

        "319df2e2-e6a6-4e3a-a31c-68539c140a84",

        "d1a9fdeb-f713-407f-960c-8326b586e6fd",

        "6b1eb93e-473a-4ab3-9922-1a66d2a29a4a",
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
