import { useState } from "react";
import { TextField, Typography, Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./Header.css";
import { fetchMangaByTitle } from "../../api/MangaDexApi";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import { fetchAccountData } from "../../api/MalApi";
import BookIcon from "@mui/icons-material/Book";
import WhatsHotIcon from "@mui/icons-material/Whatshot";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { MalAccount } from "../../interfaces/MalInterfaces";

const Header = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickAccount = () => {
    if (localStorage.getItem("malAccount") === null) {
      navigate("/login");
    } else {
      fetchAccountData(localStorage.getItem("malAccount")!).then(
        (data: MalAccount) => {
          navigate("/account", {
            state: { malAccount: data },
          });
        },
      );
    }
  };

  const open = Boolean(anchorEl);
  const handleClickMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
      : fetchMangaByTitle(searchInput).then((data: Manga[]) => {
          navigate("/mangaCoverList", {
            state: { listType: "SearchResults", manga: data },
          });
        });

  return (
    <div className="container-header">
      <Button onClick={() => handleClickLogo()}>
        <Typography textTransform="none" color="white">
          Ink Paradise
        </Typography>
      </Button>

      <div className="search-section">
        <TextField
          variant="outlined"
          focused
          size="small"
          className="input-field"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              handleClick();
            }
          }}
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
        />

        <Button
          onClick={open === true ? handleClose : handleClickMenuOpen}
          className="header-buttons"
        >
          <MoreVertIcon />
          <Menu
            id="header-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <MenuItem onClick={() => handleClickLibrary()}>
              <BookIcon />
            </MenuItem>
            <MenuItem>
              <WhatsHotIcon />
            </MenuItem>
          </Menu>
        </Button>
        <Button
          onClick={() => {
            handleClickAccount();
          }}
          className="header-buttons"
        >
          <AccountBoxIcon />
        </Button>

        <Button className="header-buttons" onClick={() => handleClick()}>
          <KeyboardArrowRightIcon />
        </Button>
      </div>
    </div>
  );
};

export default Header;
