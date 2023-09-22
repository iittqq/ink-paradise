import { useState, useEffect } from "react";
import { Container, Grid, Typography, Button } from "@mui/material";
import Header from "../Components/Header";
import axios from "axios";
import StandardButton from "../Components/StandardButton";
import { useNavigate } from "react-router-dom";
import TrendingHomePage from "../Components/TrendingHomePage";
import RecentlyUpdatedMangaSection from "../Components/RecentlyUpdatedMangaSection";
import RecentlyAddedList from "../Components/RecentlyAddedList";

const baseUrlMangaDex = "https://api.mangadex.org/";
const baseUrlMal = "https://api.jikan.moe/v4";
const Home = () => {
	const [topMangaData, setTopMangaData] = useState<any[]>([]);
	const [recentlyUpdatedManga, setRecentlyUpdatedManga] = useState<any[]>([]);
	const [mangaTags, setMangaTags] = useState<any[]>([]);
	const fetchTopManga = async () => {
		const { data: top } = await axios.get(`${baseUrlMal}/top/manga`, {
			params: {
				limit: 10,
			},
		});
		console.log(top.data);
		setTopMangaData(top.data);
	};

	const fetchRecentlyUpdatedManga = async () => {
		const { data: recent } = await axios.get(`${baseUrlMangaDex}/manga`, {
			params: {
				limit: 10,
				order: {
					latestUploadedChapter: "desc",
				},
			},
		});
		console.log(recent.data);
		setRecentlyUpdatedManga(recent.data);
	};

	const fetchTags = async () => {
		const { data: tags } = await axios.get(`${baseUrlMangaDex}/manga/tag`, {
			params: {
				limit: 10,
			},
		});
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
		<Container disableGutters sx={{ minWidth: "100%", minHeight: "100vh" }}>
			<Grid
				container
				direction='column'
				justifyContent='center'
				alignItems='center'
			>
				<Grid item sx={{ width: "100%" }}>
					<Header />
				</Grid>

				<Grid
					item
					sx={{
						width: "100%",
						height: { xs: "70vh", md: "65vh", lg: "none" },
					}}
				>
					<Grid
						container
						direction='row'
						justifyContent='space-evenly'
						alignItems='center'
						sx={{}}
					>
						<Grid
							item
							sx={{
								width: "31%",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Typography color='white'>Recently Added</Typography>
							<RecentlyAddedList />
							<Button
								sx={{
									color: "#121212",
									backgroundColor: "transparent",
									"&.MuiButtonBase-root:hover": {
										bgcolor: "transparent",
									},
								}}
							>
								<div
									style={{
										width: 0,
										height: 0,
										borderLeft: "15px solid transparent",
										borderRight: "15px solid transparent",
										borderTop: "15px solid #333333",
									}}
								></div>
							</Button>
						</Grid>
						<Grid
							item
							sx={{
								width: "31%",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								paddingBottom: "27px",
							}}
						>
							<Typography color='white'>Trending Now</Typography>
							<TrendingHomePage mangaData={topMangaData} />
						</Grid>
						<Grid
							item
							sx={{
								width: "31%",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Typography color='white' noWrap>
								Recently Updated
							</Typography>
							<RecentlyUpdatedMangaSection mangaData={recentlyUpdatedManga} />
							<Button
								sx={{
									color: "#121212",
									backgroundColor: "transparent",
									"&.MuiButtonBase-root:hover": {
										bgcolor: "transparent",
									},
								}}
							>
								<div
									style={{
										width: 0,
										height: 0,
										borderLeft: "15px solid transparent",
										borderRight: "15px solid transparent",
										borderTop: "15px solid #333333",
									}}
								></div>
							</Button>
						</Grid>
					</Grid>
				</Grid>
				<Grid
					item
					sx={{ width: { xs: "100%", lg: "90%" }, textAlign: "center" }}
				>
					<Typography color='white' sx={{ height: { xs: "30px" } }}>
						Tags
					</Typography>
					<Grid
						container
						direction='row'
						justifyContent='center'
						alignItems='center'
						spacing={1}
						sx={{ height: { xs: "200px" }, overflow: "scroll" }}
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
			</Grid>
		</Container>
	);
};

export default Home;
