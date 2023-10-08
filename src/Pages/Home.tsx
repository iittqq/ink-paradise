import { useState, useEffect } from "react";
import {
	Container,
	Grid,
	Typography,
	Button,
	List,
	ListItemButton,
	ListItemText,
	Collapse,
	Box,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import Header from "../Components/Header";
import axios from "axios";
import StandardButton from "../Components/StandardButton";
import { useNavigate } from "react-router-dom";
import TrendingMangaSection from "../Components/TrendingMangaSection";
import RecentlyUpdatedMangaSection from "../Components/RecentlyUpdatedMangaSection";
import RecentlyAddedMangaSection from "../Components/RecentlyAddedMangaSection";
import IndividualManga from "./IndividualManga";

const baseUrlMangaDex = "https://api.mangadex.org";
const baseUrlMal = "https://api.jikan.moe/v4";
const Home = () => {
	const [open, setOpen] = useState(false);
	const [topMangaData, setTopMangaData] = useState<any[]>([]);
	const [recentlyUpdatedManga, setRecentlyUpdatedManga] = useState<any[]>([]);
	const [recentlyAddedManga, setRecentlyAddedManga] = useState<any[]>([]);
	const [mangaTags, setMangaTags] = useState<any[]>([]);
	const fetchTopManga = async () => {
		const { data: top } = await axios.get(`${baseUrlMal}/top/manga`, {
			params: {
				limit: 10,
				order: { relevance: "desc" },
			},
		});
		console.log(top.data);
		setTopMangaData(top.data);
	};

	const handleClickRecentlyAdded = async () => {
		navigate("/recentlyAdded");
	};
	const handleClickRecentlyUpdated = async () => {
		navigate("/mangalist", {
			state: { mangaData: recentlyUpdatedManga },
		});
	};

	const fetchRecentlyAddedManga = async () => {
		const { data: recentAdded } = await axios.get(`${baseUrlMangaDex}/manga`, {
			params: {
				limit: 10,
				contentRating: ["safe", "suggestive", "erotica"],
				order: {
					createdAt: "desc",
				},
			},
		});
		setRecentlyAddedManga(recentAdded.data);

		console.log(recentAdded.data);
	};

	const fetchRecentlyUpdatedManga = async () => {
		const { data: recentUpdated } = await axios.get(
			`${baseUrlMangaDex}/manga`,
			{
				params: {
					limit: 10,
					order: {
						latestUploadedChapter: "desc",
					},
				},
			}
		);
		console.log(recentUpdated.data);
		setRecentlyUpdatedManga(recentUpdated.data);
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
		fetchRecentlyAddedManga();
	}, []);

	const handleOpenTags = () => {
		setOpen(!open);
	};

	let navigate = useNavigate();
	return (
		<div>
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
							<Typography textTransform='none' noWrap color={"white"}>
								Recently Added
							</Typography>

							<RecentlyAddedMangaSection mangaData={recentlyAddedManga} />
							<Button
								sx={{
									color: "#121212",
									backgroundColor: "transparent",
									"&.MuiButtonBase-root:hover": {
										bgcolor: "transparent",
									},
									width: "20px",
									height: "20px",
								}}
							>
								<ExpandMore
									sx={{ color: "#333333" }}
									onClick={() => handleClickRecentlyAdded()}
								/>
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
								paddingBottom: "20px",
							}}
						>
							<Typography color='white'>Trending Now</Typography>
							<TrendingMangaSection mangaData={topMangaData} />
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
									width: "20px",
									height: "20px",
								}}
							>
								<ExpandMore
									sx={{ color: "#333333" }}
									onClick={() => handleClickRecentlyUpdated()}
								/>
							</Button>
						</Grid>
					</Grid>
				</Grid>
				<Grid
					item
					sx={{
						width: { xs: "100%", lg: "90%" },
					}}
				>
					<List
						sx={{
							width: "100%",
							justifyContent: "center",
							display: "flex",
							alignItems: "center",
							flexDirection: "column",
						}}
					>
						<ListItemButton
							sx={{
								width: "100px",
								color: "#121212",
								backgroundColor: "transparent",
								"&.MuiButtonBase-root:hover": {
									bgcolor: "transparent",
								},
							}}
							onClick={() => handleOpenTags()}
						>
							<ListItemText sx={{ color: "white" }} primary='Tags' />
							{open ? (
								<ExpandLess sx={{ color: "#333333" }} />
							) : (
								<ExpandMore sx={{ color: "#333333" }} />
							)}
						</ListItemButton>
						<Collapse
							sx={{
								width: "100%",
								height: "20%",
							}}
							in={open}
							timeout='auto'
						>
							<Grid
								container
								justifyContent='center'
								direction='row'
								alignItems='center'
								spacing={0.5}
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
						</Collapse>
					</List>
				</Grid>
			</Grid>
		</div>
	);
};

export default Home;
