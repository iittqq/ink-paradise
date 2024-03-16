import {
  Button,
  FormControlLabel,
  Switch,
  Typography,
  Dialog,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";
import "./FolderActionsBar.css";

type Props = {
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchFolders: () => void;
  handleClickBack: () => void;
  handleDeleteMangaEntries: () => void;
  handleDeleteMangaFolders: () => void;
  checked: boolean;
  toggleMangaEntriesDelete: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
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
  return (
    <div className="folder-section-header">
      <div className="header-options-left">
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
            }
          }}
        />
        <Button
          className="search-button"
          onClick={() => {
            searchFolders();
          }}
        >
          <SearchIcon />
        </Button>
        {selectedFolder !== null ? (
          <div className="folder-options">
            <Button
              className="back-button"
              onClick={() => {
                handleClickBack();
              }}
            >
              Back
            </Button>
          </div>
        ) : null}
      </div>
      <div className="create-folder-container">
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
              if (checked && selectedFolder !== null) {
                handleDeleteMangaEntries();
              } else {
                handleDeleteMangaFolders();
              }
            }}
          >
            {selectedFolder !== null ? "Delete Manga" : "Delete Folder"}
          </Button>
          <FormControlLabel
            control={
              <Switch checked={checked} onChange={toggleMangaEntriesDelete} />
            }
            label="Select"
          />
        </div>

        <Button
          className="add-folder-button"
          onClick={() => {
            handleClickAddFolderButton();
          }}
        >
          <AddIcon />
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
