import { useState, useEffect } from "react";
import { Container, Grid, Typography, Button } from "@mui/material";
import Header from "../Components/Header";
import { RecentlyUpdated } from "../APIs/MangaDexAPI";
import axios from "axios";
import RecentlyUpdatedCarousel from "../Components/RecentlyUpdatedCarousel";
import RecentlyUpdatedList from "../Components/RecentlyUpdatedList";
import RecentlyAddedList from "../Components/RecentlyAddedList";
import { useNavigate } from "react-router-dom";
import { getTopManga } from "../APIs/MyAnimeListAPI";
import TrendingHomePage from "../Components/TrendingHomePage";

const noFilter = ["safe", "suggestive", "erotica", "pornographic"];

const Home = () => {
	const [topMangaData, setTopMangaData] = useState<any[]>([]);
	const fetchTopManga = async () => {
		const { data: top } = await axios.get(getTopManga());
		console.log(top.data);
		setTopMangaData(top.data);
	};

	useEffect(() => {
		fetchTopManga();
	}, []);
	let navigate = useNavigate();
	return (
		<Container disableGutters sx={{ minWidth: "100%", minHeight: "100vh" }}>
			<Grid
				container
				direction='column'
				justifyContent='flex-start'
				alignItems='flex-start'
			>
				<Grid item sx={{ paddingTop: "1vh", width: "100%" }}>
					<Header />
				</Grid>

				<Grid
					item
					sx={{
						width: "600px",
						paddingLeft: "20px",
					}}
				>
					<div>
						<Typography color='white'>Trending</Typography>
						<TrendingHomePage mangaData={topMangaData} />
					</div>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Home;
