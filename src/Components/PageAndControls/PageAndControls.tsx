import { Grid, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useNavigate } from "react-router-dom";
import "./PageAndControls.css";

type Props = {
	chapters: any[];
	pages: any[];
	pageBaseUrl: string;
	hash: string;
	currentChapter: string;
	mangaId: string;
	mangaName: string;
	offsetStart: number;
};

const PageAndControls = (props: Props) => {
	const {
		chapters,
		pages,
		pageBaseUrl,
		hash,
		currentChapter,
		mangaId,
		mangaName,
		offsetStart,
	} = props;
	let navigate = useNavigate();

	const [currentPage, setCurrentPage] = useState(0);

	const handleNextChapter = () => {
		chapters.forEach((current, index) =>
			current["attributes"]["chapter"] === currentChapter
				? handleClick(
						mangaId,
						chapters[index - 1]["id"],
						chapters[index - 1]["attributes"]["title"],
						chapters[index - 1]["attributes"]["volume"],
						chapters[index - 1]["attributes"]["chapter"],
						mangaName
				  )
				: null
		);
	};

	const handlePreviousChapter = () => {
		chapters.forEach((current, index) =>
			current["attributes"]["chapter"] === currentChapter
				? handleClick(
						mangaId,
						chapters[index + 1]["id"],
						chapters[index + 1]["attributes"]["title"],
						chapters[index + 1]["attributes"]["volume"],
						chapters[index + 1]["attributes"]["chapter"],
						mangaName,
						chapters[index + 1]["attributes"]["pages"]
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
		mangaName: string,
		startingPage?: number
	) => {
		navigate("/reader", {
			state: {
				mangaId: mangaId,
				chapterId: chapterId,
				title: title,
				volume: volume,
				chapter: chapter,
				mangaName: mangaName,
				startingPage: startingPage,
			},
		});
	};

	useEffect(() => {
		offsetStart === 0 ? setCurrentPage(0) : setCurrentPage(offsetStart - 1);
		console.log(currentPage);
	}, [props]);

	return (
		<div>
			<div className='page' style={{ position: "relative" }}>
				<img
					style={{
						width: "100%",
						height: "65vh",
						objectFit: "contain",
					}}
					src={pageBaseUrl + hash + "/" + pages[currentPage]}
					alt=''
				/>
				<div
					style={{
						position: "absolute",
						height: "100%",
						width: "100%",
						display: "flex",
						justifyContent: "space-between",
						transform: "translateY(-100%)",
					}}
				>
					<Button
						className='chapter-page-traversal'
						onClick={() => handleNextChapterButton()}
					></Button>
					<Button
						className='chapter-page-traversal'
						onClick={() => handlePreviousChapterButton()}
					></Button>
				</div>
			</div>
			<div className='centered'>
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

			<Typography color='white' align='center'>
				{currentPage + 1} / {pages.length}
			</Typography>
		</div>
	);
};

export default PageAndControls;
