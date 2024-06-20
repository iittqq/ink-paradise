import { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ListIcon from "@mui/icons-material/List";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import "./LibraryHeader.css";

type Props = {
  searchFavorites: (searchValue: string) => void;
  handleAscendingChange: () => void;
  handleContentFilter: (selection: string) => void;
  checked: boolean;
  toggleLibraryEntries: (value: boolean) => void;
  handleDeleteLibraryEntries: () => void;
  toggleSelectAll: () => void;
  selectAll: boolean;
  header: string;
};

const LibraryHeader = (props: Props) => {
  const {
    searchFavorites,
    handleAscendingChange,
    handleContentFilter,
    checked,
    toggleLibraryEntries,
    handleDeleteLibraryEntries,
    toggleSelectAll,
    selectAll,
    header,
  } = props;
  const [openFilterDialog, setOpenFilterDialog] = useState<boolean>(false);
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [searching, setSearching] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBarValue(event.target.value);
  };

  const handleEnter = () => {
    console.log(searchBarValue);
    searchFavorites(searchBarValue);
    setSearchBarValue("");
  };

  const handleClickSearchIcon = async () => {
    setSearching(!searching);
  };

  return (
    <>
      <div className="library-contents-header">
        <Typography fontFamily={"Figtree"} fontSize={20}>
          {header}
        </Typography>
      </div>{" "}
      <div className="library-header">
        <Typography fontSize={20} fontFamily={"Figtree"}>
          Library
        </Typography>
        <div className="library-header-options">
          {searching ? (
            <div className="library-input-section">
              <Button
                className="library-header-button"
                onClick={() => handleClickSearchIcon()}
              >
                <ArrowBackIcon />
              </Button>
              <input
                type="search"
                placeholder="Search Library"
                className="library-search-bar"
                onChange={(event) => {
                  handleInput(event);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEnter();
                    handleClickSearchIcon();
                  }
                }}
              />
              <Button
                className="library-header-button"
                onClick={() => {
                  handleEnter();
                  handleClickSearchIcon();
                }}
              >
                <SearchIcon />
              </Button>
            </div>
          ) : (
            <Button
              className="library-header-button"
              onClick={() => {
                handleClickSearchIcon();
              }}
            >
              <SearchIcon />
            </Button>
          )}
          {selectAll ? (
            <Button
              className="library-header-button"
              sx={{
                backgroundColor: "#ff7597",
              }}
              onClick={() => {
                toggleSelectAll();
              }}
            >
              <CheckBoxIcon />{" "}
            </Button>
          ) : (
            <Button
              className="library-header-button"
              onClick={() => {
                toggleSelectAll();
              }}
            >
              <CheckBoxOutlineBlankIcon />
            </Button>
          )}
          {checked || selectAll ? (
            <Button
              className="library-header-button"
              sx={{
                backgroundColor: "#ff7597",
              }}
              onClick={() => {
                handleDeleteLibraryEntries();
                toggleLibraryEntries(false);
              }}
            >
              <ClearIcon />
            </Button>
          ) : (
            <Button
              className="library-header-button"
              sx={{
                backgroundColor: "none",
              }}
              onClick={() => {
                toggleLibraryEntries(true);
              }}
            >
              <DeleteIcon />
            </Button>
          )}
          <Button
            className="library-header-button"
            onClick={() => {
              handleAscendingChange();
            }}
          >
            <FilterListIcon />
          </Button>
          <Button
            className="library-header-button"
            onClick={() => {
              setOpenFilterDialog(true);
            }}
          >
            <ListIcon />
          </Button>
          <Dialog
            id="filter-dialog"
            open={openFilterDialog}
            onClose={() => {
              setOpenFilterDialog(false);
            }}
          >
            <DialogTitle
              sx={{
                backgroundColor: "#121212",
                color: "#ffffff",
                textAlign: "center",
                fontFamily: "Figtree",
              }}
            >
              Filter
            </DialogTitle>
            <DialogContent
              sx={{
                backgroundColor: "#121212",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                onClick={() => {
                  handleContentFilter("Alphabetical Order");
                }}
                className="filter-button"
              >
                Alphabetical Order
              </Button>

              <Button
                onClick={() => {
                  handleContentFilter("Continue Reading");
                }}
                className="filter-button"
              >
                Continue Reading
              </Button>
              <Button
                onClick={() => {
                  handleContentFilter("Recently Updated");
                }}
                className="filter-button"
              >
                Recently Updated
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default LibraryHeader;
