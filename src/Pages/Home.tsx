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
import HomepageSectionDisplay from "../Components/HomepageSectionDisplay";
import { fetchRecentlyUpdatedManga } from "../api/MangaDexApi";

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

	const handleClickRecentlyUpdated = async () => {
		navigate("/mangaCoverList", {
			state: { listType: "RecentlyUpdated" },
		});
	};

	const handleClickMangaCoverListRA = async () => {
		navigate("/mangaCoverList", {
			state: { listType: "RecentlyAdded" },
		});
	};

	const fetchRecentlyAddedManga = async () => {
		fetch(
			`${baseUrlMangaDex}/manga?limit=10&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BcreatedAt%5D=desc`,
			{
				method: "GET",
			}
		)
			.then((response) => response.json())
			.then((newManga) => {
				setRecentlyAddedManga(newManga.data);

				console.log(newManga.data);
			});
	};

	const getRecentlyUpdatedManga = async () => {
		const manga = await fetchRecentlyUpdatedManga();
		setRecentlyUpdatedManga(manga);
	};
	const fetchTags = async () => {
		fetch(`${baseUrlMangaDex}/manga/tag`, {})
			.then((response) => response.json())
			.then((tags) => {
				console.log(tags.data);
				setMangaTags(tags.data);
			});
	};

	useEffect(() => {
		fetchTopManga();
		//fetchRecentlyUpdatedManga();
		getRecentlyUpdatedManga();
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
							<HomepageSectionDisplay
								section='Recently Added'
								mangaData={recentlyAddedManga}
							/>
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
									onClick={() => handleClickMangaCoverListRA()}
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
							<HomepageSectionDisplay
								section='Recently Updated'
								mangaData={recentlyUpdatedManga}
							/>
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
											location={"mangaList"}
											tagId={element["id"]}
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
