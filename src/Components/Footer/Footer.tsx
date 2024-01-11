import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import WhatsHotIcon from "@mui/icons-material/Whatshot";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { Button, Divider, Popover, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Footer.css";
import { useState } from "react";
import { fetchAccountData } from "../../api/MalApi";

const Footer = () => {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

	const [username, setUsername] = useState<string>("");

	const handleLogin = async (username: string) => {
		fetchAccountData(username).then((data) => {
			console.log(data);
			navigate("/account", {
				state: { account: data },
			});
		});
	};

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClickHome = async () => {
		navigate("/");
	};
	/** 
	const handleClickProfile = async () => {
		navigate("/login");
	};
*/
	const handleClickLibrary = async () => {
		navigate("/library");
	};

	const open = Boolean(anchorEl);

	return (
		<div className='container'>
			<Button className='nav-buttons' onClick={() => handleClickHome()}>
				<HomeIcon />
			</Button>
			<Button className='nav-buttons' onClick={() => handleClickLibrary()}>
				<BookIcon />
			</Button>
			<Button className='nav-buttons'>
				<WhatsHotIcon />
			</Button>
			<Button className='nav-buttons' onClick={handleClick}>
				<AccountBoxIcon />
			</Button>
			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorReference='anchorEl'
			>
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
			</Popover>
		</div>
	);
};

export default Footer;
