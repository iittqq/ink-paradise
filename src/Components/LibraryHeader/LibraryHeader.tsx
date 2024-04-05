import { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ListIcon from "@mui/icons-material/List";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";

import "./LibraryHeader.css";

type Props = {
  searchFavorites: (searchValue: string) => void;
  handleAscendingChange: () => void;
  handleContentFilter: (selection: string) => void;
  checked: boolean;
  toggleLibraryEntries: (value: boolean) => void;
  handleDeleteLibraryEntries: () => void;
};

const LibraryHeader = (props: Props) => {
  const {
    searchFavorites,
    handleAscendingChange,
    handleContentFilter,
    checked,
    toggleLibraryEntries,
    handleDeleteLibraryEntries,
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
    <div className="library-header">
      <Typography padding={1} fontSize={20}>
        Library
      </Typography>
      <div className="library-header-options">
        {searching ? (
          <div className="library-input-section">
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
        {checked ? (
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
            }}
          >
            <Button
              onClick={() => {
                handleContentFilter("Favorites");
              }}
              className="filter-button"
            >
              Favorites
            </Button>
            <Button
              onClick={() => {
                handleContentFilter("Dropped -");
              }}
              className="filter-button"
            >
              Dropped
            </Button>
            <Button
              onClick={() => {
                handleContentFilter("On-Hold");
              }}
              className="filter-button"
            >
              On-Hold
            </Button>
            <Button
              onClick={() => {
                handleContentFilter("Completed");
              }}
              className="filter-button"
            >
              Completed
            </Button>
            <Button
              onClick={() => {
                handleContentFilter("Reading");
              }}
              className="filter-button"
            >
              Reading
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LibraryHeader;
