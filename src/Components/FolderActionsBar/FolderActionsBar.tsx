import { useState } from "react";
import { Button, Typography, Dialog, DialogTitle } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";
import "./FolderActionsBar.css";

type Props = {
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchFolders: () => void;
  handleClickBack: () => void;
  handleDeleteMangaEntries: () => void;
  handleDeleteMangaFolders: () => void;
  checked: boolean;
  toggleMangaEntriesDelete: (value: boolean) => void;
  handleClickAddFolderButton: () => void;
  handleFolderDialogClose: () => void;
  handleCreateFolder: () => void;
  openAddFolder: boolean;
  selectedFolder: MangaFolder | null;
  newFolderName: string;
  handleFolderNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFolderDescriptionChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

const FolderActionsBar = (props: Props) => {
  const {
    handleInput,
    searchFolders,
    handleClickBack,
    handleDeleteMangaEntries,
    handleDeleteMangaFolders,
    checked,
    toggleMangaEntriesDelete,
    handleClickAddFolderButton,
    handleFolderDialogClose,
    handleCreateFolder,
    openAddFolder,
    selectedFolder,
    newFolderName,
    handleFolderNameChange,
    handleFolderDescriptionChange,
  } = props;
  const [searching, setSearching] = useState(false);

  return (
    <div className="folder-section-header">
      <div className="header-options-left">
        {selectedFolder !== null ? (
          <div className="folder-options">
            <Button
              className="back-button"
              onClick={() => {
                handleClickBack();
              }}
            >
              <ArrowBackIcon />
            </Button>
          </div>
        ) : null}
        {searching ? (
          <div>
            <input
              type="search"
              placeholder="Search Folders"
              className="folder-search-bar"
              onChange={(event) => {
                handleInput(event);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchFolders();
                  setSearching(!searching);
                }
              }}
            />
            <Button
              className="search-button"
              onClick={() => {
                searchFolders();
                setSearching(!searching);
              }}
            >
              <SearchIcon />
            </Button>
          </div>
        ) : (
          <Button
            className="search-button"
            onClick={() => {
              setSearching(!searching);
            }}
          >
            <SearchIcon />
          </Button>
        )}
      </div>
      <div className="create-folder-container">
        {checked ? (
          <Button
            className="delete-folder-button"
            sx={{
              backgroundColor: "#ff7597",
            }}
            onClick={() => {
              toggleMangaEntriesDelete(false);
              if (selectedFolder !== null) {
                handleDeleteMangaEntries();
              } else {
                handleDeleteMangaFolders();
              }
            }}
          >
            <ClearIcon />{" "}
          </Button>
        ) : (
          <Button
            className="delete-folder-button"
            sx={{
              backgroundColor: "none",
            }}
            onClick={() => {
              toggleMangaEntriesDelete(true);
            }}
          >
            <DeleteIcon />
          </Button>
        )}
        <Button
          className="add-folder-button"
          onClick={() => {
            handleClickAddFolderButton();
          }}
        >
          <AddIcon sx={{ height: "30px", width: "30px" }} />
        </Button>
        <Dialog
          id="folder-dialog"
          open={openAddFolder}
          onClose={() => {
            handleFolderDialogClose();
          }}
        >
          <DialogTitle>Create Folder</DialogTitle>
          <div className="create-folder-fields">
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
                  } else {
                    console.log("no name");
                  }
                }
              }}
            />
            <Button
              className="create-button"
              onClick={() => {
                handleCreateFolder();
              }}
            >
              Create
            </Button>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default FolderActionsBar;
