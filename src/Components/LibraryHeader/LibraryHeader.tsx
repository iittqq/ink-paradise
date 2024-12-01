import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  Grid,
  DialogContent,
  Typography,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ListIcon from "@mui/icons-material/List";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderDeleteIcon from "@mui/icons-material/FolderDelete";

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
  libraryEntriesToDelete: string[];
  handleClickAddFolderButton: () => void;
  handleFolderDialogClose: () => void;
  handleCreateFolder: () => void;
  openAddFolder: boolean;
  handleFolderNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFolderDescriptionChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleFolderBackgroundChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  newFolderName: string;
  mangaFoldersToDelete: number[];
  toggleMangaEntriesDelete: (value: boolean) => void;
  handleDeleteMangaFolders: () => void;
  checkedFolder: boolean;
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
    libraryEntriesToDelete,
    handleClickAddFolderButton,
    openAddFolder,
    handleFolderDialogClose,
    handleCreateFolder,
    handleFolderNameChange,
    handleFolderDescriptionChange,
    handleFolderBackgroundChange,
    newFolderName,
    mangaFoldersToDelete,
    toggleMangaEntriesDelete,
    handleDeleteMangaFolders,
    checkedFolder,
  } = props;
  const [openFilterDialog, setOpenFilterDialog] = useState<boolean>(false);
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [searching, setSearching] = useState(false);
  const [showAddedFolderAlert, setShowAddedFolderAlert] =
    useState<boolean>(false);

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
      <div className="library-header">
        <>
          {searching ? (
            <div className="library-input-section">
              <Button
                className="library-header-button"
                sx={{ backgroundColor: "transparent !important" }}
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
                sx={{ backgroundColor: "transparent !important" }}
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
              sx={{ backgroundColor: "transparent !important" }}
              onClick={() => {
                handleClickSearchIcon();
              }}
            >
              <SearchIcon />
            </Button>
          )}
          <Dialog
            id="create-folder-dialog"
            open={openAddFolder}
            onClose={() => {
              handleFolderDialogClose();
            }}
          >
            <DialogTitle
              sx={{
                color: "#ffffff",
                textAlign: "center",
                fontFamily: "Figtree",
              }}
            >
              Create Folder
            </DialogTitle>
            <DialogContent>
              <Typography fontFamily={"Figtree"}>Name</Typography>
              <input
                type="text"
                id="folderName"
                placeholder="New Folder Name"
                className="folder-inputs"
                onChange={(e) => handleFolderNameChange(e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateFolder();
                  }
                }}
              />
              <Typography fontFamily={"Figtree"}>Description</Typography>
              <input
                type="text"
                id="folderDescription"
                placeholder="New Folder Description"
                className="folder-inputs"
                onChange={(e) => handleFolderDescriptionChange(e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (newFolderName !== "") {
                      handleCreateFolder();
                    }
                  }
                }}
              />
              <Typography fontFamily={"Figtree"}>Background Url</Typography>
              <input
                type="text"
                id="folderBackground"
                placeholder="Folder Background Url"
                className="folder-inputs"
                onChange={(e) => handleFolderBackgroundChange(e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (newFolderName !== "") {
                      handleCreateFolder();
                    }
                  }
                }}
              />

              <Button
                className="create-button"
                onClick={() => {
                  handleCreateFolder();
                  setShowAddedFolderAlert(true);
                  setTimeout(() => {
                    setShowAddedFolderAlert(false);
                  }, 3000);
                }}
              >
                Create
              </Button>
            </DialogContent>
            {showAddedFolderAlert === true ? (
              <Alert
                variant="outlined"
                severity="success"
                className="manga-folder-alert"
              >
                Manga added to folder
              </Alert>
            ) : null}
          </Dialog>

          {selectAll ? (
            <Button
              className="library-header-button"
              sx={{ backgroundColor: "transparent !important" }}
              onClick={() => {
                toggleSelectAll();
              }}
            >
              <CheckBoxIcon />{" "}
            </Button>
          ) : (
            <Button
              className="library-header-button"
              sx={{ backgroundColor: "transparent !important" }}
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
                  libraryEntriesToDelete.length !== 0
                    ? "none"
                    : "transparent !important",
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
              sx={{ backgroundColor: "transparent !important" }}
              onClick={() => {
                toggleLibraryEntries(true);
              }}
            >
              <DeleteIcon />
            </Button>
          )}
          <Button
            className="library-header-button"
            sx={{ backgroundColor: "transparent !important" }}
            onClick={() => {
              handleClickAddFolderButton();
            }}
          >
            <CreateNewFolderIcon sx={{ width: "25px", height: "25px" }} />
          </Button>
          {checkedFolder ? (
            <Button
              className="library-header-button"
              sx={{
                backgroundColor:
                  mangaFoldersToDelete.length !== 0
                    ? "none"
                    : "transparent !important",
              }}
              onClick={() => {
                toggleMangaEntriesDelete(false);

                handleDeleteMangaFolders();
              }}
            >
              <ClearIcon />
            </Button>
          ) : (
            <Button
              className="library-header-button"
              sx={{
                backgroundColor: "transparent !important",
              }}
              onClick={() => {
                toggleMangaEntriesDelete(true);
              }}
            >
              <FolderDeleteIcon />
            </Button>
          )}

          <Button
            className="library-header-button"
            sx={{ backgroundColor: "transparent !important" }}
            onClick={() => {
              handleAscendingChange();
            }}
          >
            <FilterListIcon />
          </Button>
          <Button
            className="library-header-button"
            sx={{ backgroundColor: "transparent !important" }}
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
        </>
      </div>
    </>
  );
};

export default LibraryHeader;
