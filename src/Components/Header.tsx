import React, { useState } from "react";
import { Container, Grid, TextField, Typography, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const customTheme = createTheme({
	palette: {
		primary: { main: "#FFEEF4" },
		secondary: { main: "#94A684" },
	},
});
const primary = "#FFEEF4";
const secondary = "#94A684";

const Header = () => {
	const navigate = useNavigate();
	const [searchInput, setSearchInput] = useState("");

	const handleClickHome = async () => {
		navigate("/");
	};
	const handleClick = async () =>
		searchInput === ""
			? null
			: navigate("/mangaCoverList", {
					state: { listType: "Search Results", id: searchInput },
			  });

	const loginPrompt = () => {};

	return (
		<ThemeProvider theme={customTheme}>
			<div
				style={{
					marginLeft: "10px",
					marginRight: "10px",
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					height: "10vh",
				}}
			>
				<div>
					<Button onClick={() => handleClickHome()}>
						<Typography textTransform='none'>Ink Paradise</Typography>
					</Button>
				</div>

				<div
					style={{
						width: "50%",
						display: "flex",
						justifyContent: "flex-end",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Button onClick={() => loginPrompt()}>
						{" "}
						<Typography textTransform='none'>Login</Typography>
					</Button>
					<div style={{ paddingLeft: "20px" }}>
						<TextField
							variant='outlined'
							focused
							size='small'
							sx={{ input: { color: "white" } }}
							onKeyDown={(e: any) => {
								if (e.key === "Enter") {
									handleClick();
								}
							}}
							onChange={(event) => {
								setSearchInput(event.target.value);
							}}
						/>

						<Button onClick={() => handleClick()}>
							<KeyboardArrowRightIcon />
						</Button>
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
};

export default Header;
