import {
  Button,
  Typography,
  Grid,
  CircularProgress,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import Header from "../../Components/Header/Header";

import MangaClickable from "../../Components/MangaClickable/MangaClickable";
import { UserMangaLogistics } from "../../interfaces/MalInterfaces";
import InfoIcon from "@mui/icons-material/Info";
import {
  addMangaFolder,
  deleteMangaFolder,
  getMangaFolders,
} from "../../api/MangaFolder";
import "./Account.css";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";
import {
  findMangaFolderEntryById,
  deleteMangaFolderEntriesByFolderId,
  deleteMangaFolderEntriesByMangaId,
} from "../../api/MangaFolderEntry";
import { fetchMangaById } from "../../api/MangaDexApi";
import { Relationship, Manga } from "../../interfaces/MangaDexInterfaces";
import { MangaFolderEntry } from "../../interfaces/MangaFolderEntriesInterfaces";

const Account = () => {
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
  const [databaseMangaEntries, setDatabaseMangaEntries] = useState<
    MangaFolderEntry[] | null
  >(null);
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

  const handleDeleteMangaEntries = async () => {
    console.log(mangaEntriesToDelete);
    console.log(databaseMangaEntries);
    if (selectedFolder !== null) {
      mangaEntriesToDelete.forEach((mangaToDelete) => {
        deleteMangaFolderEntriesByMangaId(
          mangaToDelete,
          selectedFolder?.folderId,
        ).then((response) => {
          console.log(response);

          handleFolderClick(selectedFolder);
        });
      });
    }
    setChecked(false);
  };
  const toggleMangaEntriesDelete = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setChecked(event.target.checked);
    setMangaEntriesToDelete([]);
    setMangaFoldersToDelete([]);
    console.log(folderMangaData);
  };

  const handleDeleteMangaFolders = async () => {
    mangaFoldersToDelete.forEach((folderToDelete: number) => {
      deleteMangaFolder(folderToDelete).then((response) => {
        setNewFolder(!newFolder);
        console.log(response);
      });
      deleteMangaFolderEntriesByFolderId(folderToDelete);
    });
    setChecked(false);
  };

  const searchFolders = async () => {
    getMangaFolders().then((response) => {
      setFolders(
        response.filter(
          (folder) =>
            folder.folderName.includes(searchTerm) &&
            folder.userId === JSON.parse(localStorage.getItem("userId")),
        ),
      );
    });
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateFolder = async () => {
    document.getElementById("folderName").value = "";
    setNewFolderName("");
    document.getElementById("folderDescription").value = "";
    setNewFolderDescription("");
    if (newFolderName !== "") {
      console.log("yes");
      addMangaFolder({
        userId: localStorage.getItem("userId"),
        folderName: newFolderName,
        folderDescription: newFolderDescription,
      });
      setNewFolder(!newFolder);
    }
  };

  const fetchFolders = async () => {
    console.log(localStorage.getItem("userId"));
    getMangaFolders().then((response) => {
      setFolders(
        response.filter(
          (folder) =>
            folder.userId === JSON.parse(localStorage.getItem("userId")),
        ),
      );
    });
  };

  const handleFolderClick = async (folder: MangaFolder) => {
    setSelectedFolder(folder);
    setLoading(true);
    findMangaFolderEntryById(folder.folderId).then(
      (response: MangaFolderEntry[]) => {
        setDatabaseMangaEntries(response);
        console.log(response);
        const promises = response.map((entry: MangaFolderEntry) => {
          return fetchMangaById(entry.mangaId);
        });
        Promise.all(promises)
          .then((data) => {
            setFolderMangaData(data);
            setLoading(false);
          })
          .catch((error) => console.log(error));
      },
    );
  };
  useEffect(() => {
    setUserMangaData(
      Object.keys(state.malAccount.statistics.manga).map((key) => [
        key,
        state.malAccount.statistics.manga[key],
      ]),
    );
    fetchFolders();
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
        </div>
        <div>
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
                  setSelectedFolder(null);
                  setMangaEntriesToDelete([]);
                  setChecked(false);
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
              className="edit-folders"
              control={
                <Switch checked={checked} onChange={toggleMangaEntriesDelete} />
              }
              label="Select"
            />
          </div>

          <Button
            className="add-folder-button"
            onClick={() => {
              setOpenAddFolder(true);
            }}
          >
            <AddIcon />
          </Button>
          <Dialog
            id="folder-dialog"
            open={openAddFolder}
            onClose={() => {
              setOpenAddFolder(false);
              setNewFolder(!newFolder);
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
                onChange={(e) => setNewFolderName(e.target.value)}
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
                onChange={(e) => setNewFolderDescription(e.target.value)}
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
      <div className="personal-folders">
        <div>
          {selectedFolder !== null ? (
            <div className="current-folder-header">
              {selectedFolder.folderName}
            </div>
          ) : null}
        </div>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          direction="row"
          spacing={2}
          className="folder-grid"
        >
          {loading ? (
            <Grid item>
              <CircularProgress size={25} sx={{ color: "#ffffff" }} />
            </Grid>
          ) : selectedFolder === null ? (
            folders.map((folder) => (
              <Grid item>
                <Button
                  className="folder"
                  onClick={() => {
                    if (checked) {
                      if (mangaFoldersToDelete.includes(folder.folderId)) {
                        setMangaFoldersToDelete(
                          mangaFoldersToDelete.filter(
                            (id) => id !== folder.folderId,
                          ),
                        );
                      } else {
                        setMangaFoldersToDelete([
                          ...mangaFoldersToDelete,
                          folder.folderId,
                        ]);
                      }
                    } else {
                      handleFolderClick(folder);
                    }
                  }}
                  sx={{
                    //border: mangaEntriesToDelete.includes(element.id)
                    //? "2px solid #ffffff"
                    //: "none",
                    opacity: mangaFoldersToDelete.includes(folder.folderId)
                      ? 0.2
                      : 1,
                  }}
                >
                  <div>
                    <Typography
                      textTransform={"none"}
                      color={"#ffffff"}
                      fontFamily={"Figtree"}
                    >
                      {folder.folderName} <br />
                    </Typography>
                    <Typography
                      textTransform={"none"}
                      color={"#ffffff"}
                      fontSize={"12px"}
                      fontFamily={"Figtree"}
                      className="folder-description"
                    >
                      {folder.folderDescription}
                    </Typography>
                  </div>
                </Button>
              </Grid>
            ))
          ) : folderMangaData?.length === 0 ? (
            <Grid item>
              <Typography fontFamily={"Figtree"}>Empty...</Typography>
            </Grid>
          ) : (
            folderMangaData?.map((element: Manga) => (
              <Grid item>
                <Button
                  className="manga-entry-overlay-button"
                  onClick={() => {
                    if (checked) {
                      if (mangaEntriesToDelete.includes(element.id)) {
                        setMangaEntriesToDelete(
                          mangaEntriesToDelete.filter(
                            (id) => id !== element.id,
                          ),
                        );
                      } else {
                        console.log(element);
                        setMangaEntriesToDelete([
                          ...mangaEntriesToDelete,
                          element.id,
                        ]);
                      }
                    }
                  }}
                  sx={{
                    //border: mangaEntriesToDelete.includes(element.id)
                    //? "2px solid #ffffff"
                    //: "none",
                    opacity: mangaEntriesToDelete.includes(element.id)
                      ? 0.2
                      : 1,
                  }}
                >
                  <MangaClickable
                    id={element.id}
                    title={element.attributes.title.en}
                    coverId={
                      element.relationships.find(
                        (i: Relationship) => i.type === "cover_art",
                      )?.id
                    }
                    updatedAt={element.attributes.updatedAt}
                    disabled={checked}
                  />
                </Button>
              </Grid>
            ))
          )}
        </Grid>
      </div>
    </div>
  );
};

export default Account;
