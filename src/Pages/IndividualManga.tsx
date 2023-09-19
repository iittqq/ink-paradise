import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
	Container,
	Grid,
	Card,
	CardMedia,
	Button,
	Typography,
} from "@mui/material";
import { DetailsById, FeedById } from "../APIs/MangaDexAPI";
import dayjs from "dayjs";
import Header from "../Components/Header";
import "/node_modules/flag-icons/css/flag-icons.min.css";

var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const mangaCoverHeightXs = "200px";
const mangaCoverWidthXs = "100px";
const mangaCoverHeightMd = "250px";
const mangaCoverWidthMd = "150px";
const mangaCoverHeightLg = "300px";
const mangaCoverWidthLg = "200px";

const IndividualManga = () => {
	const { state } = useLocation();
	const [mangaDetails, setMangaDetails] = useState(Object);
	const [mangaName, setMangaName] = useState();
	const [mangaDescription, setMangaDescription] = useState();
	const [mangaAltTitles, setMangaAltTitles] = useState<Object[]>([]);
	const [mangaLanguages, setMangaLanguages] = useState<string[]>([]);
	const [mangaContentRating, setMangaContentRating] = useState();
	const [mangaCreatedAt, setMangaCreatedAt] = useState();
	const [mangaRaw, setMangaRaw] = useState();
	const [mangaState, setMangaState] = useState();
	const [mangaStatus, setMangaStatus] = useState();
	const [mangaTags, setMangaTags] = useState<Object[]>([]);
	const [mangaUpdatedAt, setMangaUpdatedAt] = useState();
	const [mangaRelationships, setMangaRelationships] = useState();
	const [mangaType, setMangaType] = useState();
	const [mangaLatest, setMangaLatest] = useState();
	const [mangaFeed, setMangaFeed] = useState<Object[]>([]);

	const fetchRecentlyUpdatedManga = async () => {
		const { data: details } = await axios.get(DetailsById(state.id));
		setMangaDetails(details.data);
		console.log(details.data);
		setMangaName(details.data["attributes"].title["en"]);
		setMangaDescription(details.data["attributes"].description["en"]);
		setMangaAltTitles(details.data["attributes"].altTitles);
		setMangaLanguages(details.data["attributes"].availableTranslatedLanguages);
		setMangaContentRating(details.data["attributes"].contentRating);
		setMangaCreatedAt(details.data["attributes"].createdAt);
		setMangaRaw(details.data["attributes"].links["raw"]);
		setMangaState(details.data["attributes"].state);
		setMangaStatus(details.data["attributes"].status);
		setMangaTags(details.data["attributes"].tags);
		setMangaUpdatedAt(details.data["attributes"].updatedAt);
		setMangaRelationships(details.data["relationships"]);
		setMangaLatest(details.data["attributes"].latestUploadedChapter);
	};

	const fetchMangaFee = async () => {
		const { data: feed } = await axios.get(FeedById(state.id));
		console.log(feed.data);
		setMangaFeed(feed.data);
	};

	const getCountryDetails = (code: string) => {
		switch (code) {
			case "en":
				return "us";

			case "ja":
				return "jp";

			case "pt-br":
				return "pt";

			case "uk":
				return "gb";

			case "es-la":
				return "es";
			default:
				//statements;
				return code;
		}
	};
	useEffect(() => {
		fetchRecentlyUpdatedManga();
		fetchMangaFee();
	}, []);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
			}}
		>
			<Grid
				container
				direction='column'
				justifyContent='center'
				alignItems='center'
				sx={{}}
			>
				<Grid item sx={{ width: "100%" }}>
					<Header />
				</Grid>
				<Grid
					item
					sx={{
						width: "95%",
						height: { xs: "250px", sm: "280px", lg: "350px" },
					}}
				>
					<Grid
						sx={{
							color: "white",
							height: "100%",
						}}
						container
						direction='row'
						justifyContent='space-evenly'
						alignItems='center'
					>
						<Grid item>
							<Card
								sx={{
									height: {
										xs: mangaCoverHeightXs,
										sm: mangaCoverHeightMd,
										md: mangaCoverHeightMd,
										lg: mangaCoverHeightLg,
										xl: mangaCoverHeightLg,
									},
									width: {
										xs: mangaCoverWidthXs,
										sm: mangaCoverWidthMd,
										md: mangaCoverWidthMd,
										lg: mangaCoverWidthLg,
										xl: mangaCoverWidthLg,
									},
								}}
							>
								<CardMedia
									sx={{
										height: "100%",
										width: "100%",
									}}
									image={
										"https://uploads.mangadex.org/covers/" +
										state.id +
										"/" +
										state.coverFile
									}
								/>
							</Card>
						</Grid>
						<Grid item sx={{ width: { xs: "70%", md: "70%", lg: "80%" } }}>
							<div>
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "flex-end",
									}}
								>
									<Typography
										sx={{
											display: "-webkit-box",
											overflow: "hidden",
											WebkitBoxOrient: "vertical",
											WebkitLineClamp: 2,
											fontSize: { xs: 20, sm: 25, lg: 30 },
											paddingRight: "20px",
										}}
									>
										{mangaName}
									</Typography>

									{mangaAltTitles.map((current) => (
										<Typography
											sx={{
												display: "-webkit-box",
												overflow: "hidden",
												WebkitBoxOrient: "vertical",
												WebkitLineClamp: 2,
												fontSize: { xs: 0, sm: 9, lg: 10 },
												paddingRight: "5px",
											}}
										>
											/ {Object.values(current)}
										</Typography>
									))}
								</div>
								<Typography
									sx={{
										display: "-webkit-box",
										overflow: "hidden",
										WebkitBoxOrient: "vertical",
										WebkitLineClamp: { xs: 2, sm: 3, lg: 4 },
										fontSize: { xs: 15, sm: 15, lg: 20 },
									}}
								>
									{mangaDescription}
								</Typography>
								<div style={{ display: "flex", justifyContent: "flex-end" }}>
									<Button
										variant='text'
										sx={{
											height: { xs: "20px", sm: "25px", lg: "30px" },
											color: "#333333",
											fontSize: { xs: 8, sm: 10, lg: 12 },
											"&:hover": {
												backgroundColor: "transparent",
											},
										}}
									>
										Show more
									</Button>
								</div>
								<div>
									<Typography
										sx={{
											color: "#555555",
											fontSize: { xs: 8, sm: 10, lg: 15 },
										}}
									>
										Content Rating:
									</Typography>
									<Typography
										sx={{
											color: "#555555",
											fontSize: { xs: 8, sm: 10, lg: 15 },
										}}
									>
										{mangaContentRating}
									</Typography>
								</div>
							</div>
						</Grid>
					</Grid>
				</Grid>

				<Grid
					item
					sx={{
						width: "95%",
						height: { xs: "230px", sm: "100px", lg: "200px" },
					}}
				>
					<Grid
						container
						direction='column'
						justifyContent='center'
						alignItems='center'
						spacing={1}
					>
						<Grid item>
							<Typography
								align='center'
								color='white'
								sx={{ fontSize: { xs: 12, sm: 14, lg: 16 } }}
							>
								Languages
							</Typography>
						</Grid>
						<Grid item>
							<Grid
								container
								direction='row'
								justifyContent='center'
								alignItems='center'
								sx={{}}
								spacing={1}
							>
								{mangaLanguages.map((current) => (
									<Grid item>
										<Button
											sx={{
												backgroundColor: "#191919",
												width: { xs: "20px", sm: "20px", lg: "20px" },
												height: { xs: "30px", sm: "30px", lg: "30px" },
											}}
										>
											<span
												style={{ height: "20px", width: "20px" }}
												className={`fi fi-${getCountryDetails(current)}`}
											></span>
										</Button>
									</Grid>
								))}
							</Grid>
						</Grid>
						<Grid item>
							<Grid
								container
								direction='row'
								justifyContent='center'
								alignItems='center'
								sx={{}}
								spacing={1}
							>
								{mangaTags.map((current: any) => (
									<Grid item>
										<Button
											sx={{
												backgroundColor: "#191919",
												width: { xs: "110px", sm: "110px", lg: "110px" },
												height: { xs: "20px", sm: "20px", lg: "20px" },
												textAlign: "center",
											}}
										>
											<Typography
												noWrap
												color='#333333'
												sx={{ fontSize: { xs: 9, sm: 10, lg: 10 } }}
											>
												{current["attributes"].name["en"]}
											</Typography>
										</Button>
									</Grid>
								))}
							</Grid>
						</Grid>
					</Grid>
					<Grid item sx={{ paddingTop: "20px" }}>
						<Typography
							color='#555555'
							sx={{ fontSize: { xs: 15, sm: 15, lg: 15 } }}
						>
							Updated on:
							{dayjs(mangaUpdatedAt).format(" MM/DD/YYYY ")}
							at:
							{dayjs(mangaUpdatedAt).format(" hh:mm")}
						</Typography>
						<Button
							sx={{
								backgroundColor: "#191919",
								width: { xs: "110px", sm: "110px", lg: "110px" },
								height: { xs: "20px", sm: "20px", lg: "20px" },
								textAlign: "center",
							}}
						>
							<Typography
								noWrap
								color='#333333'
								sx={{ fontSize: { xs: 9, sm: 10, lg: 10 } }}
							>
								Latest
							</Typography>
						</Button>
					</Grid>
					<Grid item sx={{ paddingTop: "5px" }}>
						<Button
							sx={{
								backgroundColor: "#191919",
								width: { xs: "110px", sm: "110px", lg: "110px" },
								height: { xs: "20px", sm: "20px", lg: "20px" },
								textAlign: "center",
							}}
							href={mangaRaw}
						>
							<Typography
								noWrap
								color='#333333'
								sx={{ fontSize: { xs: 9, sm: 10, lg: 10 } }}
							>
								RAW
							</Typography>
						</Button>
					</Grid>
				</Grid>
				<Grid
					item
					sx={{
						width: { xs: "80%", md: "50%", lg: "30%" },
						height: { xs: "330px", md: "300px", lg: "320px" },
						overflow: "auto",
					}}
				>
					<Grid
						container
						direction='column'
						justifyContent='center'
						alignItems='center'
						spacing={1}
					>
						{mangaFeed.map((current: any) => (
							<Grid item sx={{ width: "100%", height: "50px" }}>
								<Button
									sx={{
										width: "100%",
										color: "white",
										height: "100%",
										backgroundColor: "#333333",
										justifyContent: "flex-start",
									}}
								>
									<Typography sx={{ textTransform: "none" }}>
										Chapter {current["attributes"].chapter}
									</Typography>
									<span
										style={{
											height: "10px",
											width: "10px",
											paddingLeft: "20px",
										}}
										className={`fi fi-${getCountryDetails(
											current["attributes"].translatedLanguage
										)}`}
									></span>
								</Button>
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};
//{Object.keys(mangaDetails)["attributes"].title["en"]}
export default IndividualManga;
