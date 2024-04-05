import { Button, Typography, Grid, Dialog, DialogTitle } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../Components/Header/Header";
import FolderGrid from "../../Components/FolderGrid/FolderGrid";
import { UserMangaLogistics } from "../../interfaces/MalInterfaces";
import InfoIcon from "@mui/icons-material/Info";
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
  const [userMangaData, setUserMangaData] = useState<UserMangaLogistics[]>([]);
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
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [openAddFolder, setOpenAddFolder] = useState<boolean>(false);
  const [mangaFoldersToDelete, setMangaFoldersToDelete] = useState<number[]>(
    [],
  );
  const [accountData, setAccountData] = useState<Account | null>(null);

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
    if (checked) {
      if (mangaEntriesToDelete.includes(manga.id)) {
        setMangaEntriesToDelete(
          mangaEntriesToDelete.filter((id) => id !== manga.id),
        );
      } else {
        console.log(manga);
        setMangaEntriesToDelete([...mangaEntriesToDelete, manga.id]);
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

  useEffect(() => {
    const accountString = window.localStorage.getItem("account") as
      | string
      | null;
    let account: Account | null = null;
    if (accountString !== null) {
      setAccountData(JSON.parse(accountString));
      account = JSON.parse(accountString) as Account | null;
    }
    setUserMangaData(
      Object.keys(state.malAccount.statistics.manga).map((key) => [
        key,
        state.malAccount.statistics.manga[key],
      ]),
    );

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
          <img
            className="user-image"
            src={state.malAccount.images.jpg.image_url}
            alt="profile"
          ></img>
        </div>
        <Typography color="white" className="user-details">
          {state.malAccount.username} <br /> <br />
          About:&nbsp;
          {state.malAccount.about}
          <br />
          Gender:&nbsp;
          {state.malAccount.gender}
          <br />
          Birthday:&nbsp;
          {state.malAccount.birthday}
          <br />
        </Typography>

        <div className="info-button-container">
          <Button
            className="info-open-button"
            onClick={() => {
              setOpenInfo(true);
            }}
          >
            <InfoIcon />
          </Button>
          <Dialog
            id="info-dialog"
            open={openInfo}
            onClose={() => {
              setOpenInfo(false);
            }}
          >
            <DialogTitle>Stats</DialogTitle>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {userMangaData.map((current: UserMangaLogistics) => (
                <Grid item>
                  <Typography color="white" sx={{ padding: "8px" }}>
                    {current[0]}: {current[1]} <br />
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Dialog>
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
        />
      </div>
    </div>
  );
};

export default AccountPage;
