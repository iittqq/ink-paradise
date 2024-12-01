import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Alert,
  Menu,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import {
  fetchMangaTags,
  fetchSearch,
  fetchSimilarManga,
} from "../../api/MangaDexApi";
import {
  fetchAccountDetails,
  updateAccountDetails,
} from "../../api/AccountDetails";
import { Manga, MangaTagsInterface } from "../../interfaces/MangaDexInterfaces";
import ThemeButton from "../../Components/ThemeButton/ThemeButton";
import MangaTagsHome from "../../Components/MangaTagsHome/MangaTagsHome";
import BookIcon from "@mui/icons-material/Book";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import { Account } from "../../interfaces/AccountInterfaces";
import ErrorIcon from "@mui/icons-material/Error";
import StyleIcon from "@mui/icons-material/Style";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "../../contexts/ThemeContext";
import { AccountDetails } from "../../interfaces/AccountDetailsInterfaces";

interface Props {
  account: Account | null;
  accountDetails: AccountDetails | null;
}
const Header = ({ account, accountDetails }: Props) => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertAccount, setShowAlertAccount] = useState(false);
  const [mangaTags, setMangaTags] = useState<MangaTagsInterface[]>([]);
  const [openTags, setOpenTags] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openThemes, setOpenThemes] = useState(false);
  const [newTheme, setNewTheme] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchMangaName, setSearchMangaName] = useState("");
  const [searchAuthorName, setSearchAuthorName] = useState("");
  const [searchScanlationGroup, setSearchScanlationGroup] = useState("");
  const { toggleTheme } = useTheme();

  const handleClickLibrary = async () => {
    if (account !== null) {
      if (account.verified === true) {
        navigate("/library", {});
      } else {
        setShowAlertAccount(true);
        setTimeout(() => {
          setShowAlertAccount(false);
        }, 3000);
      }
    } else {
      navigate("/login");
    }
  };

  const handleClickAccount = async () => {
    if (account !== null) {
      if (account.verified === true) {
        navigate("/account");
      } else {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    } else {
      navigate("/login");
    }
  };

  const handleClickedTag = (tag: MangaTagsInterface | null) => {
    if (tag !== null) {
      fetchSimilarManga(
        100,
        0,
        [tag.id],
        accountDetails === null ? 3 : accountDetails.contentFilter,
      ).then((data: Manga[]) => {
        navigate("/mangaCoverList", {
          state: {
            listType: tag.attributes.name.en,
            manga: data,
            tagId: tag.id,
          },
        });
      });
      setOpenTags(false);
    }
  };

  const handleClickedOpenTags = () => {
    setOpenTags(true);
  };

  const handleThemeChange = (newTheme: number) => {
    setNewTheme(newTheme);
    toggleTheme(newTheme);
    console.log(newTheme);
  };

  const handleThemeDialogClose = () => {
    setOpenThemes(false);
    if (newTheme !== null) {
      window.localStorage.setItem("theme", newTheme.toString());
      if (account !== null) {
        fetchAccountDetails(account.id).then((data) => {
          if (data !== null) {
            const updatedAccount = data;
            updatedAccount.theme = newTheme;
            updateAccountDetails(account.id, updatedAccount);
          }
        });
      }
    }
  };

  const handleClickedOpenThemes = () => {
    setOpenThemes(true);
  };

  const handleTagsDialogClose = () => {
    setOpenTags(false);
  };

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickLogo = async () => {
    navigate("/");
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSearchMangaNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchMangaName(event.target.value);
  };

  const handleSearchAuthorNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchAuthorName(event.target.value);
  };

  const handleSearchScanlationGroupChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchScanlationGroup(event.target.value);
  };

  const handleSearch = async () => {
    setDialogOpen(false);
    fetchSearch(
      searchMangaName,
      searchAuthorName,
      searchScanlationGroup,
      accountDetails === null ? 3 : accountDetails.contentFilter,
      0,
    ).then((results: Manga[]) => {
      navigate("/mangaCoverList", {
        state: {
          listType: "Search Results",
          manga: results,
        },
      });
      handleDialogClose();
    });
    setSearchMangaName("");
    setSearchAuthorName("");
    setSearchScanlationGroup("");
  };

  useEffect(() => {
    fetchMangaTags().then((data: MangaTagsInterface[]) => {
      setMangaTags(data);
    });
    const localTheme = window.localStorage.getItem("theme");
    if (localTheme) {
      toggleTheme(parseInt(localTheme));
    } else {
      if (account !== null) {
        fetchAccountDetails(account.id).then((data) => {
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
          <div className="manga-dex-credit">API by MangaDex </div>

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
              onClick={() => setDialogOpen(true)}
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
              disableScrollLock
              disableEnforceFocus
              disableAutoFocus
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
                className="header-buttons-option"
                onClick={() => {
                  handleClickLibrary();
                }}
              >
                <div className="header-nav-dialog-columns">
                  <BookIcon />
                  <Typography className="header-nav-label">Library</Typography>
                </div>
              </Button>
              <Button
                onClick={() => {
                  handleClickAccount();
                }}
                className="header-buttons-option"
              >
                <div className="header-nav-dialog-columns">
                  <AccountBoxIcon />
                  <Typography className="header-nav-label">Account</Typography>
                </div>
              </Button>{" "}
              <Button
                className="header-buttons-option"
                onClick={handleClickedOpenTags}
              >
                <div className="header-nav-dialog-columns">
                  <StyleIcon />
                  <Typography className="header-nav-label">
                    Categories
                  </Typography>
                </div>
              </Button>{" "}
              <Button
                className="header-buttons-option"
                onClick={handleClickedOpenThemes}
              >
                <div className="header-nav-dialog-columns">
                  <DarkModeIcon />
                  <Typography className="header-nav-label">Theme</Typography>
                </div>
              </Button>
            </Menu>
          </div>
        </>
      </div>
      {showAlert == true ? (
        <div className="alert-container">
          <Alert
            icon={<ErrorIcon className="account-verification-alert-icon" />}
            severity="info"
            className="account-verification-alert"
          >
            Please verify your account via email
          </Alert>
        </div>
      ) : null}
      {showAlertAccount == true ? (
        <div className="alert-container">
          <Alert
            icon={<ErrorIcon className="account-verification-alert-icon" />}
            severity="info"
            className="account-verification-alert"
          >
            Please create and verify your account
          </Alert>
        </div>
      ) : null}{" "}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        className="search-dialog"
      >
        <DialogTitle className="search-dialog-title">Search</DialogTitle>

        <DialogActions className="search-dialog-option-list">
          <input
            type="text"
            id="searchName"
            placeholder="Manga Name"
            className="search-inputs"
            onChange={(e) => handleSearchMangaNameChange(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <input
            type="text"
            id="searchAuthor"
            placeholder="Author Name"
            className="search-inputs"
            onChange={(e) => handleSearchAuthorNameChange(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <input
            type="text"
            id="searchScanlationGroup"
            placeholder="Scanlation Group"
            className="search-inputs"
            onChange={(e) => handleSearchScanlationGroupChange(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <Button
            className="create-button"
            onClick={() => {
              handleSearch();
            }}
          >
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
