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
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";

import "./AccountPage.css";
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

interface AccountPageProps {
  account: Account | null;
  fetchAccount: () => void;
}

const AccountPage = ({ account, fetchAccount }: AccountPageProps) => {
  const navigate = useNavigate();

  const [accountData, setAccountData] = useState<Account | null>(account);

  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
    null,
  );
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
  const [openLogout, setOpenLogout] = useState<boolean>(false);
  const [readerMode, setReaderMode] = useState<number>(0);

  const handleChangeNewContentFilter = (event: SelectChangeEvent) => {
    setContentFilter(event.target.value as string);
  };

  const handleEditAccountInfo = () => {
    if (
      newPassword !== "" &&
      oldPassword !== "" &&
      newPassword === confirmNewPassword
    ) {
      updateAccountPassword({
        id: accountData!.id,
        oldPassword: oldPassword,
        newPassword: newPassword,
      }).then((data: Account) => {
        setAccountData(data);
      });
    }
    if (username !== accountData!.username) {
      console.log(username);
      updateAccountUsername({
        id: accountData!.id,
        username: username,
      }).then((data: Account) => {
        setAccountData(data);
      });
    }
    if (
      bio !== accountDetails?.bio ||
      profilePicture !== accountDetails?.profilePicture ||
      headerPicture !== accountDetails?.headerPicture ||
      contentFilter !== accountDetails?.contentFilter.toString()
    ) {
      updateAccountDetails(accountDetailsId!, {
        accountId: accountData!.id,
        bio,
        profilePicture,
        headerPicture,
        contentFilter: Number(contentFilter),
        readerMode,
        theme: accountDetails!.theme,
      }).then((data) => {
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
    if (event.target.value.trim() !== "") {
      setProfilePicture(event.target.value);
    } else {
      setProfilePicture(null);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    fetchAccount();
    navigate("/");
  };

  useEffect(() => {
    if (account !== null) {
      setAccountData(account);
      if (account !== null) {
        setUsername(account.username);
      }
    }

    fetchAccountDetails(account!.id).then((data) => {
      setAccountDetails(data);
      setAccountDetailsId(data.id);
      setContentFilter(data.contentFilter.toString());
      setProfilePicture(data.profilePicture);
      setHeaderPicture(data.headerPicture);
      setBio(data.bio);
      setReaderMode(data.readerMode);
    });
  }, []);

  return (
    <div className="user-page-container">
      <div className="utility-buttons">
        <Button
          className="info-open-button"
          onClick={() => {
            setOpenEdit(true);
          }}
        >
          <EditIcon />
        </Button>
        <Button
          className="info-open-button"
          onClick={() => {
            setOpenLogout(true);
          }}
        >
          <LogoutIcon sx={{ color: "red" }} />
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
        <div
          className="account-details-section"
          style={{
            marginLeft:
              accountDetails?.profilePicture === null ? "0px" : "10px",
          }}
        >
          <Typography color="white" className="user-details" fontSize={20}>
            {accountData?.username}
          </Typography>
          <Typography color="white" className="user-details" fontSize={14}>
            {accountDetails?.bio}
          </Typography>
        </div>
        <div className="confirm-logout-container">
          <Dialog
            id="logout-dialog"
            open={openLogout}
            onClose={() => {
              setOpenLogout(false);
            }}
          >
            <DialogTitle
              sx={{
                textAlign: "center",
                color: "#ffffff",
                fontFamily: "Figtree",
              }}
            >
              Are you sure you want to log out?
            </DialogTitle>
            <DialogContent className="logout-message-options">
              <Button className="logout-options" onClick={handleLogout}>
                Yes
              </Button>
              <Button
                className="logout-options"
                onClick={() => {
                  setOpenLogout(false);
                }}
              >
                No
              </Button>
            </DialogContent>
          </Dialog>
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
                    Chars: {150 - bio.length}
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
    </div>
  );
};

export default AccountPage;
