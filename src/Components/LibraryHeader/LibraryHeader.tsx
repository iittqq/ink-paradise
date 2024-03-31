import { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  FormControlLabel,
  Switch,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ListIcon from "@mui/icons-material/List";

import "./LibraryHeader.css";

type Props = {
  searchFavorites: (searchValue: string) => void;
  handleAscendingChange: () => void;
  handleContentFilter: (selection: string) => void;
  checked: boolean;
  toggleLibraryEntries: (event: React.ChangeEvent<HTMLInputElement>) => void;
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

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBarValue(event.target.value);
  };

  const handleEnter = () => {
    console.log(searchBarValue);
    searchFavorites(searchBarValue);
  };

  return (
    <div className="library-header">
      <Typography padding={1} fontSize={20}>
        Library
      </Typography>
      <div className="library-header-options">
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
            }
          }}
        />
        <div className="folder-modification-buttons">
          <Button
            className="delete-folder-button"
            sx={{
              backgroundColor: checked ? "#ff7597" : "#333333",
              "&.MuiButtonBase-root:hover": {
                backgroundColor: checked ? "#ff7597" : "#333333",
              },
            }}
            onClick={() => {
              handleDeleteLibraryEntries();
            }}
          >
            Delete
          </Button>
          <FormControlLabel
            control={
              <Switch checked={checked} onChange={toggleLibraryEntries} />
            }
            label=""
          />
        </div>

        <Button className="library-header-button">
          <SearchIcon />
        </Button>
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
          id="folder-dialog"
          open={openFilterDialog}
          onClose={() => {
            setOpenFilterDialog(false);
          }}
        >
          <DialogTitle>Filter</DialogTitle>
          <div>
            <Button
              onClick={() => {
                handleContentFilter("Favorites");
              }}
            >
              Favorites
            </Button>
            <Button
              onClick={() => {
                handleContentFilter("Dropped -");
              }}
            >
              Dropped
            </Button>
            <Button
              onClick={() => {
                handleContentFilter("On-Hold");
              }}
            >
              On-Hold
            </Button>
            <Button
              onClick={() => {
                handleContentFilter("Completed");
              }}
            >
              Completed
            </Button>
            <Button
              onClick={() => {
                handleContentFilter("Reading");
              }}
            >
              Reading
            </Button>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default LibraryHeader;
