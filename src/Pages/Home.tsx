import React, { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@mui/material";

import Header from "../Components/Header";
import MangaClickable from "../Components/MangaClickable";

import { MangaDexAPI } from "../APIs/MangaDexAPI";

const noFilter = ["safe", "suggestive", "erotica", "pornographic"];

const Home = () => {
	const [mangaDetails, setMangaDetails] = useState<string[]>([]);
	let mangaIds: string[] = [];
	let coverUrls: string[] = [];

	useEffect(() => {
		getNewUpdatedManga();
	}, []);

	const getNewUpdatedManga = () => {
		MangaDexAPI.getNewUpdatedManga(10, 0, "AND", "OR", ["none"], noFilter)
			.then((response) => {
				return response;
			})
			.then((data) => {
				data.forEach((element: any) => {
					mangaIds.push(element["id"]);

					element.relationships.forEach((coverArt: any) => {
						if (coverArt["type"] === "cover_art") {
							MangaDexAPI.getMangaCoverById(coverArt["id"]).then((response) => {
								coverUrls.push(
									"https://uploads.mangadex.org/covers/" +
										element["id"] +
										"/" +
										response.data.attributes["fileName"]
								);
							});
						}
					});
				});

				console.log(coverUrls);
				setMangaDetails(coverUrls);
			});
	};

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
					{mangaDetails.map((element) => (
						<Grid item>
							<MangaClickable mangaCover={element} />
						</Grid>
					))}
				</Grid>
				<Grid item>{/**<NewAdditions />*/}</Grid>
			</Grid>
		</Container>
	);
};

export default Home;
