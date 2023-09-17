import React, { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@mui/material";

import Header from "../Components/Header";
import MangaClickable from "../Components/MangaClickable";

import { RecentlyUpdated } from "../APIs/MangaDexAPI";
import axios from "axios";

const noFilter = ["safe", "suggestive", "erotica", "pornographic"];
const baseUrl = "https://api.mangadex.org";
const Home = () => {
	const [mangaDetails, setMangaDetails] = useState<any[]>([]);

	const fetchRecentlyUpdatedManga = async () => {
		const { data } = await axios.get(RecentlyUpdated());
		console.log(data);
		setMangaDetails(data.data);
		console.log(data.data);
	};
	useEffect(() => {
		fetchRecentlyUpdatedManga();
	}, []);

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
					wrap='nowrap'
					sx={{ width: "80%", maxHeight: "400px", overflow: "auto" }}
				>
					{mangaDetails.map((element) => (
						<Grid item>
							<MangaClickable
								id={element["id"]}
								title={element["attributes"].title["en"]}
								description={element["attributes"].description["en"]}
								updatedAt={element["attributes"].updatedAt}
								tags={element["attributes"].tags}
								coverId={
									element["relationships"].find(
										(i: any) => i.type === "cover_art"
									).id
								}
							/>
						</Grid>
					))}
				</Grid>
			</Grid>
		</Container>
	);
};

export default Home;
