import { useState } from "react";
import { TextField, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./Header.css";
import { fetchMangaByTitle } from "../../api/MangaDexApi";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import { fetchAccountData } from "../../api/MalApi";
import BookIcon from "@mui/icons-material/Book";
import WhatsHotIcon from "@mui/icons-material/Whatshot";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { MalAccount } from "../../interfaces/MalInterfaces";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Header = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);

  const handleClickAccount = () => {
    const account = window.localStorage.getItem("account");
    const accountData = JSON.parse(account as string);
    if (accountData === null) {
      navigate("/login");
    } else {
      fetchAccountData(accountData.username).then((data: MalAccount) => {
        navigate("/account", {
          state: { malAccount: data },
        });
      });
    }
  };

  const handleClickSearchIcon = async () => {
    setSearching(!searching);
  };

  const handleClickLibrary = async () => {
    navigate("/library");
  };

  const handleClickLogo = async () => {
    navigate("/");
  };

  const handleClick = async () =>
    searchInput === ""
      ? null
      : fetchMangaByTitle(searchInput, 10).then((data: Manga[]) => {
          navigate("/mangaCoverList", {
            state: { listType: "SearchResults", manga: data },
          });
        });

  return (
    <div className="container-header">
      <div className="search-section">
        <Button onClick={() => handleClickLogo()} className="logo-header-icon">
          <HomeIcon sx={{ width: "80%", height: "80%" }} />
        </Button>
        <div>
          {searching ? (
            <div className="search-functionality-container">
              <Button
                className="header-buttons"
                onClick={() => handleClickSearchIcon()}
              >
                <ArrowBackIcon />
              </Button>
              <TextField
                variant="outlined"
                focused
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
            <div>
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
                  <Typography className="header-nav-label">Library</Typography>
                </div>
              </Button>
              <Button className="header-buttons">
                <div className="header-nav-dialog-columns">
                  <WhatsHotIcon />
                  <Typography className="header-nav-label">Hot</Typography>
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
                  <Typography className="header-nav-label">Account</Typography>
                </div>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
