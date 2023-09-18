import { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@mui/material";
import Header from "../Components/Header";
import { RecentlyUpdated } from "../APIs/MangaDexAPI";
import axios from "axios";
import RecentlyUpdatedCarousel from "../Components/RecentlyUpdatedCarousel";
import RecentlyUpdatedList from "../Components/RecentlyUpdatedList";

const noFilter = ["safe", "suggestive", "erotica", "pornographic"];
const baseUrl = "https://api.mangadex.org";

const Home = () => {
	const [mangaDetails, setMangaDetails] = useState<any[]>([]);

	const fetchRecentlyUpdatedManga = async () => {
		const { data } = await axios.get(RecentlyUpdated());
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
					item
					sx={{
						width: "100%",
						display: "flex",
						justifyContent: "center",
					}}
				>
					{/**<RecentlyUpdatedCarousel />*/}

					<RecentlyUpdatedList />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Home;
