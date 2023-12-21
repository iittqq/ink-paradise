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

import {
	fetchMangaByName,
	fetchMangaCover,
	fetchMangaFeed,
	fetchMangaById,
	fetchScantalationGroup,
} from "../api/MangaDexApi";

const IndividualManga = () => {
	const { state } = useLocation();
	const [mangaId, setMangaId] = useState<string>("");
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

	useEffect(() => {
		if (state["title"] !== undefined) {
			fetchMangaByName(state["title"]).then((data: any) => {
				console.log(data);
				setMangaId(data[0]["id"]);

				fetchMangaFeed(
					data[0]["id"],
					50,
					currentOffset,
					currentOrder,
					selectedLanguage
				).then((data: any) => {
					data.length === 0 ? setCurrentOffset(0) : setMangaFeed(data);

					setScantalationGroups([]);
					/**
						data.forEach((current: any) => {
							fetchScantalationGroup(current["relationships"][0]["id"]).then(
								(data) => {
									setScantalationGroups((scantalationGroups) => [
										...scantalationGroups,
										data["attributes"]["name"],
									]);
								}
							);
						}); */
					console.log(data);
				});
				console.log(mangaFeed);
				fetchMangaCover(
					data[0]["relationships"].find((i: any) => i.type === "cover_art").id
				).then((coverFile) => {
					setMangaFromMalCoverFile(coverFile["attributes"]["fileName"]);
				});
				setMangaName(data[0]["attributes"].title["en"]);
				setMangaDescription(data[0]["attributes"].description["en"]);
				setMangaAltTitles(data[0]["attributes"].altTitles);
				setMangaLanguages(data[0]["attributes"].availableTranslatedLanguages);
				setMangaContentRating(data[0]["attributes"].contentRating);

				setMangaRaw(
					data[0]["attributes"].links === null
						? ""
						: data[0]["attributes"].links["raw"]
				);

				setMangaTags(data[0]["attributes"].tags);
			});
			//fetchMangaByName();
		} else {
			fetchMangaById(state.id).then((data: any) => {
				console.log(data);
				setMangaName(data["attributes"].title["en"]);
				setMangaDescription(data["attributes"].description["en"]);
				setMangaAltTitles(data["attributes"].altTitles);
				setMangaLanguages(data["attributes"].availableTranslatedLanguages);
				setMangaContentRating(data["attributes"].contentRating);

				setMangaRaw(
					data["attributes"].links === null
						? ""
						: data["attributes"].links["raw"]
				);

				setMangaTags(data["attributes"].tags);
			});
			fetchMangaFeed(
				state.id,
				50,
				currentOffset,
				currentOrder,
				selectedLanguage
			).then((data: any) => {
				data.length === 0 ? setCurrentOffset(0) : setMangaFeed(data);
				/**
					setScantalationGroups([]);
					data.forEach((current: any) => {
						fetchScantalationGroup(current["relationships"][0]["id"]).then(
							(data) => {
								setScantalationGroups((scantalationGroups) => [
									...scantalationGroups,
									data["attributes"]["name"],
								]);
							}
						);
					});
				*/
				console.log(data);
			});
		}
		console.log(mangaFeed);
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
						mangaFromMal={mangaId}
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

					<MangaChapterList
						mangaFeed={mangaFeed}
						mangaName={mangaName}
						selectedLanguage={selectedLanguage}
						mangaId={state.id === undefined ? mangaId : state.id}
						insideReader={false}
						scantalationGroups={scantalationGroups}
					/>
				</Grid>
				<Grid item>
					<Footer />
				</Grid>
			</Grid>
		</div>
	);
};

export default IndividualManga;
