import { useState } from "react";
import { TextField, Typography, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./Header.css";
import { fetchMangaByTitle } from "../../api/MangaDexApi";
import { fetchAccountData } from "../../api/Account";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import BookIcon from "@mui/icons-material/Book";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Account } from "../../interfaces/AccountInterfaces";
import PetsIcon from "@mui/icons-material/Pets";

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

  const handleClickAccount = () => {
    console.log(accountId);
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
                accountId: accountId,
                contentFilter: contentFilter,
              },
            });
          },
        );

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
