import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";

import {
  fetchAccountDetails,
  updateAccountDetails,
} from "../../api/AccountDetails";

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
  const [accountData, setAccountData] = useState<Account>(
    window.localStorage.getItem("account") as unknown as Account,
  );
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [headerPicture, setHeaderPicture] = useState<File | null>(null);
  const [contentFilter, setContentFilter] = useState<string>("");
  const [birthdayDayJs, setBirthdayDayJs] = useState<Dayjs | null>(dayjs());
  const [accountExists, setAccountExists] = useState<boolean>(false);

  const [accountDetailsId, setAccountDetailsId] = useState<number>();

  const handleChangeNewContentFilter = (event: SelectChangeEvent) => {
    setContentFilter(event.target.value as string);
  };
  const handleEditAccountInfo = () => {
    console.log(accountData?.id);
    console.log(username);
    console.log(bio);
    console.log(profilePicture);
    console.log(headerPicture);
    console.log(contentFilter);
    console.log(dayjs(birthdayDayJs).format("YYYY-MM-DD"));
    console.log(accountExists);
    const accountId: number = accountData.id!;
    const birthday = dayjs(birthdayDayJs).format("YYYY-MM-DD") as string;

    if (profilePicture !== undefined || headerPicture !== undefined) {
      updateAccountDetails({
        id: accountDetailsId,
        accountId,
        bio,
        profilePicture,
        headerPicture,
        birthday,
        contentFilter: Number(contentFilter),
      }).then((data) => {
        console.log(data);
      });
    }
  };
  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value);
  };

  const handleHeaderImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log(event);
    setHeaderPicture(event.target.files![0]);
  };
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log(event);
    setProfilePicture(event.target.files![0]);
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

  useEffect(() => {
    const accountString = window.localStorage.getItem("account") as string;

    let account: Account | null = null;
    if (accountString !== null) {
      setAccountData(JSON.parse(accountString));
      account = JSON.parse(accountString) as Account | null;
      console.log(account);
      if (account !== null) {
        setUsername(account.username);
      }
    }

    if (account !== null) {
      getMangaFolders().then((response) => {
        setFolders(response.filter((folder) => folder.userId === account!.id));
      });
    }

    fetchAccountDetails(account!.id).then((data) => {
      console.log(data);
      if (data) {
        setAccountDetailsId(data.id);
        if (data.bio !== null) {
          setBio(data.bio);
        }
        setBirthdayDayJs(dayjs(data.birthday));
      } else {
        setAccountExists(false);
      }
    });
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
              <div className="edit-info-fields-container">
                <Typography color="white" fontFamily="Figtree">
                  Username
                </Typography>
                <input
                  type="username"
                  className="edit-info-fields"
                  placeholder="Username"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>
              <div className="edit-info-fields-container">
                <Typography color="white" fontFamily="Figtree">
                  Bio
                </Typography>
                <textarea
                  className="edit-bio-field"
                  placeholder="Bio"
                  rows={5}
                  defaultValue={bio}
                  onChange={handleBioChange}
                />
              </div>
              <div className="edit-info-fields-container">
                <Typography color="white" fontFamily="Figtree">
                  Profile Picture
                </Typography>
                <label
                  htmlFor="profile-picture-file-upload"
                  className="custom-file-upload"
                >
                  <i></i> Upload
                </label>
                <input
                  id="profile-picture-file-upload"
                  type="file"
                  onChange={handleProfilePictureChange}
                />{" "}
              </div>
              <div className="edit-info-fields-container">
                <Typography color="white" fontFamily="Figtree">
                  Header Picture
                </Typography>
                <label
                  htmlFor="header-picture-file-upload"
                  className="custom-file-upload"
                >
                  <i></i> Upload
                </label>
                <input
                  id="header-picture-file-upload"
                  type="file"
                  onChange={handleHeaderImageChange}
                />{" "}
              </div>
              <div className="edit-info-fields-container">
                <Typography color="white" fontFamily="Figtree">
                  Content Filter
                </Typography>
                <FormControl fullWidth>
                  <Select
                    id="edit-content-filter-select"
                    className="edit-content-filter-dropdown"
                    value={contentFilter}
                    label="Content Filter"
                    variant="standard"
                    disableUnderline={true}
                    onChange={handleChangeNewContentFilter}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: "white",
                      },
                    }}
                    MenuProps={{
                      PaperProps: { style: { backgroundColor: "#333333" } },
                    }}
                  >
                    <MenuItem className="edit-content-menu-item" value={1}>
                      Safe
                    </MenuItem>
                    <MenuItem className="edit-content-menu-item" value={2}>
                      Suggestive
                    </MenuItem>
                    <MenuItem className="edit-content-menu-item" value={3}>
                      Explicit
                    </MenuItem>
                    <MenuItem className="edit-content-menu-item" value={4}>
                      Pornographic
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="edit-info-fields-container">
                <Typography color="white" fontFamily="Figtree">
                  Birthday
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="edit-birthday-field"
                    slotProps={{
                      textField: { error: false },
                    }}
                    sx={{
                      svg: { color: "white" },
                      input: { color: "white" },
                      label: { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                    }}
                    defaultValue={birthdayDayJs}
                    onChange={(newValue) => {
                      setBirthdayDayJs(newValue);
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div className="edit-info-fields-container">
                <Button
                  className="save-new-info-button"
                  onClick={() => {
                    handleEditAccountInfo();
                  }}
                >
                  Save Changes
                </Button>
              </div>
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
