import React, { useState, useEffect } from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
import NavigationBubbles from "../Components/NavigationBubbles";
import NewAdditions from "../Components/NewAdditions";
import hxhdragondive from "../Assets/hxhdragondive.jpg";
import vagabondbuilding from "../Assets/vagabondbuilding.jpg";
import vagabondsky from "../Assets/vagabondSky.jpg";
import jjksukunavsjogo from "../Assets/jjksukunavsjogo.jpg";
import Header from "../Components/Header";
import MangaClickable from "../Components/MangaClickable";
import jjkCover from "../Assets/cover.jpg";
import { MangaDexAPI } from "../APIs/MangaDexAPI";

const Home = () => {
	const [mangaArray, setMangaArray] = useState<string[]>([]);
	useEffect(() => {
		MangaDexAPI.getNewUpdatedManga(
			10,
			0,
			"AND",
			"OR",
			["none"],
			["safe", "suggestive", "erotica", "pornographic"]
		).then((response) => {
			console.log(response);
			setMangaArray((mangaArray) => [...mangaArray, ...response]);
		});
	}, []);

	return (
		<Container disableGutters sx={{ minWidth: "100%", height: "100vh" }}>
			<Grid
				container
				direction='column'
				justifyContent='space-evenly'
				alignItems='center'
			>
				<Grid item sx={{ paddingTop: "1vh", width: "100%" }}>
					<Header />
				</Grid>
				<Grid item>
					<Typography sx={{ color: "white" }}>Recently Updated</Typography>
				</Grid>
				<Grid
					container
					direction='row'
					justifyContent='center'
					alignItems='center'
				>
					<Grid item>
						<MangaClickable ids={mangaArray} />
					</Grid>
				</Grid>
				<Grid item>{/**<NewAdditions />*/}</Grid>
			</Grid>
		</Container>
	);
};

export default Home;
