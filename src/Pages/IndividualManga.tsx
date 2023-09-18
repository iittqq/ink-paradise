import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
	Container,
	Grid,
	Card,
	CardMedia,
	Button,
	Typography,
} from "@mui/material";
import { DetailsById } from "../APIs/MangaDexAPI";

const mangaCoverHeightXs = "200px";
const mangaCoverWidthXs = "100px";
const mangaCoverHeightMd = "250px";
const mangaCoverWidthMd = "150px";
const mangaCoverHeightLg = "300px";
const mangaCoverWidthLg = "200px";

const IndividualManga = () => {
	const { state } = useLocation();
	const [mangaDetails, setMangaDetails] = useState(Object);

	const fetchRecentlyUpdatedManga = async () => {
		const { data } = await axios.get(DetailsById(state.id));
		setMangaDetails(data.data);
		console.log(data.data);
	};

	useEffect(() => {
		fetchRecentlyUpdatedManga();
	}, []);

	return (
		<Container sx={{ paddingTop: "50px" }}>
			<Grid
				container
				direction='row'
				justifyContent='flex-start'
				alignItems='center'
			>
				<Grid item>
					<Card
						sx={{
							height: {
								xs: mangaCoverHeightXs,
								md: mangaCoverHeightMd,
								lg: mangaCoverHeightLg,
							},
							width: {
								xs: mangaCoverWidthXs,
								md: mangaCoverWidthMd,
								lg: mangaCoverWidthLg,
							},
						}}
					>
						<CardMedia
							sx={{
								height: "100%",
								width: "100%",
							}}
							image={
								"https://uploads.mangadex.org/covers/" +
								state.id +
								"/" +
								state.coverFile
							}
						/>
					</Card>
				</Grid>
				<Grid item>
					<Typography> </Typography>
				</Grid>
			</Grid>
		</Container>
	);
};

export default IndividualManga;
