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
import Header from "../../Components/Header";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import PageAndControls from "../../Components/PageAndControls/PageAndControls";
import MangaChapterList from "../../Components/MangaChapterList";
import "./Reader.css";

import { fetchChapterData, fetchMangaFeed } from "../../api/MangaDexApi";
import Footer from "../../Components/Footer";

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

	const handleOpenChapters = () => {
		/** 
		chapters.forEach((current) => {
			fetchScantalationGroup(current["relationships"][0]["id"]);
		});*/
		setOpen(!open);
	};
	/** 
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
*/
	useEffect(() => {
		fetchChapterData(state.chapterId).then((data) => {
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

		fetchMangaFeed(state.mangaId, 300, 0, order, selectedLanguage).then(
			(data: Object[]) => {
				setChapters(data);
				console.log(data);
			}
		);
		console.log(pages);
	}, [state]);

	return (
		<div className='reader-page'>
			<div className='header'>
				<Header />
			</div>
			<div className='reader-page'>
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
					<Collapse sx={{ width: "100%" }} in={open} timeout='auto'>
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
			</div>
			{open === true ? null : (
				<PageAndControls
					chapters={chapters}
					pages={pages}
					pageBaseUrl={pageBaseUrl}
					hash={hash}
					currentChapter={state.chapter}
					mangaId={state.mangaId}
					mangaName={state.mangaName}
					offsetStart={
						isNaN(state.startingPage) === true ||
						state.startingPage === undefined
							? 0
							: state.startingPage
					}
				/>
			)}

			<div className='footer'>
				<Footer />
			</div>
		</div>
	);
};

export default Reader;
