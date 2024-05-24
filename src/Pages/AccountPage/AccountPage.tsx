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
import { useNavigate } from "react-router-dom";
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

import { AccountDetails } from "../../interfaces/AccountDetailsInterfaces";
import {
  updateAccountUsername,
  updateAccountPassword,
} from "../../api/Account";

import {
  fetchAccountDetails,
  updateAccountDetails,
} from "../../api/AccountDetails";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

const AccountPage = () => {
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
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
    null,
  );
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [headerPicture, setHeaderPicture] = useState<string | null>(null);
  const [contentFilter, setContentFilter] = useState<string>("");

  const [accountDetailsId, setAccountDetailsId] = useState<number>();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [viableBio, setViableBio] = useState<boolean>(true);

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
    const accountId: number = accountData.id!;
    if (
      newPassword !== "" &&
      oldPassword !== "" &&
      newPassword === confirmNewPassword
    ) {
      updateAccountPassword({
        id: accountId,
        oldPassword: oldPassword,
        newPassword: newPassword,
      }).then((data: Account) => {
        setAccountData(data);
      });
    }
    if (username !== accountData.username) {
      updateAccountUsername({ id: accountId, username: username }).then(
        (data: Account) => {
          setAccountData(data);
        },
      );
    }
    if (
      bio !== accountDetails?.bio ||
      profilePicture !== accountDetails?.profilePicture ||
      headerPicture !== accountDetails?.headerPicture ||
      contentFilter !== accountDetails?.contentFilter.toString()
    ) {
      updateAccountDetails(accountDetailsId!, {
        accountId,
        bio,
        profilePicture,
        headerPicture,
        contentFilter: Number(contentFilter),
      }).then((data) => {
        console.log(data);
        setAccountDetails(data);
      });
    }
    setOpenEdit(false);
  };
  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length <= 150) {
      setBio(event.target.value);
      setViableBio(true);
    } else {
      setViableBio(false);
      setBio(event.target.value);
    }
  };

  const handleOldPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setOldPassword(event.target.value);
  };

  const handleNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmNewPassword(event.target.value);
  };

  const handleHeaderImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.value.trim() !== "") {
      setHeaderPicture(event.target.value);
    } else {
      setHeaderPicture(null);
    }
  };
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log(event.target.value);
    console.log(event);
    if (event.target.value.trim() !== "") {
      setProfilePicture(event.target.value);
    } else {
      setProfilePicture(null);
    }
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
      setAccountDetails(data);
      setAccountDetailsId(data.id);
      setContentFilter(data.contentFilter.toString());
      setProfilePicture(data.profilePicture);
      setHeaderPicture(data.headerPicture);
      setBio(data.bio);
    });
  }, [newFolder]);

  return (
    <div className="user-page-container">
      <Header />
      <div className="utility-buttons">
        <Button
          className="info-open-button"
          sx={{ marginRight: "10px" }}
          onClick={() => {
            setOpenEdit(true);
          }}
        >
          <EditIcon />
        </Button>
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

      <div
        className="user-details-section"
        style={{
          backgroundImage:
            accountDetails !== null
              ? `url(${accountDetails!.headerPicture})`
              : "none",
        }}
      >
        {accountDetails !== null && accountDetails.profilePicture !== null ? (
          <img
            className="user-image"
            src={accountDetails.profilePicture!}
            alt="profile"
          ></img>
        ) : null}
        <div className="account-details-section">
          <Typography color="white" className="user-details">
            {accountData?.username}
          </Typography>
          <Typography color="white" className="user-details">
            {accountDetails?.bio}
          </Typography>
        </div>
        <div className="info-button-container">
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
                  defaultValue={bio !== null ? bio : ""}
                  onChange={handleBioChange}
                />
                {bio !== null ? (
                  <div className="bio-field-counter">
                    Chars: {bio.length}
                    &nbsp;
                    {viableBio ? <CheckIcon /> : <CloseIcon />}
                  </div>
                ) : null}
              </div>
              <div className="edit-info-fields-container">
                <Typography color="white" fontFamily="Figtree">
                  Profile Picture
                </Typography>

                <input
                  type="profile-picture"
                  className="edit-info-fields"
                  placeholder="Link"
                  value={profilePicture !== null ? profilePicture : ""}
                  onChange={handleProfilePictureChange}
                />
              </div>
              <div className="edit-info-fields-container">
                <Typography color="white" fontFamily="Figtree">
                  Header Picture
                </Typography>
                <input
                  className="edit-info-fields"
                  type="header-picture"
                  placeholder="Link"
                  value={headerPicture !== null ? headerPicture : ""}
                  onChange={handleHeaderImageChange}
                />
              </div>
              <div className="edit-info-fields-container">
                <Typography color="white" fontFamily="Figtree">
                  Old Password
                </Typography>
                <input
                  type="password"
                  className="edit-info-fields"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={handleOldPasswordChange}
                />
              </div>
              <div className="edit-info-fields-container">
                <Typography color="white" fontFamily="Figtree">
                  New Password
                </Typography>
                <input
                  type="password"
                  className="edit-info-fields"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />
              </div>
              <div className="edit-info-fields-container">
                <Typography color="white" fontFamily="Figtree">
                  Confirm New Password
                </Typography>
                <input
                  type="password"
                  className="edit-info-fields"
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={handleConfirmNewPasswordChange}
                />
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
                <Button
                  className="save-new-info-button"
                  disabled={!viableBio}
                  sx={{ opacity: !viableBio ? 0.5 : 1 }}
                  onClick={() => {
                    handleEditAccountInfo();
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </DialogContent>
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
        selectAll={selectAll}
        toggleSelectAll={toggleSelectAll}
      />
      <div className="personal-folders">
        {selectedFolder !== null ? (
          <div className="current-folder-header">
            {selectedFolder.folderName}
          </div>
        ) : null}
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
