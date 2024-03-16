import {
	Typography,
	List,
	ListItemButton,
	ListItemText,
	Collapse,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../Components/Header/Header";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import PageAndControls from "../../Components/PageAndControls/PageAndControls";
import MangaChapterList from "../../Components/MangaChapterList/MangaChapterList";
import "./Reader.css";

import { fetchChapterData, fetchMangaFeed } from "../../api/MangaDexApi";

import { MangaChapter, MangaFeed } from "../../interfaces/MangaDexInterfaces";

const pageBaseUrl = "https://uploads.mangadex.org/data/";

const Reader = () => {
	const { state } = useLocation();
	const [pages, setPages] = useState<string[]>([]);
	const [hash, setHash] = useState<string>("");
	const [chapters, setChapters] = useState<MangaFeed[]>([]);
	const [selectedLanguage] = useState("en");
	const [open, setOpen] = useState(false);
	const [order] = useState("desc");
	const [scantalationGroups] = useState<object[]>([]);

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
		fetchChapterData(state.chapterId).then((data: MangaChapter) => {
			setPages(data.chapter.data);
			setHash(data.chapter.hash);
		});

		fetchMangaFeed(state.mangaId, 300, 0, order, selectedLanguage).then(
			(data: MangaFeed[]) => {
				setChapters(data);
			},
		);
	}, [state]);

	return (
		<div className='reader-page'>
			<div className='header'>
				<Header />
			</div>
			<div className='reader-page'>
				<Typography color='white'>{state.mangaName}</Typography>
				<Typography color='white'>{state.title}</Typography>
				<List className='reader-feed'>
					<ListItemButton
						className='reader-feed-button'
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
					<Collapse className='reader-feed-collapse' in={open} timeout='auto'>
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
		</div>
	);
};

export default Reader;
