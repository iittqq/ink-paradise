import {
	Cloud,
	ContentCopy,
	ContentCut,
	ContentPaste,
} from "@mui/icons-material";
import {
	Button,
	Divider,
	ListItemIcon,
	ListItemText,
	MenuItem,
	MenuList,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import React, { useState, useEffect } from "react";

const baseUrlMangaDex = "https://api.mangadex.org";
const baseUrlMal = "https://api.jikan.moe/v4";

const Account = () => {
	const [account, setAccount] = useState<any[]>([]);
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const [username, setUsername] = useState<string>("");

	const handleLogin = async (username: string) => {
		fetch(`${baseUrlMal}/users/${username}/full`)
			.then((response) => response.json())
			.then((account) => {
				setAccount(account.data);
				console.log(account.data);
			});
	};
	return (
		<div
			style={{
				width: "100%",
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: loggedIn === false ? "center" : "space-between",
				alignItems: "center",
			}}
		>
			{loggedIn === false ? (
				<Paper
					sx={{
						width: 300,
						maxWidth: "100%",
						backgroundColor: "#444444",
						padding: "10px",
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							width: "100%",
							height: "60px",
						}}
					>
						<AccountBoxIcon
							sx={{ height: "40px", width: "40px", color: "white" }}
						/>

						<TextField
							variant='outlined'
							focused
							label='Username'
							size='small'
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
					<Divider />

					<Button
						sx={{ color: "white" }}
						onClick={() => {
							handleLogin(username);
						}}
					>
						Login
					</Button>
				</Paper>
			) : (
				<div></div>
			)}
		</div>
	);
};

export default Account;
