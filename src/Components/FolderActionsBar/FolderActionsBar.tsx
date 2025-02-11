import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import EditIcon from "@mui/icons-material/Edit";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";
import "./FolderActionsBar.css";

type Props = {
  handleDeleteMangaEntries: () => void;
  handleDeleteMangaFolders: () => void;
  checked: boolean;
  toggleMangaEntriesDelete: (value: boolean) => void;
  handleClickAddFolderButton: () => void;
  handleFolderDialogClose: () => void;
  handleCreateFolder: () => void;
  openAddFolder: boolean;
  selectedFolder: MangaFolder | null;
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
  handleClickEditFolderButton: () => void;
  openEditFolder: boolean;
  handleEditFolder: () => void;
  handleEditFolderDialogClose: () => void;
  newFolderName: string | null;
  newFolderDescription: string | null;
  folderBackground: string | null;
};

const FolderActionsBar = (props: Props) => {
  const {
    handleDeleteMangaEntries,
    handleDeleteMangaFolders,
    checked,
    toggleMangaEntriesDelete,
    handleClickAddFolderButton,
    handleFolderDialogClose,
    handleCreateFolder,
    openAddFolder,
    selectedFolder,
    handleFolderNameChange,
    handleFolderDescriptionChange,
    selectAll,
    toggleSelectAll,
    mangaFoldersToDelete,
    mangaEntriesToDelete,
    handleFolderBackgroundChange,
    handleClickEditFolderButton,
    openEditFolder,
    handleEditFolder,
    handleEditFolderDialogClose,
    newFolderName,
    newFolderDescription,
    folderBackground,
  } = props;
  const [showAddedFolderAlert, setShowAddedFolderAlert] =
    useState<boolean>(false);

  return (
    <div className="folder-section-header">
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
          handleClickEditFolderButton();
        }}
      >
        <EditIcon sx={{ width: "25px", height: "25px" }} />
      </Button>{" "}
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
        open={openEditFolder}
        onClose={() => {
          handleEditFolderDialogClose();
        }}
      >
        <DialogTitle
          sx={{
            color: "#ffffff",
            textAlign: "center",
            fontFamily: "Figtree",
          }}
        >
          Edit Folder
        </DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditFolder();
          }}
        >
          {" "}
          <DialogContent>
            <input
              type="text"
              id="folderName"
              placeholder="New Folder Name"
              className="folder-inputs"
              value={newFolderName ?? ""}
              onChange={(e) => handleFolderNameChange(e)}
            />
            <input
              type="text"
              id="folderDescription"
              placeholder="New Folder Description"
              className="folder-inputs"
              value={newFolderDescription ?? ""}
              onChange={(e) => handleFolderDescriptionChange(e)}
            />
            <input
              type="text"
              id="folderBackground"
              placeholder="Folder Background Url"
              className="folder-inputs"
              value={folderBackground ?? ""}
              onChange={(e) => handleFolderBackgroundChange(e)}
            />
            <Button
              className="create-button"
              type="submit"
              onClick={() => {
                setShowAddedFolderAlert(true);
                setTimeout(() => {
                  setShowAddedFolderAlert(false);
                }, 3000);
              }}
            >
              Edit
            </Button>
          </DialogContent>
        </form>{" "}
        {showAddedFolderAlert === true ? (
          <div className="manga-folder-alert-action-bar">Folder Edited</div>
        ) : null}
      </Dialog>
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateFolder();
          }}
        >
          {" "}
          <DialogContent>
            <input
              type="text"
              id="folderName"
              placeholder="New Folder Name"
              className="folder-inputs"
              onChange={(e) => handleFolderNameChange(e)}
            />
            <input
              type="text"
              id="folderDescription"
              placeholder="New Folder Description"
              className="folder-inputs"
              onChange={(e) => handleFolderDescriptionChange(e)}
            />
            <input
              type="text"
              id="folderBackground"
              placeholder="Folder Background Url"
              className="folder-inputs"
              onChange={(e) => handleFolderBackgroundChange(e)}
            />

            <Button
              className="create-button"
              type="submit"
              onClick={() => {
                setShowAddedFolderAlert(true);
                setTimeout(() => {
                  setShowAddedFolderAlert(false);
                }, 3000);
              }}
            >
              Create
            </Button>
          </DialogContent>
        </form>{" "}
        {showAddedFolderAlert === true ? (
          <div className="manga-folder-alert-action-bar">Folder Created</div>
        ) : null}
      </Dialog>
    </div>
  );
};

export default FolderActionsBar;
