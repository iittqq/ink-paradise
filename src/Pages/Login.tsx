import React, { useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";

import { fetchAccountData } from "../api/MalApi";

const Login = () => {
	const [username, setUsername] = useState<string>("");
	const { state } = useLocation();
	let navigate = useNavigate();

	const handleLogin = async (username: string) => {
		fetchAccountData(username).then((data) => {
			console.log(data);
			navigate("/account", {
				state: { account: data },
			});
		});
	};
	return (
		<div
			style={{
				width: "100%",
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: state === null ? "center" : "space-between",
				alignItems: "center",
			}}
		>
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
		</div>
	);
};

export default Login;
