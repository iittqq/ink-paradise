import React, { useState, useRef } from "react";
import { Container, Grid, TextField, Typography, Button } from "@mui/material";
import {
	createTheme,
	ThemeProvider,
	Theme,
	useTheme,
} from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const customTheme = createTheme({
	palette: {
		primary: { main: "#FFEEF4" },
		secondary: { main: "#94A684" },
	},
});
const primary = "#FFEEF4";
const secondary = "#94A684";
const baseUrl = "https://api.mangadex.org/";
const Header = () => {
	const navigate = useNavigate();
	const [searchInput, setSearchInput] = useState("");

	const handleClick = async (input: any) => {
		console.log(input);
		const { data } = await axios.get(`${baseUrl}/manga`, {
			params: {
				limit: 10,
				title: input,
				contentRating: ["safe", "suggestive", "erotica"],
				order: {
					createdAt: "desc",
				},
			},
		});
		navigate("/results", {
			state: { mangaData: data.data },
		});
		console.log(data);
	};
	return (
		<ThemeProvider theme={customTheme}>
			<Container sx={{ height: "11vh", minWidth: "100%" }}>
				<Grid
					container
					direction='row'
					justifyContent='space-between'
					alignItems='center'
					sx={{
						color: "white",
						height: "10vh",
					}}
				>
					<Grid item>
						<Typography>Ink Paradise</Typography>
					</Grid>
					<Grid
						item
						sx={{
							width: "300px",
							display: "flex",
							justifyContent: "space-evenly",
						}}
					>
						<TextField
							variant='outlined'
							focused
							sx={{
								input: { color: "white" },
							}}
							onChange={(event) => {
								setSearchInput(event.target.value);
							}}
						/>

						<Button
							sx={{
								height: "50px",
								backgroundColor: "#333333",
							}}
							onClick={() => handleClick(searchInput)}
						>
							Enter
						</Button>
					</Grid>
				</Grid>
			</Container>
		</ThemeProvider>
	);
};

export default Header;
