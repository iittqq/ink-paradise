import React, { useState, useEffect } from "react";
import { MangaDexAPI } from "../APIs/MangaDexAPI";
import MangaClickable from "../Components/MangaClickable";
import { Container, Grid } from "@mui/material";

type Props = {};

const Upcoming = (props: Props) => {
	const [latestManga, setLatestManga] = useState<string[]>([]);

	useEffect(() => {
		MangaDexAPI.getCoverArtList()
			.then((response) => {
				setLatestManga((latestManga) => [...latestManga, response]);
			})
			.catch((error) => {
				console.log(error);
			});
		//getCovers();
	}, []);
	/** 
	//https://uploads.mangadex.org/covers/:manga-id/:cover-filename
	const getCovers = () => {
		MangaDexAPI.getCoverArtList()
			.then((response) => {
				response.data.forEach((element: any) => {
					setLatestManga((latestManga) => [
						...latestManga,
						"https://uploads.mangadex.org/covers/" +
							element.relationships[0].id +
							"/" +
							element.attributes.fileName,
					]);
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	console.log(latestManga);
	latestManga.data.forEach((element) => {
		console.log(element.data[0]);
	});
*/
	return (
		<Container>
			<Grid
				container
				direction='row'
				justifyContent='space-between'
				alignItems='center'
			>
				<Grid item>
					{/**
					 * <MangaClickable
					thumbnailImage={}
					id={current.relationships[0].id}
					updatedDate={current.attributes.updatedAt}
					volume={current.attributes.volume}
					/>
					*/}
				</Grid>
			</Grid>
		</Container>
	);
};

export default Upcoming;
