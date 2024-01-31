/* eslint-disable no-mixed-spaces-and-tabs */
import { useState } from "react";
import {
	TextField,
	Typography,
	Button,
	Menu,
	MenuItem,
	Popover,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./Header.css";
import { fetchMangaByTitle } from "../../api/MangaDexApi";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import { fetchAccountData } from "../../api/MalApi";
import BookIcon from "@mui/icons-material/Book";
import WhatsHotIcon from "@mui/icons-material/Whatshot";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Account } from "../../interfaces/AccountInterfaces";
type Props = {
	malAccount?: Account;
};

const Header = (props: Props) => {
	const { malAccount } = props;
	const navigate = useNavigate();

	const [searchInput, setSearchInput] = useState("");
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [username, setUsername] = useState<string>("");
	const [anchorElLogin, setAnchorElLogin] = useState<null | HTMLElement>(null);

	const handleLogin = async (username: string) => {
		fetchAccountData(username).then((data) => {
			console.log(data);
			navigate("/account", {
				state: { account: data },
			});
		});
	};
	const loginOpen = Boolean(anchorElLogin);
	const handleClickAccount = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (malAccount) {
			fetchAccountData(malAccount.username).then((data) => {
				navigate("/account", {
					state: { account: data },
				});
			});
		} else {
			setAnchorElLogin(event.currentTarget);
		}
	};

	const open = Boolean(anchorEl);
	const handleClickMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleCloseLogin = () => {
		setAnchorElLogin(null);
	};

	const handleClickLibrary = async () => {
		navigate("/library");
	};

	const handleClickLogo = async () => {
		navigate("/");
	};

	const handleClick = async () =>
		searchInput === ""
			? null
			: fetchMangaByTitle(searchInput).then((data: Manga[]) => {
					navigate("/mangaCoverList", {
						state: { listType: "SearchResults", manga: data },
					});
			  });

	return (
		<div className='container-header'>
			<Button onClick={() => handleClickLogo()}>
				<Typography textTransform='none' color='white'>
					Ink Paradise
				</Typography>
			</Button>

			<div className='search-section'>
				<TextField
					variant='outlined'
					focused
					size='small'
					className='input-field'
					onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
						if (e.key === "Enter") {
							handleClick();
						}
					}}
					onChange={(event) => {
						setSearchInput(event.target.value);
					}}
				/>

				<Button
					onClick={open === true ? handleClose : handleClickMenuOpen}
					className='header-buttons'
				>
					<MoreVertIcon />
					<Menu
						id='header-menu'
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
					>
						<MenuItem onClick={() => handleClickLibrary()}>
							<BookIcon />
						</MenuItem>
						<MenuItem>
							<WhatsHotIcon />
						</MenuItem>
					</Menu>
				</Button>
				<Button onClick={handleClickAccount} className='header-buttons'>
					<AccountBoxIcon />
				</Button>

				<Popover
					id='login-menu'
					anchorEl={anchorElLogin}
					open={loginOpen}
					onClose={handleCloseLogin}
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				>
					<div className='account-login'>
						<div className='logo-field-login'>
							<AccountBoxIcon className='login-logo' />

							<TextField
								variant='outlined'
								focused
								label='Username'
								size='small'
								onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
									if (e.key === "Enter") {
										handleLogin(username);
									}
								}}
								sx={{
									input: { color: "white" },
									"& label.Mui-focused": {
										color: "white",
									},
									"& .MuiOutlinedInput-root ": {
										"&.Mui-focused fieldset": {
											borderColor: "white",
										},
									},
								}}
								onChange={(event) => {
									setUsername(event.target.value);
								}}
							/>
						</div>

						<Button
							className='account-details-submit-button'
							onClick={() => {
								handleLogin(username);
							}}
						>
							Login
						</Button>
					</div>
				</Popover>

				<Button className='header-buttons' onClick={() => handleClick()}>
					<KeyboardArrowRightIcon />
				</Button>
			</div>
		</div>
	);
};

export default Header;
