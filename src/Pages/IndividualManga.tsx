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
import dayjs from "dayjs";
import Header from "../Components/Header";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import StandardButton from "../Components/StandardButton";

const mangaCoverHeightXs = "200px";
const mangaCoverWidthXs = "100px";
const mangaCoverHeightMd = "250px";
const mangaCoverWidthMd = "150px";
const mangaCoverHeightLg = "300px";
const mangaCoverWidthLg = "200px";

type Props = {};
const IndividualManga = (props: Props) => {
	const { state } = useLocation();
	const [mangaFromMal, setMangaFromMal] = useState<string>("");
	const [mangaFromMalCoverFile, setMangaFromMalCoverFile] =
		useState<string>("");
	const [mangaName, setMangaName] = useState();
	const [mangaDescription, setMangaDescription] = useState();
	const [mangaAltTitles, setMangaAltTitles] = useState<Object[]>([]);
	const [mangaLanguages, setMangaLanguages] = useState<string[]>([]);
	const [mangaContentRating, setMangaContentRating] = useState("");
	const [mangaRaw, setMangaRaw] = useState("");
	const [mangaTags, setMangaTags] = useState<Object[]>([]);
	const [mangaFeed, setMangaFeed] = useState<Object[]>([]);
	const [showMoreToggled, setShowMoreToggled] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState("");

	const baseUrl = "https://api.mangadex.org/";
	const fetchRecentlyUpdatedManga = async () => {
		const { data: details } = await axios.get(`${baseUrl}manga/${state.id}`);

		console.log(details.data);
		setMangaName(details.data["attributes"].title["en"]);
		setMangaDescription(details.data["attributes"].description["en"]);
		setMangaAltTitles(details.data["attributes"].altTitles);
		setMangaLanguages(details.data["attributes"].availableTranslatedLanguages);
		setMangaContentRating(details.data["attributes"].contentRating);

		setMangaRaw(
			details.data["attributes"].links === null
				? ""
				: details.data["attributes"].links["raw"]
		);

		setMangaTags(details.data["attributes"].tags);
	};

	const fetchMangaFeed = async (id: string) => {
		const { data: feed } = await axios.get(`${baseUrl}manga/${id}/feed`, {
			params: { order: { chapter: "desc" } },
		});

		console.log(feed.data);
		setMangaFeed(feed.data);
	};

	const fetchMangaByName = async (id: string) => {
		const { data: details } = await axios.get(`${baseUrl}/manga/`, {
			params: {
				limit: 10,
				title: state["title"],
				authorOrArtist: id,
				contentRating: ["safe", "suggestive", "erotica"],
				order: {
					title: "asc",
				},
			},
		});
		console.log(details.data);
		details.data.map((element: any) =>
			element["attributes"]["title"]["en"] === state["title"]
				? setMangaFromMal(element["id"])
				: console.log(element)
		);

		fetchMangaFeed(details.data[0]["id"]);

		const { data: coverFile } = await axios.get(
			`${baseUrl}/cover/${
				details.data[0]["relationships"].find(
					(i: any) => i.type === "cover_art"
				).id
			}`,
			{}
		);
		console.log(coverFile);

		setMangaFromMalCoverFile(coverFile["data"]["attributes"]["fileName"]);

		console.log(details.data[0]);
		setMangaName(details.data[0]["attributes"].title["en"]);
		setMangaDescription(details.data[0]["attributes"].description["en"]);
		setMangaAltTitles(details.data[0]["attributes"].altTitles);
		setMangaLanguages(
			details.data[0]["attributes"].availableTranslatedLanguages
		);
		setMangaContentRating(details.data[0]["attributes"].contentRating);

		setMangaRaw(
			details.data[0]["attributes"].links === null
				? ""
				: details.data[0]["attributes"].links["raw"]
		);

		setMangaTags(details.data[0]["attributes"].tags);
	};
	const fetchAuthorByName = async (name: string) => {
		const { data: authorDetails } = await axios.get(`${baseUrl}/author`, {
			params: {
				limit: 10,
				name: name,
			},
		});
		console.log(authorDetails);

		fetchMangaByName(authorDetails.data[0]["id"]);
	};

	const handleShowMore = () => {
		setShowMoreToggled(!showMoreToggled);
	};

	useEffect(() => {
		if (state["title"] !== undefined) {
			let temp = state["author"].split(",");
			fetchAuthorByName(temp[1] + " " + temp[0]);
		} else {
			fetchRecentlyUpdatedManga();
			fetchMangaFeed(state.id);
		}
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
										state["title"] === undefined
											? "https://uploads.mangadex.org/covers/" +
											  state.id +
											  "/" +
											  state.coverFile
											: "https://uploads.mangadex.org/covers/" +
											  mangaFromMal +
											  "/" +
											  mangaFromMalCoverFile
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

										WebkitLineClamp:
											showMoreToggled === true
												? { xs: 5, sm: 3, lg: 4 }
												: { xs: 1, sm: 1, lg: 1 },
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

											backgroundColor: "transparent",
											"&.MuiButtonBase-root:hover": {
												bgcolor: "transparent",
											},
											".MuiTouchRipple-child": {
												backgroundColor: "white",
											},
										}}
										onClick={handleShowMore}
									>
										{showMoreToggled === true ? (
											<Typography
												color='#333333'
												sx={{ fontSize: { xs: 10, sm: 10, lg: 12 } }}
											>
												Show less
											</Typography>
										) : (
											<Typography
												color='#333333'
												sx={{ fontSize: { xs: 10, sm: 10, lg: 12 } }}
											>
												Show more
											</Typography>
										)}
									</Button>
								</div>
								<div>
									<Typography
										sx={{
											color: "#555555",
											fontSize: { xs: 10, sm: 10, lg: 15 },
										}}
									>
										Content Rating:
									</Typography>
									<StandardButton
										backgroundColor='#191919'
										width='120px'
										height='20px'
										textColor='#333333'
										fontSizeXs={10}
										fontSizeSm={10}
										fontSizeLg={12}
										text={mangaContentRating}
										location={mangaContentRating}
									/>
								</div>
							</div>
						</Grid>
					</Grid>
				</Grid>

				<Grid
					item
					sx={{
						width: "95%",
						height: { xs: "160px", sm: "100px", lg: "120px" },
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
						}}
					>
						<Typography
							align='center'
							color='#555555'
							sx={{ fontSize: { xs: 12, sm: 14, lg: 16 } }}
						>
							Categories
						</Typography>

						<Grid
							container
							direction='row'
							justifyContent='center'
							alignItems='center'
							spacing={1}
							sx={{ paddingTop: "10px" }}
						>
							{mangaTags.map((current: any) => (
								<Grid item>
									<StandardButton
										backgroundColor='#191919'
										widthXs='120px'
										widthSm='120px'
										widthLg='120px'
										heightXs='20px'
										heightSm='20px'
										heightLg='20px'
										textColor='#333333'
										fontSizeXs={9}
										fontSizeSm={10}
										fontSizeLg={10}
										text={current["attributes"].name["en"]}
										location='none'
									/>
								</Grid>
							))}
						</Grid>
					</div>
				</Grid>
				<Grid item>
					<Button
						sx={{
							backgroundColor: "#191919",
							width: { xs: "50px", sm: "50px", lg: "50px" },
							height: { xs: "20px", sm: "20px", lg: "20px" },
							textAlign: "center",
							"&.MuiButtonBase-root:hover": {
								bgcolor: "transparent",
							},
							".MuiTouchRipple-child": {
								backgroundColor: "white",
							},
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
				<Grid
					item
					sx={{
						width: "95%",
						height: { xs: "330px", md: "300px", lg: "320px" },
						display: "flex",
						paddingTop: "20px",
						justifyContent: "space-between",
					}}
				>
					<div style={{ width: "50%" }}>
						<Typography
							align='center'
							color='#555555'
							sx={{ fontSize: { xs: 12, sm: 14, lg: 16 } }}
						>
							Languages
						</Typography>
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
											height: { xs: "20px", sm: "20px", lg: "20px" },
											"&.MuiButtonBase-root:hover": {
												bgcolor: "transparent",
											},
											".MuiTouchRipple-child": {
												backgroundColor: "white",
											},
										}}
										onClick={() => setSelectedLanguage(current)}
									>
										<Typography
											sx={{ fontSize: { xs: 10, sm: 10, lg: 12 } }}
											color='#333333'
										>
											{current}
										</Typography>
									</Button>
								</Grid>
							))}
						</Grid>
					</div>

					<Grid
						container
						direction='column'
						justifyContent='center'
						alignItems='center'
						sx={{
							height: "100%",
							overflow: "scroll",
							display: "inline",
							width: { xs: "100%", sm: "100%", lg: "50%" },
							scrollbarWidth: "none",
						}}
					>
						{mangaFeed.map((current: any) =>
							current["attributes"]["translatedLanguage"] ===
							selectedLanguage ? (
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
									>
										<div style={{ display: "flex" }}>
											<Typography
												sx={{
													textTransform: "none",
													fontSize: { xs: 10, sm: 10, lg: 15 },
												}}
												color='#555555'
											>
												Chapter {current["attributes"].chapter}
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
							) : null
						)}
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default IndividualManga;
