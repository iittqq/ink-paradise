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
import { DetailsById } from "../APIs/MangaDexAPI";
import dayjs from "dayjs";
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
	const [mangaAltTitles, setMangaAltTitles] = useState();
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

	const fetchRecentlyUpdatedManga = async () => {
		const { data } = await axios.get(DetailsById(state.id));
		setMangaDetails(data.data);
		console.log(data.data);
		setMangaName(data.data["attributes"].title["en"]);
		setMangaDescription(data.data["attributes"].description["en"]);
		setMangaAltTitles(data.data["attributes"].altTitles);
		setMangaLanguages(data.data["attributes"].availableTranslatedLanguages);
		setMangaContentRating(data.data["attributes"].contentRating);
		setMangaCreatedAt(data.data["attributes"].createdAt);
		setMangaRaw(data.data["attributes"].links["raw"]);
		setMangaState(data.data["attributes"].state);
		setMangaStatus(data.data["attributes"].status);
		setMangaTags(data.data["attributes"].tags);
		setMangaUpdatedAt(data.data["attributes"].updatedAt);
		setMangaRelationships(data.data["relationships"]);
	};

	useEffect(() => {
		fetchRecentlyUpdatedManga();
	}, []);

	return (
		<div
			style={{
				paddingTop: "50px",
				display: "flex",
				justifyContent: "center",
			}}
		>
			<Grid
				container
				direction='column'
				justifyContent='center'
				alignItems='flex-start'
			>
				<Grid item>
					<Grid
						sx={{
							color: "white",
						}}
						container
						direction='row'
						justifyContent='space-evenly'
						alignItems='flex-start'
					>
						<Grid item sx={{}}>
							<Card
								sx={{
									height: {
										xs: mangaCoverHeightXs,
										md: mangaCoverHeightMd,
										lg: mangaCoverHeightLg,
									},
									width: {
										xs: mangaCoverWidthXs,
										md: mangaCoverWidthMd,
										lg: mangaCoverWidthLg,
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
								<Typography
									sx={{
										display: "-webkit-box",
										overflow: "hidden",
										WebkitBoxOrient: "vertical",
										WebkitLineClamp: 2,
										fontSize: { xs: 20, sm: 25, lg: 30 },
									}}
								>
									{mangaName}
								</Typography>
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
								<Typography sx={{ fontSize: { xs: 12, sm: 14, lg: 16 } }}>
									Languages:
								</Typography>
								<Grid
									container
									direction='row'
									justifyContent='flex-start'
									alignItems='center'
									sx={{ paddingTop: "10px" }}
								>
									{mangaLanguages.map((current) => (
										<Grid item>
											<Button
												sx={{
													fontSize: { xs: 8, sm: 10, lg: 12 },
													color: "#777777",
													"&:hover": {
														backgroundColor: "transparent",
													},
												}}
												size='small'
											>
												{current}
											</Button>
										</Grid>
									))}
								</Grid>
							</div>
						</Grid>
					</Grid>
					<Grid
						item
						color='white'
						sx={{ paddingTop: "20px", paddingLeft: "20px" }}
					>
						<Grid
							container
							direction='row'
							justifyContent='flex-start'
							alignItems='center'
							spacing={1}
						>
							{mangaTags.map((current: any) => (
								<Grid item>
									<Button
										sx={{
											backgroundColor: "#191919",
											width: { xs: "80px", sm: "90px", lg: "90px" },
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
						<Grid item sx={{ paddingTop: "20px" }}>
							<Typography>
								Updated on:
								{dayjs(mangaUpdatedAt).format(" MM/DD/YYYY ")}
								at:
								{dayjs(mangaUpdatedAt).format(" hh:mm")}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};
//{Object.keys(mangaDetails)["attributes"].title["en"]}
export default IndividualManga;
