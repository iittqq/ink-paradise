import { useState, useEffect } from "react";
import { Container, Grid, Typography, Button } from "@mui/material";
import Header from "../Components/Header";
import { RecentlyUpdated, MangaTags } from "../APIs/MangaDexAPI";
import axios from "axios";
import StandardButton from "../Components/StandardButton";
import { useNavigate } from "react-router-dom";
import { getTopManga } from "../APIs/MyAnimeListAPI";
import TrendingHomePage from "../Components/TrendingHomePage";
import RecentlyUpdatedMangaSection from "../Components/RecentlyUpdatedMangaSection";
import RecentlyAddedList from "../Components/RecentlyAddedList";

const noFilter = ["safe", "suggestive", "erotica", "pornographic"];

const Home = () => {
	const [topMangaData, setTopMangaData] = useState<any[]>([]);
	const [recentlyUpdatedManga, setRecentlyUpdatedManga] = useState<any[]>([]);
	const [mangaTags, setMangaTags] = useState<any[]>([]);
	const fetchTopManga = async () => {
		const { data: top } = await axios.get(getTopManga());
		console.log(top.data);
		setTopMangaData(top.data);
	};

	const fetchRecentlyUpdatedManga = async () => {
		const { data: recent } = await axios.get(RecentlyUpdated());
		console.log(recent.data);
		setRecentlyUpdatedManga(recent.data);
	};

	const fetchTags = async () => {
		const { data: tags } = await axios.get(MangaTags());
		console.log(tags.data);
		setMangaTags(tags.data);
	};

	useEffect(() => {
		fetchTopManga();
		fetchRecentlyUpdatedManga();
		fetchTags();
	}, []);

	let navigate = useNavigate();
	return (
		<Container disableGutters sx={{ minWidth: "95%", minHeight: "100vh" }}>
			<Grid
				container
				direction='column'
				justifyContent='center'
				alignItems='center'
			>
				<Grid item sx={{ paddingTop: "1vh", width: "100%" }}>
					<Header />
				</Grid>

				<Grid
					item
					sx={{
						width: "100%",
					}}
				>
					<Grid
						container
						direction='row'
						justifyContent='space-between'
						alignItems='center'
						sx={{ height: "60vh" }}
					>
						<Grid item sx={{ width: "35%" }}>
							<Typography color='white'>Trending Now</Typography>
							<TrendingHomePage mangaData={topMangaData} />
						</Grid>
						<Grid item sx={{ width: "30%" }}>
							<Typography color='white'>Tags</Typography>
							<Grid
								container
								direction='row'
								justifyContent='space-between'
								alignItems='center'
							>
								{mangaTags.map((element: any) => (
									<Grid item>
										<StandardButton
											backgroundColor='#191919'
											width='120px'
											height='20px'
											textColor='#333333'
											fontSizeXs={10}
											fontSizeSm={10}
											fontSizeLg={12}
											text={element["attributes"].name["en"]}
											location={element["attributes"].name["en"]}
										/>
									</Grid>
								))}
							</Grid>
						</Grid>
						<Grid
							item
							sx={{
								width: "600px",
							}}
						>
							<div>
								<Typography color='white'>Recently Updated</Typography>
								<RecentlyUpdatedMangaSection mangaData={recentlyUpdatedManga} />
							</div>
						</Grid>
					</Grid>
					<Grid item sx={{ display: "flex", justifyContent: "center" }}>
						<div>
							<Typography color='white'>Recently Added</Typography>
							<RecentlyAddedList />
						</div>
					</Grid>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Home;
