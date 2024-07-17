import { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  Grid,
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
import BookmarkIcon from "@mui/icons-material/Bookmark";

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
  libraryEntriesToDelete: string[];
  bookmarksToDelete: number[];
  handleBookmarkClick: () => void;
  handleDeleteBookmarks: () => void;
  contentFilter: string;
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
    libraryEntriesToDelete,
    bookmarksToDelete,
    handleBookmarkClick,
    handleDeleteBookmarks,
    contentFilter,
  } = props;
  const [openFilterDialog, setOpenFilterDialog] = useState<boolean>(false);
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [searching, setSearching] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBarValue(event.target.value);
  };

  const handleEnter = () => {
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
        <Typography fontFamily={"Figtree"} fontSize={17}>
          {contentFilter}
        </Typography>
      </div>{" "}
      <div className="library-header">
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
          <Button
            className="library-header-button"
            onClick={() => {
              handleBookmarkClick();
            }}
          >
            <BookmarkIcon />
          </Button>
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
                backgroundColor:
                  libraryEntriesToDelete.length !== 0 ||
                  bookmarksToDelete.length !== 0
                    ? "#ff7597"
                    : "transparent",
              }}
              onClick={() => {
                handleDeleteBookmarks();
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
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid>
                  <Button
                    onClick={() => {
                      handleContentFilter("Alphabetical Order");
                      setOpenFilterDialog(false);
                    }}
                    className="filter-button"
                  >
                    Alphabetical Order
                  </Button>
                </Grid>{" "}
                <Grid>
                  {" "}
                  <Button
                    onClick={() => {
                      handleContentFilter("Continue Reading");
                      setOpenFilterDialog(false);
                    }}
                    className="filter-button"
                  >
                    Continue Reading
                  </Button>
                </Grid>{" "}
                <Grid>
                  {" "}
                  <Button
                    onClick={() => {
                      handleContentFilter("Recently Updated");
                      setOpenFilterDialog(false);
                    }}
                    className="filter-button"
                  >
                    Recently Updated
                  </Button>
                </Grid>{" "}
                <Grid>
                  {" "}
                  <Button
                    onClick={() => {
                      handleContentFilter("Release Date");
                      setOpenFilterDialog(false);
                    }}
                    className="filter-button"
                  >
                    Release Date
                  </Button>
                </Grid>{" "}
                <Grid>
                  <Button
                    onClick={() => {
                      handleContentFilter("Content Rating");
                      setOpenFilterDialog(false);
                    }}
                    className="filter-button"
                  >
                    Content Rating
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    onClick={() => {
                      handleContentFilter("Publication Demographic");
                      setOpenFilterDialog(false);
                    }}
                    className="filter-button"
                  >
                    Publication Demographic
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default LibraryHeader;
