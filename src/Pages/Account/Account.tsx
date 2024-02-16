import { Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import Header from "../../Components/Header/Header";

import { UserMangaLogistics } from "../../interfaces/MalInterfaces";

import { addMangaFolder } from "../../api/MangaFolder";
import "./Account.css";

const Account = () => {
  const { state } = useLocation();
  const [userMangaData, setUserMangaData] = useState<UserMangaLogistics[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [newFolderDescription, setNewFolderDescription] = useState<string>("");

  console.log(state.account);
  const searchFolders = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchTerm(event.currentTarget.value);
      console.log(event.currentTarget.value);
    }
  };

  const handleCreateFolder = async () => {
    console.log(newFolderName);
    console.log(newFolderDescription);
    console.log(localStorage.getItem("userId"));
    if (newFolderName !== "") {
      console.log("yes");
      addMangaFolder({
        userId: localStorage.getItem("userId"),
        folderName: newFolderName,
      }).then((response) => {
        console.log(response);
      });
    }
  };
  useEffect(() => {
    setUserMangaData(
      Object.keys(state.malAccount.statistics.manga).map((key) => [
        key,
        state.malAccount.statistics.manga[key],
      ]),
    );
  }, [state.malAccount]);
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
            onKeyDown={searchFolders}
          />
          <Button className="search-button">
            <SearchIcon />
          </Button>
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
        <Button className="folder">
          <Typography>Folder</Typography>
        </Button>
      </div>
    </div>
  );
};

export default Account;
