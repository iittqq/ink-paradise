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

const navButtons = [
	{ name: "Home", location: "/", background: hxhdragondive },
	{ name: "Library", location: "/library", background: vagabondbuilding },
	{ name: "Discover", location: "/discover", background: vagabondsky },
	{ name: "Social", location: "/social", background: jjksukunavsjogo },
];

const Home = () => {
	const [mangaData, setMangaData] = useState<IRecentlyUpdatedMangaDetails[]>();
	const [latestMangaCoversUrl, setLatestMangaCoversUrl] = useState<string[]>(
		[]
	);
	const [mangaIds, setMangaIds] = useState<string[]>([]);

	interface IRecentlyUpdatedMangaDetails {
		id: string;
		name: string;
		updatedTime: string;
		status: string;
	}

	let mangaDetails = Array<IRecentlyUpdatedMangaDetails>;
	let mangaIdArray: string[] = [];
	useEffect(() => {
		MangaDexAPI.getNewUpdatedManga().then((response) => {
			response.forEach((element: any) => {
				mangaIdArray.push(element.id);
			});

			getCoverFromId(mangaIdArray);
			//console.log(mangaIdArray);
			//createMangaList(response.data);

			//addIds(response.data);
		});
	});
	console.log(mangaIdArray);
	//latestMangaCovers.forEach((current) => {
	//console.log(current);
	//});
	//latestMangaCovers.map((current) => console.log(current));

	//https://uploads.mangadex.org/covers/:manga-id/:cover-filename

	console.log(mangaData);
	const addIds = (manga: any) => {
		console.log(manga);
		manga.forEach((element: any) => {
			console.log(element);
			setLatestMangaCoversUrl((latestMangaCoversUrl) => [
				...latestMangaCoversUrl,
				"https://uploads.mangadex.org/covers/" +
					element.relationships.id +
					"/" +
					element.attributes.fileName,
			]);
		});
	};

	const createMangaList = (manga: any) => {
		manga.forEach((element: any) => {
			setMangaIds((mangaIds) => [...mangaIds, element]);
			console.log(mangaIds);
		});
	};

	const getCoverFromId = (manga: any) => {
		console.log(manga);
		MangaDexAPI.getMangaCoverByIds(manga).then((response) => {
			response.data.forEach((element: any) => {
				console.log(element);
			});
			console.log(response);
		});

		/** 
		mangaList.forEach((element: any) => {
			setLatestMangaCoversUrl((latestMangaCoversUrl) => [
				...latestMangaCoversUrl,
				"https://uploads.mangadex.org/covers/" +
					element.relationships[0].id +
					"/" +
					element.attributes.fileName,
			]);
		});*/
	};
	console.log(mangaIdArray);
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
					{latestMangaCoversUrl.map((current) => (
						<Grid item>
							<MangaClickable thumbnailImage={current} />
						</Grid>
					))}
				</Grid>
				<Grid item>{/**<NewAdditions />*/}</Grid>
			</Grid>
		</Container>
	);
};

export default Home;
