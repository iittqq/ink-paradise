import { useState } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
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
  selectAll: boolean;
  toggleSelectAll: () => void;
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
    selectAll,
    toggleSelectAll,
  } = props;
  const [searching, setSearching] = useState<boolean>(false);
  const [showAddedFolderAlert, setShowAddedFolderAlert] =
    useState<boolean>(false);

  return (
    <div className="folder-section-header">
      <div className="header-options-left">
        {selectedFolder !== null ? (
          <div className="folder-options">
            <Button
              className="back-button-account-page"
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
        {selectedFolder !== null ? (
          selectAll ? (
            <Button
              className="folder-header-button"
              sx={{
                backgroundColor: "#ff7597",
              }}
              onClick={() => {
                toggleSelectAll();
              }}
            >
              <CheckBoxIcon />
            </Button>
          ) : (
            <Button
              className="folder-header-button"
              onClick={() => {
                toggleSelectAll();
              }}
            >
              <CheckBoxOutlineBlankIcon />
            </Button>
          )
        ) : null}
        {checked || selectAll ? (
          <Button
            className="folder-header-button"
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
            className="folder-header-button"
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
          className="folder-header-button"
          onClick={() => {
            handleClickAddFolderButton();
          }}
        >
          <CreateNewFolderIcon sx={{ width: "25px", height: "25px" }} />
        </Button>
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
      </div>
    </div>
  );
};

export default FolderActionsBar;
