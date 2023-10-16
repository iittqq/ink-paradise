import {
	Grid,
	Button,
	Typography,
	List,
	ListItemButton,
	ListItemText,
	Collapse,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import dayjs from "dayjs";
import PageAndControls from "../Components/PageAndControls";
import MangaChapterList from "../Components/MangaChapterList";

const baseUrl = "https://api.mangadex.org";
const pageBaseUrl = "https://uploads.mangadex.org/data/";

const Reader = () => {
	const { state } = useLocation();
	const [pages, setPages] = useState<string[]>([]);
	const [hash, setHash] = useState<string>("");
	const [chapters, setChapters] = useState<any[]>([]);
	const [selectedLanguage, setSelectedLanguage] = useState("en");
	const [currentPage, setCurrentPage] = useState(0);
	const [open, setOpen] = useState(false);
	const [order, setOrder] = useState("desc");
	const [scantalationGroups, setScantalationGroups] = useState<any[]>([]);

	const fetchChapterData = async () => {
		fetch(`${baseUrl}/at-home/server/${state.chapterId}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(
					pageBaseUrl +
						data["chapter"]["hash"] +
						"/" +
						data["chapter"]["data"][currentPage]
				);
				setPages(data["chapter"]["data"]);
				setHash(data["chapter"]["hash"]);
				console.log(data);
				console.log(pages);
			});
	};

	const fetchMangaFeed = async () => {
		fetch(
			`${baseUrl}/manga/${state.mangaId}/feed?limit=300&offset=0&translatedLanguage%5B%5D=${selectedLanguage}&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&includeFutureUpdates=0&order%5Bchapter%5D=${order}`
		)
			.then((response) => response.json())
			.then((feed) => {
				console.log(feed.data);
				setChapters(feed.data);
			});
	};
	const handleOpenChapters = () => {
		chapters.forEach((current) => {
			fetchScantalationGroup(current["relationships"][0]["id"]);
		});
		setOpen(!open);
	};

	const fetchScantalationGroup = async (id: string) => {
		fetch(`${baseUrl}/group/${id}`)
			.then((response) => response.json())
			.then((group) => {
				setScantalationGroups((scantalationGroups) => [
					...scantalationGroups,
					group["data"]["attributes"]["name"],
				]);
				console.log(group);
			});
	};

	useEffect(() => {
		fetchChapterData();
		fetchMangaFeed();
		console.log(pages);
	}, [state]);
	return (
		<div
			style={{
				height: "100vh",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-start",
				alignItems: "center",
			}}
		>
			<Grid
				container
				direction='column'
				justifyContent='flex-start'
				alignItems='center'
				sx={{
					height: "100vh",
					overflow: "scroll",
					"::-webkit-scrollbar": {
						display: "none",
					},
				}}
			>
				<Grid item sx={{ width: "100%" }}>
					<Header />
				</Grid>
				<Grid
					item
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						textAlign: "center",
					}}
				>
					<Typography color='white'>{state.mangaName}</Typography>
					<Typography color='white'>{state.title}</Typography>
					<List
						sx={{
							width: "100%",
							height: "25px",
							justifyContent: "center",
							display: "flex",
							alignItems: "center",
							flexDirection: "column",
						}}
					>
						<ListItemButton
							sx={{
								width: "100%",
								color: "#121212",
								backgroundColor: "transparent",
								"&.MuiButtonBase-root:hover": {
									bgcolor: "transparent",
								},
							}}
							onClick={() => handleOpenChapters()}
						>
							<ListItemText
								primary={
									<Typography color='white' sx={{ width: "100%" }} noWrap>
										{"Volume " + state.volume + " Chapter " + state.chapter}
									</Typography>
								}
							/>
							{open ? (
								<ExpandLess sx={{ color: "white" }} />
							) : (
								<ExpandMore sx={{ color: "white" }} />
							)}
						</ListItemButton>
						<Collapse sx={{}} in={open} timeout='auto'>
							<MangaChapterList
								mangaId={state.mangaId}
								mangaFeed={chapters}
								mangaName={state.mangaName}
								selectedLanguage={selectedLanguage}
								insideReader={true}
								scantalationGroups={scantalationGroups}
								setOpen={setOpen}
							/>
						</Collapse>
					</List>
				</Grid>
				{open === true ? null : (
					<PageAndControls
						chapters={chapters}
						pages={pages}
						pageBaseUrl={pageBaseUrl}
						hash={hash}
						currentChapter={state.chapter}
						mangaId={state.mangaId}
						mangaName={state.mangaName}
					/>
				)}
			</Grid>
		</div>
	);
};

export default Reader;
