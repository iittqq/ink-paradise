import React, { useState } from "react";
import { Button, Divider, Paper, TextField } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useLocation, useNavigate } from "react-router-dom";
import "./Login.css";

import { fetchAccountData } from "../../api/MalApi";

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
		<div className='box'>
			<Paper className='box-content'>
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
					<AccountBoxIcon className='account-icon' />

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
				<Divider className='divider' />

				<Button
					className='button'
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
