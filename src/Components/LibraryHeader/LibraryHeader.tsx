import { useState } from "react";
import { Typography, Button, Dialog, DialogTitle } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ListIcon from "@mui/icons-material/List";

import "./LibraryHeader.css";

type Props = {
  searchFavorites: (searchValue: string) => void;
  handleAscendingChange: () => void;
  handleContentFilter: (selection: string) => void;
};

const LibraryHeader = (props: Props) => {
  const { searchFavorites, handleAscendingChange, handleContentFilter } = props;
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
                handleContentFilter("dropped");
              }}
            >
              Dropped
            </Button>
            <Button
              onClick={() => {
                handleContentFilter("on-hold");
              }}
            >
              On-Hold
            </Button>
            <Button
              onClick={() => {
                handleContentFilter("completed");
              }}
            >
              Completed
            </Button>
            <Button
              onClick={() => {
                handleContentFilter("reading");
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
