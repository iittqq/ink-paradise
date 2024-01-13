/* eslint-disable no-mixed-spaces-and-tabs */
import { useState } from "react";
import { TextField, Typography, Button, Divider, Popper } from "@mui/material";
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

const Header = () => {
	const navigate = useNavigate();
	//const [open, setOpen] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [loginOpen, setLoginOpen] = useState<boolean>(false);
	const [moreOpti0nsOpen, setMoreOptionsOpen] = useState<boolean>(false);

	const [username, setUsername] = useState<string>("");

	const handleLogin = async (username: string) => {
		fetchAccountData(username).then((data) => {
			console.log(data);
			navigate("/account", {
				state: { account: data },
			});
		});
	};

	const handleClickAccount = () => {
		setLoginOpen(true);
	};

	const handleClickMoreOptions = () => {
		setMoreOptionsOpen(true);
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

				<Button onClick={handleClickMoreOptions} sx={{ color: "white" }}>
					<MoreVertIcon />

					<Popper open={moreOpti0nsOpen}>
						<div className='more-options-container'>
							<Button
								className='nav-buttons'
								onClick={() => handleClickLibrary()}
							>
								<BookIcon />
							</Button>
							<Button className='nav-buttons'>
								<WhatsHotIcon />
							</Button>
							<Button className='nav-buttons' onClick={handleClickAccount}>
								<AccountBoxIcon />
							</Button>
							<Popper open={loginOpen}>
								<div className='login-dialog-box'>
									<div className='top-section-form'>
										<AccountBoxIcon className='account-icon' />

										<TextField
											variant='outlined'
											focused
											label='Username'
											size='small'
											onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
												if (e.key === "Enter") {
													handleLogin(username);
													console.log(username);
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
									<Divider className='divider' />

									<Button
										className='account-details-submit-button'
										onClick={() => {
											handleLogin(username);
										}}
									>
										Login
									</Button>
								</div>
							</Popper>
						</div>
					</Popper>
				</Button>

				<Button className='search-button' onClick={() => handleClick()}>
					<KeyboardArrowRightIcon />
				</Button>
			</div>
		</div>
	);
};

export default Header;
