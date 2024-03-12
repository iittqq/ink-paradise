import { Button, Typography, Grid, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import Header from "../../Components/Header/Header";

import MangaClickable from "../../Components/MangaClickable/MangaClickable";
import { UserMangaLogistics } from "../../interfaces/MalInterfaces";

import {
  addMangaFolder,
  deleteMangaFolder,
  getMangaFolders,
} from "../../api/MangaFolder";
import "./Account.css";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";
import { getMangaFolderEntries } from "../../api/MangaFolderEntry";
import { fetchMangaById } from "../../api/MangaDexApi";
import { Relationship, Manga } from "../../interfaces/MangaDexInterfaces";

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

  const [folderMangaData, setFolderMangaData] = useState<Manga[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteFolder = async () => {
    if (selectedFolder !== null) {
      deleteMangaFolder(selectedFolder?.folderId).then((response) => {
        setNewFolder(!newFolder);
        setSelectedFolder(null);
        console.log(response);
      });
    } else {
      console.log("no selected folder");
    }
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
    if (newFolderName !== "") {
      console.log("yes");
      setNewFolder(!newFolder);
      addMangaFolder({
        userId: localStorage.getItem("userId"),
        folderName: newFolderName,
        folderDescription: newFolderDescription,
      });
    }
    setNewFolder(!newFolder);
  };

  const fetchFolders = async () => {
    getMangaFolders().then((response) => {
      setFolders(
        response.filter(
          (folder) =>
            folder.userId === JSON.parse(localStorage.getItem("userId")),
        ),
      );
    });
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

  const handleFolderClick = async (folder: MangaFolder) => {
    setSelectedFolder(folder);
    setLoading(true);
    getMangaFolderEntries().then((response) => {
      const promises = response
        .filter((entry) => entry.folderId === folder.folderId)
        .map((entry) => {
          return fetchMangaById(entry.mangaId);
        });

      Promise.all(promises)
        .then((data) => {
          console.log(data);
          setFolderMangaData(data);
          setLoading(false);
        })
        .catch((error) => console.log(error));
    });
  };
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
        <div className="user-stats">
          {userMangaData.map((current: UserMangaLogistics) => (
            <Typography color="white" sx={{ padding: "8px" }}>
              {current[0]}: {current[1]} <br />
            </Typography>
          ))}
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
            <div>
              <Button
                className="back-button"
                onClick={() => {
                  setSelectedFolder(null);
                }}
              >
                Back
              </Button>
              <Button
                className="back-button"
                onClick={() => {
                  handleDeleteFolder();
                }}
              >
                Delete
              </Button>
            </div>
          ) : null}
        </div>
        <div className="create-folder-container">
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
              placeholder="New Folder Description"
              className="folder-inputs"
              onChange={(e) => setNewFolderDescription(e.target.value)}
            />
          </div>
          <Button
            className="add-folder-button"
            onClick={() => handleCreateFolder()}
          >
            <AddIcon />
          </Button>
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
                    handleFolderClick(folder);
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
              <Grid item key={element.id}>
                <MangaClickable
                  id={element.id}
                  title={element.attributes.title.en}
                  coverId={
                    element.relationships.find(
                      (i: Relationship) => i.type === "cover_art",
                    )?.id
                  }
                  updatedAt={element.attributes.updatedAt}
                ></MangaClickable>
              </Grid>
            ))
          )}
        </Grid>
      </div>
    </div>
  );
};

export default Account;
