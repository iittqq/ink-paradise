import { Grid, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useNavigate } from "react-router-dom";

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
							color: "white",
							"&.MuiButtonBase-root:hover": {
								backgroundColor: "transparent",
							},
						}}
						onClick={() => handleNextChapterButton()}
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
							color: "white",
							height: "65vh",
							width: "50%",
							position: "absolute",
							transform: "translate(-100%)",
							"&.MuiButtonBase-root:hover": {
								backgroundColor: "transparent",
							},
						}}
						onClick={() => handlePreviousChapterButton()}
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

				<Typography color='white'>
					{currentPage + 1} / {pages.length}
				</Typography>
			</Grid>
		</div>
	);
};

export default PageAndControls;
