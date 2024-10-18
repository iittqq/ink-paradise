import { useState, useEffect } from "react";
import { TextField, Typography, Button, Alert, Menu } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./Header.css";
import {
  fetchMangaByTitle,
  fetchMangaTags,
  fetchSimilarManga,
} from "../../api/MangaDexApi";
import {
  fetchAccountDetails,
  updateAccountDetails,
} from "../../api/AccountDetails";
import { fetchAccountData } from "../../api/Account";
import { Manga, MangaTagsInterface } from "../../interfaces/MangaDexInterfaces";
import InfoButtonHome from "../../Components/InfoButtonHome/InfoButtonHome";
import ThemeButton from "../../Components/ThemeButton/ThemeButton";
import MangaTagsHome from "../../Components/MangaTagsHome/MangaTagsHome";
import BookIcon from "@mui/icons-material/Book";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Account } from "../../interfaces/AccountInterfaces";
import PetsIcon from "@mui/icons-material/Pets";
import StyleIcon from "@mui/icons-material/Style";
import InfoIcon from "@mui/icons-material/Info";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "../../contexts/ThemeContext";

type Props = {
  accountId: number | null;
  contentFilter: number;
};
const Header = (props: Props) => {
  const { accountId, contentFilter } = props;
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertAccount, setShowAlertAccount] = useState(false);
  const [mangaTags, setMangaTags] = useState<MangaTagsInterface[]>([]);
  const [openTags, setOpenTags] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [openThemes, setOpenThemes] = useState(false);
  const [newTheme, setNewTheme] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { toggleTheme } = useTheme();

  const handleClickAccount = () => {
    if (accountId !== null) {
      fetchAccountData(accountId).then((data: Account | null) => {
        if (data !== null && data.verified === true) {
          navigate("/account", {
            state: { accountId: accountId, account: data },
          });
        } else {
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }
      });
    } else {
      navigate("/login");
    }
  };

  const handleClickSearchIcon = async () => {
    setSearching(!searching);
  };

  const handleClickedTag = (tag: MangaTagsInterface | null) => {
    if (tag !== null) {
      fetchSimilarManga(100, 0, [tag.id], contentFilter).then(
        (data: Manga[]) => {
          navigate("/mangaCoverList", {
            state: {
              listType: tag.attributes.name.en,
              manga: data,
              accountId: accountId === null ? null : accountId,
              tagId: tag.id,
              contentFilter: contentFilter,
            },
          });
        },
      );
      setOpenTags(false);
    }
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
    if (accountId !== null) {
      fetchAccountDetails(accountId).then((data) => {
        if (data !== null) {
          const updatedAccount = data;
          updatedAccount.theme = newTheme;
          updateAccountDetails(accountId, updatedAccount);
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

  const handleClickLibrary = async () => {
    if (accountId !== null) {
      fetchAccountData(accountId).then((data: Account | null) => {
        if (data !== null && data.verified === true) {
          navigate("/library", {
            state: { accountId: accountId, account: data },
          });
        } else {
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }
      });
    } else {
      setShowAlertAccount(true);
      setTimeout(() => {
        setShowAlertAccount(false);
      }, 3000);
    }
  };

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickLogo = async () => {
    navigate("/", { state: { accountId: accountId } });
  };

  const handleClick = async () =>
    searchInput === ""
      ? null
      : fetchMangaByTitle(searchInput, 25, contentFilter).then(
          (data: Manga[]) => {
            navigate("/mangaCoverList", {
              state: {
                listType: "Search Results",
                manga: data,
                accountId: accountId === null ? null : accountId,
                contentFilter: contentFilter,
              },
            });
          },
        );

  useEffect(() => {
    fetchMangaTags().then((data: MangaTagsInterface[]) => {
      setMangaTags(data);
    });
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
    <>
      <div className="container-header">
        <Button
          onClick={() => handleClickLogo()}
          className="logo-header-button"
        >
          <HomeIcon sx={{ height: "30px", width: "30px" }} />
        </Button>
        <>
          {searching ? (
            <div className="search-functionality-container">
              <Button
                className="header-buttons"
                onClick={() => handleClickSearchIcon()}
              >
                <CloseIcon />
              </Button>
              <TextField
                variant="outlined"
                id="header-search-input"
                focused
                type="search"
                size="small"
                className="input-field"
                placeholder="Search Manga"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    handleClick();
                  }
                }}
                onChange={(event) => {
                  setSearchInput(event.target.value);
                }}
              />
              <Button className="header-buttons" onClick={() => handleClick()}>
                <KeyboardArrowRightIcon />
              </Button>{" "}
            </div>
          ) : (
            <>
              <div className="manga-dex-credit">API by MangaDex </div>
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
                handleClickOpenTags={handleClickedOpenTags}
                openTags={openTags}
                handleTagsDialogClose={handleTagsDialogClose}
              />

              <div className="header-buttons-right">
                <Button
                  className="header-buttons"
                  onClick={() => handleClickSearchIcon()}
                >
                  <div className="header-nav-dialog-columns">
                    <SearchIcon />
                    <Typography className="header-nav-label">Search</Typography>
                  </div>
                </Button>
                <Button className="header-buttons" onClick={handleClickMenu}>
                  <div className="header-nav-dialog-columns">
                    <MenuIcon />
                    <Typography className="header-nav-label">Menu</Typography>
                  </div>{" "}
                </Button>

                <Menu
                  id="header-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <Button
                    className="header-buttons"
                    onClick={handleClickedOpenThemes}
                  >
                    <div className="header-nav-dialog-columns">
                      <DarkModeIcon />
                      <Typography className="header-nav-label">
                        Theme
                      </Typography>
                    </div>
                  </Button>
                  <Button
                    className="header-buttons"
                    onClick={handleClickedOpenInfo}
                  >
                    <div className="header-nav-dialog-columns">
                      <InfoIcon />{" "}
                      <Typography className="header-nav-label">Info</Typography>
                    </div>
                  </Button>

                  <Button
                    className="header-buttons"
                    onClick={handleClickedOpenTags}
                  >
                    <div className="header-nav-dialog-columns">
                      <StyleIcon />
                      <Typography className="header-nav-label">
                        Genres
                      </Typography>
                    </div>
                  </Button>

                  <Button
                    className="header-buttons"
                    onClick={() => {
                      handleClickLibrary();
                    }}
                  >
                    <div className="header-nav-dialog-columns">
                      <BookIcon />
                      <Typography className="header-nav-label">
                        Library
                      </Typography>
                    </div>
                  </Button>
                  <Button
                    onClick={() => {
                      handleClickAccount();
                    }}
                    className="header-buttons"
                  >
                    <div className="header-nav-dialog-columns">
                      <AccountBoxIcon />
                      <Typography className="header-nav-label">
                        Account
                      </Typography>
                    </div>
                  </Button>
                </Menu>
              </div>
            </>
          )}
        </>
      </div>
      {showAlert == true ? (
        <div className="alert-container">
          <Alert
            icon={<PetsIcon className="account-verification-alert-icon" />}
            severity="info"
            className="account-verification-alert"
          >
            Please verify your account before proceeding
          </Alert>
        </div>
      ) : null}
      {showAlertAccount == true ? (
        <div className="alert-container">
          <Alert
            icon={<PetsIcon className="account-verification-alert-icon" />}
            severity="info"
            className="account-verification-alert"
          >
            Please create and verify your account before proceeding
          </Alert>
        </div>
      ) : null}{" "}
    </>
  );
};

export default Header;
