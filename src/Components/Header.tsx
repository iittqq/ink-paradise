import React, { useState } from "react";
import { Container, Grid, TextField, Typography, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

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
	const handleClick = async () => {
		navigate("/results", {
			state: { id: searchInput },
		});
	};

	return (
		<ThemeProvider theme={customTheme}>
			<Container sx={{ height: "10vh", minWidth: "100%" }}>
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
						<Button onClick={() => handleClickHome()}>
							<Typography textTransform='none'>Ink Paradise</Typography>
						</Button>
					</Grid>
					<Grid
						item
						sx={{
							width: { xs: "250px", lg: "300px" },
							display: "flex",
							justifyContent: "space-evenly",
							alignItems: "center",
						}}
					>
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

						<Button
							sx={{
								height: "20px",
								backgroundColor: "#333333",
							}}
							onClick={() => handleClick()}
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
