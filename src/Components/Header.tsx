import React from "react";
import { Container, Grid, TextField, Typography } from "@mui/material";
import {
	createTheme,
	ThemeProvider,
	Theme,
	useTheme,
} from "@mui/material/styles";

const customTheme = createTheme({
	palette: {
		primary: { main: "#FFEEF4" },
		secondary: { main: "#94A684" },
	},
});
const primary = "#FFEEF4";
const secondary = "#94A684";

const Header = () => {
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
						<Typography>Ink Paradise</Typography>
					</Grid>
					<Grid item sx={{ alignItems: "center" }}>
						<TextField
							variant='outlined'
							focused
							sx={{
								input: { color: "white" },
							}}
						/>
					</Grid>
				</Grid>
			</Container>
		</ThemeProvider>
	);
};

export default Header;
