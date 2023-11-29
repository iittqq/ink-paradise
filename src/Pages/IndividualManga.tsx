import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import MangaBanner from "../Components/MangaBanner";
import MangaTags from "../Components/MangaTags";
import MangaControls from "../Components/MangaControls";
import MangaChapterList from "../Components/MangaChapterList";

const IndividualManga = () => {
	const { state } = useLocation();
	const [mangaFromMal, setMangaFromMal] = useState<string>("");
	const [mangaFromMalCoverFile, setMangaFromMalCoverFile] =
		useState<string>("");
	const [mangaName, setMangaName] = useState("");
	const [mangaDescription, setMangaDescription] = useState("");
	const [mangaAltTitles, setMangaAltTitles] = useState<Object[]>([]);
	const [mangaLanguages, setMangaLanguages] = useState<string[]>([]);
	const [mangaContentRating, setMangaContentRating] = useState("");
	const [mangaRaw, setMangaRaw] = useState("");
	const [mangaTags, setMangaTags] = useState<Object[]>([]);
	const [mangaFeed, setMangaFeed] = useState<any[]>([]);
	const [selectedLanguage, setSelectedLanguage] = useState("en");
	const [currentOffset, setCurrentOffset] = useState(0);
	const [currentOrder, setCurrentOrder] = useState("asc");
	const [scantalationGroups, setScantalationGroups] = useState<any[]>([]);

	const baseUrl = "https://api.mangadex.org";
	const fetchMangaDetails = async () => {
		fetch(`${baseUrl}/manga/${state.id}`)
			.then((response) => response.json())
			.then((mangaDetails) => {
				console.log(mangaDetails.data);
				setMangaName(mangaDetails.data["attributes"].title["en"]);
				setMangaDescription(mangaDetails.data["attributes"].description["en"]);
				setMangaAltTitles(mangaDetails.data["attributes"].altTitles);
				setMangaLanguages(
					mangaDetails.data["attributes"].availableTranslatedLanguages
				);
				setMangaContentRating(mangaDetails.data["attributes"].contentRating);

				setMangaRaw(
					mangaDetails.data["attributes"].links === null
						? ""
						: mangaDetails.data["attributes"].links["raw"]
				);

				setMangaTags(mangaDetails.data["attributes"].tags);
			});
	};

	const fetchMangaFeed = async (id: string) => {
		fetch(
			`${baseUrl}/manga/${id}/feed?limit=50&offset=${currentOffset}&translatedLanguage%5B%5D=${selectedLanguage}&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&includeFutureUpdates=1&order%5Bchapter%5D=${currentOrder}`
		)
			.then((response) => response.json())
			.then((mangaFeed) => {
				mangaFeed.data.length === 0
					? setCurrentOffset(0)
					: setMangaFeed(mangaFeed.data);

				setScantalationGroups([]);
				mangaFeed.data.forEach((current: any) => {
					fetchScantalationGroup(current["relationships"][0]["id"]);
				});
				console.log(mangaFeed.data);
			});
	};

	const fetchMangaByName = async () => {
		console.log(state.title);
		fetch(
			`${baseUrl}/manga?limit=10&title=${state.title}&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5Brelevance%5D=desc`
		)
			.then((response) => response.json())
			.then((details) => {
				setMangaFromMal(details.data[0]["id"]);
				fetchMangaFeed(details.data[0]["id"]);

				fetch(
					`${baseUrl}/cover/${
						details.data[0]["relationships"].find(
							(i: any) => i.type === "cover_art"
						).id
					}`
				)
					.then((response) => response.json())
					.then((coverFile) => {
						setMangaFromMalCoverFile(
							coverFile["data"]["attributes"]["fileName"]
						);
					});

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
			});
	};
	const fetchScantalationGroup = async (id: string) => {
		fetch(`${baseUrl}/group/${id}`)
			.then((response) => response.json())
			.then((group) => {
				setScantalationGroups((scantalationGroups) => [
					...scantalationGroups,
					group["data"]["attributes"]["name"],
				]);
			});
	};

	useEffect(() => {
		if (state["title"] !== undefined) {
			fetchMangaByName();
		} else {
			fetchMangaDetails();
			fetchMangaFeed(state.id);
		}
	}, [state, selectedLanguage, currentOffset, currentOrder]);

	return (
		<div style={{ minHeight: "100vh", overflow: "scroll" }}>
			<Grid
				container
				direction='column'
				justifyContent='space-between'
				alignItems='center'
				sx={{ width: "100%", height: "100%" }}
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
					<MangaBanner
						title={state.title}
						id={state.id}
						coverFile={state.coverFile}
						mangaFromMal={mangaFromMal}
						mangaFromMalCoverFile={mangaFromMalCoverFile}
						mangaAltTitles={mangaAltTitles}
						mangaDescription={mangaDescription}
						mangaContentRating={mangaContentRating}
						mangaName={mangaName}
					/>
				</Grid>

				<Grid
					item
					sx={{
						width: "95%",
						paddingBottom: "10px",
					}}
				>
					<MangaTags mangaTags={mangaTags} />
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
						height: "45vh",
						display: "flex",
						paddingTop: "20px",
						justifyContent: "center",
					}}
				>
					<MangaControls
						mangaLanguages={mangaLanguages}
						currentOffset={currentOffset}
						setCurrentOffset={setCurrentOffset}
						currentOrder={currentOrder}
						setCurrentOrder={setCurrentOrder}
						selectedLanguage={selectedLanguage}
						setSelectedLanguage={setSelectedLanguage}
						mangaTranslators={scantalationGroups}
						setTranslator={setScantalationGroups}
					/>
					{mangaFromMal === undefined ? (
						<MangaChapterList
							mangaFeed={mangaFeed}
							mangaName={mangaName}
							selectedLanguage={selectedLanguage}
							mangaId={state.id}
							insideReader={false}
							scantalationGroups={scantalationGroups}
						/>
					) : (
						<MangaChapterList
							mangaFeed={mangaFeed}
							mangaName={mangaName}
							selectedLanguage={selectedLanguage}
							mangaId={mangaFromMal}
							insideReader={false}
							scantalationGroups={scantalationGroups}
						/>
					)}
				</Grid>
				<Grid item>
					<Footer />
				</Grid>
			</Grid>
		</div>
	);
};

export default IndividualManga;
