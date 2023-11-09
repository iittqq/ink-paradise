import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Footer = () => {
	let navigate = useNavigate();

	const handleClickHome = async () => {
		navigate("/");
	};
	const handleClickProfile = async () => {
		navigate("/account");
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-evenly",
				alignContent: "center",
				flexDirection: "row",
				width: "100%",
			}}
		>
			<Button
				sx={{
					color: "white",
					backgroundColor: "transparent",
					"&.MuiButtonBase-root:hover": {
						bgcolor: "transparent",
					},
				}}
				onClick={() => handleClickHome()}
			>
				<HomeIcon />
			</Button>
			<Button
				sx={{
					color: "white",
					backgroundColor: "transparent",
					"&.MuiButtonBase-root:hover": {
						bgcolor: "transparent",
					},
				}}
			>
				<BookIcon />
			</Button>
			<Button
				sx={{
					color: "white",
					backgroundColor: "transparent",
					"&.MuiButtonBase-root:hover": {
						bgcolor: "transparent",
					},
				}}
			>
				<WhatshotIcon />
			</Button>
			<Button
				sx={{
					color: "white",
					backgroundColor: "transparent",
					"&.MuiButtonBase-root:hover": {
						bgcolor: "transparent",
					},
				}}
				onClick={() => handleClickProfile()}
			>
				<AccountBoxIcon />
			</Button>
		</div>
	);
};

export default Footer;
