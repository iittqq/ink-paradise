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
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";
import "./FolderActionsBar.css";

type Props = {
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
  mangaFoldersToDelete: number[];
  mangaEntriesToDelete: string[];
  handleFolderBackgroundChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

const FolderActionsBar = (props: Props) => {
  const {
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
    mangaFoldersToDelete,
    mangaEntriesToDelete,
    handleFolderBackgroundChange,
  } = props;
  const [showAddedFolderAlert, setShowAddedFolderAlert] =
    useState<boolean>(false);

  return (
    <div className="folder-section-header">
      {selectedFolder !== null ? (
        <Button
          className="folder-header-button"
          sx={{ backgroundColor: "transparent !important" }}
          onClick={() => {
            handleClickBack();
          }}
        >
          <ArrowBackIcon />
        </Button>
      ) : null}
      {selectedFolder !== null ? (
        selectAll ? (
          <Button
            className="folder-header-button"
            sx={{
              backgroundColor: "transparent !important",
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
            sx={{
              backgroundColor: "transparent !important",
            }}
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
            backgroundColor:
              mangaFoldersToDelete.length !== 0 ||
              mangaEntriesToDelete.length !== 0
                ? "none"
                : "transparent !important",
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
          <ClearIcon />
        </Button>
      ) : (
        <Button
          className="folder-header-button"
          sx={{
            backgroundColor: "transparent !important",
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
        sx={{ backgroundColor: "transparent !important" }}
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
    </div>
  );
};

export default FolderActionsBar;
