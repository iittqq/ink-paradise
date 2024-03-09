import { Button, Typography, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import Header from "../../Components/Header/Header";

import MangaClickable from "../../Components/MangaClickable/MangaClickable";
import { UserMangaLogistics } from "../../interfaces/MalInterfaces";

import { addMangaFolder, getMangaFolders } from "../../api/MangaFolder";
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
        <div>
          <input
            type="search"
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
            <Button
              className="back-button"
              onClick={() => {
                setSelectedFolder(null);
              }}
            >
              Back
            </Button>
          ) : null}
        </div>
        <div className="create-folder-container">
          <div className="create-folder-fields">
            <Typography>Name</Typography>{" "}
            <input onChange={(e) => setNewFolderName(e.target.value)} />
            <Typography>Description</Typography>
            <input onChange={(e) => setNewFolderDescription(e.target.value)} />
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
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          direction="row"
          spacing={2}
        >
          {selectedFolder === null
            ? folders.map((folder) => (
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
                      >
                        {folder.folderDescription}
                      </Typography>
                    </div>
                  </Button>
                </Grid>
              ))
            : folderMangaData?.map((element: Manga) => (
                <Grid item>
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
              ))}
        </Grid>
      </div>
    </div>
  );
};

export default Account;
