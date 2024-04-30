import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header";
import FolderGrid from "../../Components/FolderGrid/FolderGrid";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import {
  addMangaFolder,
  deleteMangaFolder,
  getMangaFolders,
} from "../../api/MangaFolder";
import "./AccountPage.css";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";
import {
  findMangaFolderEntryById,
  deleteMangaFolderEntriesByFolderId,
  deleteMangaFolderEntriesByMangaId,
} from "../../api/MangaFolderEntry";
import { fetchMangaById } from "../../api/MangaDexApi";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import { MangaFolderEntry } from "../../interfaces/MangaFolderEntriesInterfaces";
import FolderActionsBar from "../../Components/FolderActionsBar/FolderActionsBar";
import { Account } from "../../interfaces/AccountInterfaces";

const AccountPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [newFolderDescription, setNewFolderDescription] = useState<string>("");
  const [folders, setFolders] = useState<MangaFolder[]>([]);
  const [newFolder, setNewFolder] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<MangaFolder | null>(
    null,
  );
  const [checked, setChecked] = useState<boolean>(false);
  const [folderMangaData, setFolderMangaData] = useState<Manga[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mangaEntriesToDelete, setMangaEntriesToDelete] = useState<string[]>(
    [],
  );
  const [openAddFolder, setOpenAddFolder] = useState<boolean>(false);
  const [mangaFoldersToDelete, setMangaFoldersToDelete] = useState<number[]>(
    [],
  );
  const [accountData, setAccountData] = useState<Account | null>(null);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [newProfilePicture, setNewProfilePicture] = useState<string>("");

  const hanandleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDescription(event.target.value);
  };

  const hanandleUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUsername(event.target.value);
  };

  const handleDeleteMangaEntries = async () => {
    if (selectedFolder !== null) {
      mangaEntriesToDelete.forEach((mangaToDelete) => {
        if (selectedFolder.folderId !== undefined) {
          deleteMangaFolderEntriesByMangaId(
            mangaToDelete,
            selectedFolder.folderId,
          ).then(() => {
            if (selectedFolder.folderId !== undefined) {
              handleFindingFolderEntriesById(selectedFolder.folderId);
            }
          });
        }
      });
    }
    setChecked(false);
    setSelectAll(false);
  };

  const toggleMangaEntriesDelete = (value: boolean) => {
    setChecked(value);
    setMangaEntriesToDelete([]);
    setMangaFoldersToDelete([]);
  };

  const handleDeleteMangaFolders = async () => {
    mangaFoldersToDelete.forEach((folderToDelete: number) => {
      deleteMangaFolder(folderToDelete).then(() => {
        setNewFolder(!newFolder);
      });
      deleteMangaFolderEntriesByFolderId(folderToDelete);
    });
    setChecked(false);
  };

  const searchFolders = async () => {
    getMangaFolders().then((response) => {
      console.log(searchTerm);
      if (accountData !== null) {
        setFolders(
          response.filter(
            (folder) =>
              folder.folderName.includes(searchTerm) &&
              folder.userId === Number(accountData.id),
          ),
        );
      }
    });
    setSearchTerm("");
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateFolder = async () => {
    (document.getElementById("folderName") as HTMLInputElement).value = "";
    setNewFolderName("");
    (document.getElementById("folderDescription") as HTMLInputElement).value =
      "";
    setNewFolderDescription("");
    if (newFolderName !== "") {
      if (accountData !== null) {
        addMangaFolder({
          userId: accountData.id,
          folderName: newFolderName,
          folderDescription: newFolderDescription,
        });
        setNewFolder(!newFolder);
      }
    }
  };

  const handleFindingFolderEntriesById = async (folderId: number) => {
    findMangaFolderEntryById(folderId).then((response: MangaFolderEntry[]) => {
      const promises = response.map((entry: MangaFolderEntry) => {
        return fetchMangaById(entry.mangaId);
      });
      Promise.all(promises)
        .then((data) => {
          setFolderMangaData(data);
          setLoading(false);
        })
        .catch((error) => console.log(error));
    });
  };

  const handleFolderClick = async (folder: MangaFolder) => {
    if (checked && folder.folderId !== undefined) {
      if (mangaFoldersToDelete.includes(folder.folderId)) {
        setMangaFoldersToDelete(
          mangaFoldersToDelete.filter((id) => id !== folder.folderId),
        );
      } else {
        setMangaFoldersToDelete([...mangaFoldersToDelete, folder.folderId]);
      }
    } else {
      setSelectedFolder(folder);
      setLoading(true);
      if (folder.folderId !== undefined) {
        handleFindingFolderEntriesById(folder.folderId);
      }
    }
  };

  const handleMangaEntryClick = async (manga: Manga) => {
    if (checked || selectAll) {
      if (mangaEntriesToDelete.includes(manga.id)) {
        setMangaEntriesToDelete(
          mangaEntriesToDelete.filter((id) => id !== manga.id),
        );
      } else {
        console.log(manga);
        setMangaEntriesToDelete([...mangaEntriesToDelete, manga.id]);
      }
      if (selectAll) {
        setSelectAll(false);
        setChecked(true);
      }
    }
  };

  const handleClickBack = () => {
    setSelectedFolder(null);
    setMangaEntriesToDelete([]);
    setChecked(false);
  };

  const handleFolderDialogClose = () => {
    setOpenAddFolder(false);
    setNewFolder(!newFolder);
  };

  const handleClickAddFolderButton = () => {
    setOpenAddFolder(true);
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

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setMangaEntriesToDelete([]);
    } else {
      if (folderMangaData !== null) {
        setMangaEntriesToDelete(folderMangaData.map((manga) => manga.id));
      }
    }
  };

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewProfilePicture(URL.createObjectURL(event.target.files![0]));
    console.log(URL.createObjectURL(event.target.files![0]));
    console.log(event.target.files![0]);
  };

  useEffect(() => {
    const accountString = window.localStorage.getItem("account") as
      | string
      | null;
    let account: Account | null = null;
    if (accountString !== null) {
      setAccountData(JSON.parse(accountString));
      account = JSON.parse(accountString) as Account | null;
      console.log(account);
    }

    if (account !== null) {
      getMangaFolders().then((response) => {
        setFolders(response.filter((folder) => folder.userId === account!.id));
      });
    }
  }, [state.malAccount, newFolder]);

  return (
    <div className="user-page-container">
      <Header />
      <div className="user-details-section">
        <div className="image-details-section">
          {/**
          <img
            className="user-image"
            src={}
            alt="profile"
          ></img>*/}
        </div>
        <Typography color="white" className="user-details">
          {accountData?.username}
        </Typography>

        <div className="info-button-container">
          <Button
            className="info-open-button"
            sx={{ marginRight: "10px" }}
            onClick={() => {
              setOpenEdit(true);
            }}
          >
            <EditIcon />
          </Button>
          <Dialog
            id="info-dialog"
            open={openEdit}
            onClose={() => {
              setOpenEdit(false);
            }}
          >
            <DialogTitle
              sx={{
                textAlign: "center",
                color: "#ffffff",
                fontFamily: "Figtree",
              }}
            >
              Account Information
            </DialogTitle>
            <DialogContent>
              <Grid
                container
                direction="column"
                justifyContent="space-evenly"
                alignItems="center"
              >
                <div className="edit-info-fields-container">
                  <Typography color="white" fontFamily="Figtree">
                    Username
                  </Typography>
                  <input
                    type="username"
                    className="edit-info-fields"
                    placeholder="Username"
                    value={username}
                    onChange={hanandleUsernameChange}
                  />
                </div>
                <div className="edit-info-fields-container">
                  <Typography color="white" fontFamily="Figtree">
                    Description
                  </Typography>
                  <input
                    type="description"
                    className="edit-info-fields"
                    placeholder="Description"
                    value={description}
                    onChange={hanandleDescriptionChange}
                  />
                </div>
                <div className="edit-info-fields-container">
                  <Typography color="white" fontFamily="Figtree">
                    Profile Picture
                  </Typography>
                  <label htmlFor="file-upload" className="custom-file-upload">
                    <i className="fa fa-cloud-upload"></i> Upload
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleProfilePictureChange}
                  />{" "}
                </div>
                <div className="edit-info-fields-container">
                  <Typography color="white" fontFamily="Figtree">
                    Content Filter
                  </Typography>
                  <select className="content-filter-edit-dropdown">
                    <option value="all" className="dropdown-options">
                      All
                    </option>
                    <option value="mature" className="dropdown-options">
                      Mature
                    </option>
                    <option value="explicit" className="dropdown-options">
                      Explicit
                    </option>
                  </select>
                </div>
                <div className="edit-info-fields-container">
                  <Button className="save-new-info-button">Save Changes</Button>
                </div>
              </Grid>
            </DialogContent>
          </Dialog>
          <Button
            className="info-open-button"
            sx={{ marginRight: "10px" }}
            onClick={() => {
              window.localStorage.clear();
              navigate("/");
            }}
          >
            <LogoutIcon />
          </Button>
        </div>
      </div>
      <FolderActionsBar
        handleInput={handleInput}
        searchFolders={searchFolders}
        handleClickBack={handleClickBack}
        handleDeleteMangaEntries={handleDeleteMangaEntries}
        handleDeleteMangaFolders={handleDeleteMangaFolders}
        checked={checked}
        toggleMangaEntriesDelete={toggleMangaEntriesDelete}
        handleClickAddFolderButton={handleClickAddFolderButton}
        handleFolderDialogClose={handleFolderDialogClose}
        handleCreateFolder={handleCreateFolder}
        openAddFolder={openAddFolder}
        selectedFolder={selectedFolder}
        newFolderName={newFolderName}
        handleFolderNameChange={handleFolderNameChange}
        handleFolderDescriptionChange={handleFolderDescriptionChange}
        selectAll={selectAll}
        toggleSelectAll={toggleSelectAll}
      />
      <div className="personal-folders">
        <div>
          {selectedFolder !== null ? (
            <div className="current-folder-header">
              {selectedFolder.folderName}
            </div>
          ) : null}
        </div>
        <FolderGrid
          folderClick={handleFolderClick}
          mangaEntryClick={handleMangaEntryClick}
          loading={loading}
          selectedFolder={selectedFolder}
          checked={checked}
          folders={folders}
          mangaFoldersToDelete={mangaFoldersToDelete}
          folderMangaData={folderMangaData}
          mangaEntriesToDelete={mangaEntriesToDelete}
          selectAll={selectAll}
        />
      </div>
    </div>
  );
};

export default AccountPage;
