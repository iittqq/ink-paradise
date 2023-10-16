import {
	Container,
	Grid,
	Card,
	Button,
	CardMedia,
	Typography,
	List,
	ListItemButton,
	ListItemText,
	Collapse,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import dayjs from "dayjs";

type Props = {};
const baseUrl = "https://api.mangadex.org";
const pageBaseUrl = "https://uploads.mangadex.org/data/";

const Reader = (props: Props) => {
	const { state } = useLocation();
	const [pages, setPages] = useState<string[]>([]);
	const [hash, setHash] = useState<string>("");
	const [chapters, setChapters] = useState<any[]>([]);
	const [selectedLanguage, setSelectedLanguage] = useState("en");
	const [currentPage, setCurrentPage] = useState(0);
	const [open, setOpen] = useState(false);
	const [order, setOrder] = useState("desc");
	let navigate = useNavigate();

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

	const fetchMangaFeed = async (language: string, ascending: boolean) => {
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
		setOpen(!open);
	};



	const handleNextChapter = () => {
		chapters.forEach((current, index) =>
		current["attributes"]["chapter"] === chapters[0]["attributes"]["chapter"]
			?	null
			: 	current["attributes"]["chapter"] === state.chapter
				? handleClick(
					state.mangaId,
					chapters[index - 1]["id"],
					chapters[index - 1]["attributes"]["title"],
					chapters[index - 1]["attributes"]["volume"],
					chapters[index - 1]["attributes"]["chapter"],
					state.mangaName
			  	)
				: null
			
		);
	};

	const handlePreviousChapter = () => {
		chapters.forEach((current, index) =>
		current["attributes"]["chapter"] === chapters[chapters.length - 1]["attributes"]["chapter"]
			?	null
			:
			current["attributes"]["chapter"] === state.chapter
				? handleClick(
						state.mangaId,
						chapters[index + 1]["id"],
						chapters[index + 1]["attributes"]["title"],
						chapters[index + 1]["attributes"]["volume"],
						chapters[index + 1]["attributes"]["chapter"],
						state.mangaName
				  )
				: null
		);
	};

	const handlePreviousChapterButton = () =>
		currentPage === 0
			? handlePreviousChapter()
			: setCurrentPage(currentPage - 1);

	const handleNextChapterButton = () =>
		currentPage === pages.length - 1
			? handleNextChapter()
			: setCurrentPage(currentPage + 1);

	const handleClick = (
		mangaId: string,
		chapterId: string,
		title: string,
		volume: string,
		chapter: string,
		mangaName: string
	) => {
		setCurrentPage(0);
		navigate("/reader", {
			state: {
				mangaId: mangaId,
				chapterId: chapterId,
				title: title,
				volume: volume,
				chapter: chapter,
				mangaName: mangaName,
			},
		});
	};
	useEffect(() => {
		fetchChapterData();

		fetchMangaFeed(selectedLanguage, false);
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
				sx={{ height: "100vh" }}
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
						<Collapse
							sx={{
								width: "100%",
								height: "100vh",
							}}
							in={open}
							timeout='auto'
						>
							<Grid
								container
								direction='row'
								justifyContent='center'
								alignItems='center'
								sx={{}}
								spacing={1}
							>
								{chapters.map((current: any, index) =>
									index === 0 ? (
										<Grid
											item
											sx={{ width: "100%", height: "50px", padding: "2px" }}
										>
											<Button
												sx={{
													width: "100%",
													color: "white",
													height: "100%",
													backgroundColor: "#191919",
													justifyContent: "space-between",
													"&.MuiButtonBase-root:hover": {
														bgcolor: "transparent",
													},
													".MuiTouchRipple-child": {
														backgroundColor: "white",
													},
												}}
												onClick={() => {
													handleClick(
														state.mangaId,
														current["id"],
														current["attributes"]["title"],
														current["attributes"]["volume"],
														current["attributes"]["chapter"],
														state.mangaName
													);
													setOpen(false);
												}}
											>
												<div style={{ display: "flex" }}>
													<Typography
														sx={{
															textTransform: "none",
															fontSize: { xs: 10, sm: 10, lg: 15 },
														}}
														color='#555555'
													>
														Chapter {current["attributes"]["chapter"]}{" "}
														{current["attributes"].title}
													</Typography>
													<Typography
														color='#555555'
														sx={{
															fontSize: { xs: 10, sm: 10, lg: 15 },
															paddingLeft: "10px",
														}}
													>
														{current["attributes"].translatedLanguage}
													</Typography>
												</div>
												<div>
													<Typography
														color='#555555'
														sx={{
															fontSize: { xs: 10, sm: 10, lg: 15 },
														}}
													>
														{dayjs(current["attributes"].createdAt).format(
															"DD/MM/YYYY / HH:mm"
														)}
													</Typography>
												</div>
											</Button>
										</Grid>
									) : current["attributes"]["chapter"] ===
									  chapters[index - 1]["attributes"]["chapter"] ? null : (
										<Grid
											item
											sx={{ width: "100%", height: "50px", padding: "2px" }}
										>
											<Button
												sx={{
													width: "100%",
													color: "white",
													height: "100%",
													backgroundColor: "#191919",
													justifyContent: "space-between",
													"&.MuiButtonBase-root:hover": {
														bgcolor: "transparent",
													},
													".MuiTouchRipple-child": {
														backgroundColor: "white",
													},
												}}
												onClick={() => {
													handleClick(
														state.mangaId,
														current["id"],
														current["attributes"]["title"],
														current["attributes"]["volume"],
														current["attributes"]["chapter"],
														state.mangaName
													);
													setOpen(false);
												}}
											>
												<div style={{ display: "flex" }}>
													<Typography
														sx={{
															textTransform: "none",
															fontSize: { xs: 10, sm: 10, lg: 15 },
														}}
														color='#555555'
													>
														Chapter {current["attributes"]["chapter"]}{" "}
														{current["attributes"].title}
													</Typography>
													<Typography
														color='#555555'
														sx={{
															fontSize: { xs: 10, sm: 10, lg: 15 },
															paddingLeft: "10px",
														}}
													>
														{current["attributes"].translatedLanguage}
													</Typography>
												</div>
												<div>
													<Typography
														color='#555555'
														sx={{
															fontSize: { xs: 10, sm: 10, lg: 15 },
														}}
													>
														{dayjs(current["attributes"].createdAt).format(
															"DD/MM/YYYY / HH:mm"
														)}
													</Typography>
												</div>
											</Button>
										</Grid>
									)
								)}
							</Grid>
						</Collapse>
					</List>
				</Grid>
				{open === true ? null : (
					<Grid
						item
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<div style={{ position: "relative" }}>
							<Button
								sx={{
									backgroundColor: "transparent",
									height: "65vh",
									width: "50%",
									position: "absolute",
									color: "white",
									"&.MuiButtonBase-root:hover": {
										backgroundColor: "transparent",
									},
								}}
								onClick={() => handleNextChapterButton()}
							></Button>

							<img
								style={{
									width: "100%",
									height: "65vh",
									objectFit: "contain",
								}}
								src={pageBaseUrl + hash + "/" + pages[currentPage]}
								alt=''
							/>
							<Button
								sx={{
									backgroundColor: "transparent",
									color: "white",
									height: "65vh",
									width: "50%",
									position: "absolute",
									transform: "translate(-100%)",
									"&.MuiButtonBase-root:hover": {
										backgroundColor: "transparent",
									},
								}}
								onClick={() => handlePreviousChapterButton()}
							></Button>
						</div>

						<div
							style={{
								width: "100%",
								display: "flex",
								justifyContent: "space-evenly",
								alignItems: "center",
							}}
						>
							<Button
								sx={{ color: "white" }}
								onClick={() => {
									handleNextChapter();
								}}
							>
								<KeyboardDoubleArrowLeftIcon />
							</Button>
							<Button
								sx={{ color: "white" }}
								onClick={() => {
									handleNextChapterButton();
								}}
							>
								<KeyboardArrowLeftIcon />
							</Button>
							<Button
								sx={{ color: "white" }}
								onClick={() => {
									handlePreviousChapterButton();
								}}
							>
								<KeyboardArrowRightIcon />
							</Button>
							<Button
								sx={{ color: "white" }}
								onClick={() => {
									handlePreviousChapter();
								}}
							>
								<KeyboardDoubleArrowRightIcon />
							</Button>
						</div>
						<Typography color='white'>
							{currentPage + 1} / {pages.length}
						</Typography>
					</Grid>
				)}
			</Grid>
		</div>
	);
};

export default Reader;
