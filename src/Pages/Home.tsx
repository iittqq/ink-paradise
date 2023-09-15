import React, { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@mui/material";

import Header from "../Components/Header";
import MangaClickable from "../Components/MangaClickable";

import { MangaDexAPI } from "../APIs/MangaDexAPI";

const noFilter = ["safe", "suggestive", "erotica", "pornographic"];

const Home = () => {
	const [mangaDetails, setMangaDetails] = useState<MangaDetails[]>([]);
	const [doneFetching, setDoneFetching] = useState(false);

	let tempMangaArray: MangaDetails[] = [];

	interface MangaDetails {
		id: string;
		title: string;
		description: string;
		updatedAt: string;
		tags: { tagName: string[]; tagGroup: string[] };
		coverId: string;
		coverUrl: string;
	}

	//type MangaInterfaceArray = MangaDetails[];
	//let currentManga: MangaInterfaceArray[] = [];
	useEffect(() => {
		getNewUpdatedManga();
	}, []);

	const getNewUpdatedManga = () => {
		MangaDexAPI.getNewUpdatedManga(10, 0, "AND", "OR", ["none"], noFilter)
			.then((response) => {
				return response;
			})
			.then((data) => {
				data.forEach((element: any, index: number) => {
					console.log(element);
					element.relationships.forEach((coverArt: any) => {
						if (coverArt["type"] === "cover_art") {
							MangaDexAPI.getMangaCoverById(coverArt["id"]).then((response) => {
								let temp: MangaDetails = {
									id: element["id"],
									title: element["attributes"]["title"]["en"],
									description: element["attributes"]["description"]["en"],
									updatedAt: element["attributes"]["updatedAt"],
									tags: {
										tagName: element["attributes"]["tags"].map(
											(current: any) => current["attributes"]["name"]["en"]
										),
										tagGroup: element["attributes"]["tags"].map(
											(current: any) => current["attributes"]["group"]
										),
									},
									coverId: coverArt["id"],
									coverUrl:
										"https://uploads.mangadex.org/covers/" +
										element["id"] +
										"/" +
										response.data.attributes["fileName"],
								};
								tempMangaArray.push(temp);
								console.log(tempMangaArray);
							});
						}
					});
				});

				setMangaDetails(tempMangaArray);
			});
		setDoneFetching(true);
	};

	return (
		<Container disableGutters sx={{ minWidth: "100%", minHeight: "100vh" }}>
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
					sx={{ width: "80%", minHeight: "90vh" }}
				>
					{mangaDetails.map((element) => (
						<Grid item xs={2.2}>
							<MangaClickable
								id={element.id}
								title={element.title}
								description={element.description}
								updatedAt={element.updatedAt}
								tags={element.tags}
								coverId={element.coverId}
								coverUrl={element.coverUrl}
							/>
						</Grid>
					))}
				</Grid>
			</Grid>
		</Container>
	);
};

export default Home;
