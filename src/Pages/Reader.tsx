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
import { useLocation } from "react-router-dom";
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
	const [chapters, setChapters] = useState<Object[]>([]);
	const [selectedLanguage, setSelectedLanguage] = useState("en");
	const [currentPage, setCurrentPage] = useState(0);
	const [open, setOpen] = useState(false);
	const fetchChapterData = async () => {
		const { data } = await axios.get(
			`${baseUrl}/at-home/server/${state.chapterId}`,
			{
				params: {},
			}
		);

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
	};

	const fetchMangaFeed = async (
		language: string,
		offset: number,
		ascending: boolean
	) => {
		const { data: feed } = await axios.get(
			`${baseUrl}/manga/${state.mangaId}/feed`,
			{
				params: {
					limit: 200,
					offset: offset,
					translatedLanguage: [language],
					order: { chapter: ascending === true ? "asc" : "desc" },
				},
			}
		);

		//feed.data.length === 0 ? setCurrentOffset(0) : setMangaFeed(feed.data);
		console.log(feed.data);
		setChapters(feed.data);
	};
	const handleOpenChapters = () => {
		setOpen(!open);
	};
	useEffect(() => {
		fetchChapterData();
		fetchMangaFeed(selectedLanguage, 0, false);
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
				sx={{ height: "95vh" }}
			>
				<Grid item sx={{ width: "100%" }}>
					<Header />
				</Grid>
				<Grid item>
					<div
						style={{
							width: "100%",
							height: "100px",
							display: "flex",
							flexDirection: "column",
							justifyContent: "flex-start",
							alignItems: "center",
						}}
					>
						<Typography color='white'>{state.mangaName}</Typography>
						<Typography color='white'>{state.title}</Typography>
						<List
							sx={{
								width: "100%",
								height: "50px",
								justifyContent: "center",
								display: "flex",
								alignItems: "center",
								flexDirection: "column",
							}}
						>
							<ListItemButton
								sx={{
									width: "70%",
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
									{chapters.map((current: any) => (
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
												onClick={() => {}}
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
									))}
								</Grid>
							</Collapse>
						</List>
					</div>
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
									"&.MuiButtonBase-root:hover": {
										backgroundColor: "transparent",
									},
									".MuiTouchRipple-child": {
										backgroundColor: "white",
									},
								}}
								onClick={() =>
									currentPage === pages.length - 1
										? null
										: setCurrentPage(currentPage + 1)
								}
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
									height: "65vh",
									width: "50%",
									position: "absolute",
									transform: "translate(-100%)",
									"&.MuiButtonBase-root:hover": {
										backgroundColor: "transparent",
									},
									".MuiTouchRipple-child": {
										backgroundColor: "white",
									},
								}}
								onClick={() =>
									currentPage === 0 ? null : setCurrentPage(currentPage - 1)
								}
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
									setCurrentPage(pages.length - 1);
								}}
							>
								<KeyboardDoubleArrowLeftIcon />
							</Button>
							<Button
								sx={{ color: "white" }}
								onClick={() => {
									setCurrentPage(currentPage + 1);
								}}
							>
								<KeyboardArrowLeftIcon />
							</Button>
							<Button
								sx={{ color: "white" }}
								onClick={() => {
									setCurrentPage(currentPage - 1);
								}}
							>
								<KeyboardArrowRightIcon />
							</Button>
							<Button
								sx={{ color: "white" }}
								onClick={() => {
									setCurrentPage(0);
								}}
							>
								<KeyboardDoubleArrowRightIcon />
							</Button>
						</div>
						<Typography color='white'>
							{currentPage} / {pages.length - 1}
						</Typography>
					</Grid>
				)}
			</Grid>
		</div>
	);
};

export default Reader;
