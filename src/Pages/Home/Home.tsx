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
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import axios from "axios";
import StandardButton from "../../Components/StandardButton";
import { useNavigate } from "react-router-dom";
import TrendingMangaSection from "../../Components/TrendingMangaSection";
import HomepageSectionDisplay from "../../Components/HomepageSectionDisplay";
import "./Home.css";

import {
	fetchMangaById,
	fetchRecentlyUpdated,
	fetchRecentlyAdded,
	fetchMangaTags,
} from "../../api/MangaDexApi";

import { fetchTopManga } from "../../api/MalApi";

const baseUrlMangaDex = "https://api.mangadex.org";
const baseUrlMal = "https://api.jikan.moe/v4";

const Home = () => {
	const [open, setOpen] = useState(false);
	const [topMangaData, setTopMangaData] = useState<any[]>([]);
	const [recentlyUpdatedManga, setRecentlyUpdatedManga] = useState<any[]>([]);
	const [recentlyAddedManga, setRecentlyAddedManga] = useState<any[]>([]);
	const [mangaTags, setMangaTags] = useState<any[]>([]);
	let navigate = useNavigate();

	const handleClickRecentlyUpdated = async () => {
		navigate("/mangaCoverList", {
			state: { listType: "RecentlyUpdated" },
		});
	};

	const handleClickTrendingNow = async () => {};

	const handleClickMangaCoverListRA = async () => {
		navigate("/mangaCoverList", {
			state: { listType: "RecentlyAdded" },
		});
	};
	const handleClick = async (tagId: string) => {
		console.log(tagId);
		navigate("mangaList", {
			state: { tagId: tagId },
		});
	};

	useEffect(() => {
		fetchTopManga().then((data: any) => {
			setTopMangaData(data);
		});
		fetchRecentlyUpdated(10, 0).then((data: Object[]) => {
			setRecentlyUpdatedManga(data);
		});

		fetchMangaTags().then((data: Object[]) => {
			setMangaTags(data);
		});

		fetchRecentlyAdded(10, 0).then((data: Object[]) => {
			setRecentlyAddedManga(data);
		});
	}, []);

	const handleOpenTags = () => {
		setOpen(!open);
	};

	return (
		<div style={{ minHeight: "100vh" }}>
			<div className='header'>
				<Header />
			</div>

			<div className='manga-category-section'>
				<div className='manga-column'>
					<Typography textTransform='none' noWrap color={"white"}>
						Recently Added
					</Typography>
					<HomepageSectionDisplay
						section='Recently Added'
						mangaData={recentlyAddedManga}
					/>
					<Button className='show-more-button'>
						<ExpandMore
							sx={{ color: "#333333" }}
							onClick={() => handleClickMangaCoverListRA()}
						/>
					</Button>
				</div>
				<div className='manga-column'>
					<Typography color='white'>Trending Now</Typography>
					<TrendingMangaSection mangaData={topMangaData} />
					<Button className='show-more-button'>
						<ExpandMore
							sx={{ color: "#333333" }}
							onClick={() => handleClickTrendingNow()}
						/>
					</Button>
				</div>
				<div className='manga-column'>
					<Typography color='white' noWrap>
						Recently Updated
					</Typography>
					<HomepageSectionDisplay
						section='Recently Updated'
						mangaData={recentlyUpdatedManga}
					/>
					<Button className='show-more-button'>
						<ExpandMore
							sx={{ color: "#333333" }}
							onClick={() => handleClickRecentlyUpdated()}
						/>
					</Button>
				</div>
			</div>

			<List className='tags-list'>
				<ListItemButton
					className='tags-list-button'
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
						sx={{ paddingBottom: "40px" }}
					>
						{mangaTags.map((element: any) => (
							<Grid item>
								<Button
									className='tag-button'
									variant='contained'
									onClick={() => handleClick(element["id"])}
								>
									<Typography fontSize={10} textTransform='none'>
										{element["attributes"].name["en"]}
									</Typography>
								</Button>
							</Grid>
						))}
					</Grid>
				</Collapse>
			</List>

			<div className='footer'>
				<Footer />
			</div>
		</div>
	);
};

export default Home;
