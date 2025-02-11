import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import InfoIcon from "@mui/icons-material/Info";
import StyleIcon from "@mui/icons-material/Style";
import RawOnIcon from "@mui/icons-material/RawOn";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";
import { MangaTagsInterface } from "../../interfaces/MangaDexInterfaces";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { addMangaFolder } from "../../api/MangaFolder";
import "./MangaPageButtonHeader.css";

type Props = {
  mangaRaw: string;
  folders: MangaFolder[];
  mangaAltTitles: object[];
  mangaTags: MangaTagsInterface[];
  id: string;
  handleClickOpen: () => void;
  handleOpenCategories: () => void;
  handleCloseCategories: () => void;
  handleOpenInfo: () => void;
  handleCloseInfo: () => void;
  handleClose: () => void;
  handleAddToFolder: (folderId: number, mangaId: string) => void;
  open: boolean;
  showInfoToggled: boolean;
  showCategoriesToggled: boolean;
  mangaExistsError: boolean;
  mangaContentRating: string;
  mangaAddedAlert: boolean;
  handleMangaCategoryClicked: (category: MangaTagsInterface) => void;
  handleAddToLibrary: () => void;
  libraryEntryExists: boolean;
  accountId: number | null;
  setFolders: (folders: MangaFolder[]) => void;
  loading?: boolean;
};

const MangaPageButtonHeader = (props: Props) => {
  const {
    mangaRaw,
    folders,
    mangaAltTitles,
    mangaTags,
    id,
    handleAddToFolder,
    handleClickOpen,
    handleCloseCategories,
    handleOpenCategories,
    handleCloseInfo,
    handleOpenInfo,
    handleClose,
    open,
    showInfoToggled,
    showCategoriesToggled,
    mangaExistsError,
    mangaContentRating,
    mangaAddedAlert,
    handleMangaCategoryClicked,
    handleAddToLibrary,
    libraryEntryExists,
    accountId,
    setFolders,
    loading,
  } = props;

  const [openAddFolder, setOpenAddFolder] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [newFolderDescription, setNewFolderDescription] = useState<string>("");
  const [folderBackground, setFolderBackground] = useState<string>("");
  useState<boolean>(false);

  const handleClickAddFolderButton = () => {
    setOpenAddFolder(true);
  };

  const handleFolderDialogClose = () => {
    setOpenAddFolder(false);
  };

  const handleCreateFolder = async () => {
    (document.getElementById("folderName") as HTMLInputElement).value = "";
    setNewFolderName("");
    setFolderBackground("");
    (document.getElementById("folderDescription") as HTMLInputElement).value =
      "";
    setNewFolderDescription("");
    if (newFolderName !== "") {
      if (accountId !== null) {
        try {
          const response = await addMangaFolder({
            userId: accountId,
            folderName: newFolderName,
            folderDescription: newFolderDescription,
            folderCover: folderBackground,
          });

          // Assuming response contains the created folder
          const newFolder = response;
          console.log(newFolder);

          // Update folders state with the new folder
          setFolders([...folders, newFolder]);

          // Reset inputs
          (document.getElementById("folderName") as HTMLInputElement).value =
            "";
          setNewFolderName("");
          setFolderBackground("");
          (
            document.getElementById("folderDescription") as HTMLInputElement
          ).value = "";
          setNewFolderDescription("");
          setOpenAddFolder(false);
        } catch (error) {
          console.error("Failed to create folder:", error);
        }
      }
    }
  };

  const handleFolderNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewFolderName(event.target.value);
  };

  const handleFolderDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewFolderDescription(event.target.value);
  };

  const handleFolderBackgroundChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFolderBackground(event.target.value);
  };

  return (
    <div className="manga-details-buttons-container">
      {libraryEntryExists === true ? (
        <Button className="individual-details-button">
          <BookmarkAddedIcon className="button-header-icon" />
        </Button>
      ) : accountId === null ? null : (
        <Button
          className="individual-details-button"
          disableFocusRipple
          disabled={loading}
          onClick={() => {
            handleAddToLibrary();
          }}
        >
          <BookmarkAddIcon className="button-header-icon" />
        </Button>
      )}
      {accountId === null ? null : (
        <Button
          className="individual-details-button"
          disableFocusRipple
          onClick={() => {
            handleClickOpen();
          }}
        >
          <FolderIcon className="button-header-icon" />
        </Button>
      )}
      <Dialog open={open} onClose={handleClose} id="folder-dialog">
        <DialogTitle sx={{ color: "#ffffff", textAlign: "center" }}>
          Select Folder
          <Button
            className="folder-header-button-create"
            onClick={() => {
              handleClickAddFolderButton();
            }}
          >
            <CreateNewFolderIcon className="button-header-icon" />
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
                }}
              >
                Create
              </Button>
            </DialogContent>
          </Dialog>
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            {folders.map((current: MangaFolder) => (
              <Grid item>
                <Button
                  className="folder-button"
                  onClick={() => {
                    if (current.folderId !== undefined) {
                      handleAddToFolder(current.folderId, id);
                    }
                  }}
                >
                  {current.folderName === ""
                    ? current.folderDescription === ""
                      ? "no name"
                      : current.folderDescription
                    : current.folderName}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        {mangaAddedAlert === true ? (
          <div className="manga-folder-alert">Manga added to folder</div>
        ) : null}

        {mangaExistsError === true ? (
          <div className="manga-folder-alert">
            Manga already exists in the folder
          </div>
        ) : null}
      </Dialog>

      <Button
        className="individual-details-button"
        onClick={() => {
          handleOpenCategories();
        }}
      >
        <StyleIcon className="button-header-icon" />
      </Button>
      <Dialog
        open={showCategoriesToggled}
        onClose={handleCloseCategories}
        id="folder-dialog"
      >
        <DialogTitle sx={{ color: "#ffffff", textAlign: "center" }}>
          Categories
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            {mangaTags.map((current: MangaTagsInterface) => (
              <Grid item>
                <Button
                  className="folder-button"
                  onClick={() => {
                    handleMangaCategoryClicked(current);
                  }}
                >
                  <Typography noWrap color="#ffffff">
                    {current.attributes.name.en}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
      <Button
        className="individual-details-button"
        onClick={() => {
          handleOpenInfo();
        }}
      >
        <InfoIcon className="button-header-icon" />
      </Button>
      <Dialog
        open={showInfoToggled}
        onClose={handleCloseInfo}
        id="folder-dialog"
      >
        <DialogTitle
          sx={{
            color: "#ffffff",
            textAlign: "center",
            fontFamily: "Figtree",
            fontSize: 30,
          }}
        >
          Information
        </DialogTitle>
        <div className="content-rating-container">
          <DialogTitle
            sx={{
              color: "#ffffff",
              textAlign: "center",
              fontFamily: "Figtree",
            }}
          >
            Content Rating:
          </DialogTitle>

          <Typography
            noWrap
            color="#ffffff"
            fontFamily="Figtree"
            fontSize={20}
            sx={{ textAlign: "center" }}
          >
            {mangaContentRating}
          </Typography>
        </div>
        <DialogTitle sx={{ color: "#ffffff", textAlign: "center" }}>
          Alt Titles
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            {mangaAltTitles.map((current) => (
              <Grid item>
                <Typography color="#ffffff" fontFamily="Figtree" fontSize={16}>
                  {Object.values(current)} /
                </Typography>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
      <Button className="individual-details-button" href={mangaRaw}>
        <RawOnIcon className="button-header-icon" />
      </Button>
    </div>
  );
};

export default MangaPageButtonHeader;
