import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import MangaBanner from "../../Components/MangaBanner";
import MangaTags from "../../Components/MangaTags";
import MangaControls from "../../Components/MangaControls";
import MangaChapterList from "../../Components/MangaChapterList";

import {
	fetchMangaByName,
	fetchMangaCover,
	fetchMangaFeed,
	fetchMangaById,
	fetchScantalationGroup,
} from "../../api/MangaDexApi";
import "./IndividualManga.css";

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
		<div>
			<div className='header'>
				<Header />
			</div>
			<div className='page-header'>
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
			</div>
			<div>
				<MangaTags mangaTags={mangaTags} />
			</div>
			<div className='centered-content'>
				<Button className='raw-button' href={mangaRaw}>
					<Typography
						noWrap
						color='#333333'
						sx={{ fontSize: { xs: 9, sm: 10, lg: 10 } }}
					>
						RAW
					</Typography>
				</Button>
			</div>
			<div className='controls-chapters-section'>
				<div className='manga-controls'>
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
				</div>
				<div className='manga-chapter-list'>
					<MangaChapterList
						mangaFeed={mangaFeed}
						mangaName={mangaName}
						selectedLanguage={selectedLanguage}
						mangaId={state.id === undefined ? mangaId : state.id}
						insideReader={false}
						scantalationGroups={scantalationGroups}
					/>
				</div>
			</div>

			<div className='footer'>
				<Footer />
			</div>
		</div>
	);
};

export default IndividualManga;
