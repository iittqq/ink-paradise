import {
	Container,
	Grid,
	Card,
	Button,
	CardMedia,
	Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Components/Header";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

type Props = {};
const baseUrl = "https://api.mangadex.org";
const pageBaseUrl = "https://uploads.mangadex.org/data/";
const Reader = (props: Props) => {
	const { state } = useLocation();
	const [pages, setPages] = useState<string[]>([]);
	const [hash, setHash] = useState<string>("");
	const [currentPage, setCurrentPage] = useState(0);
	const fetchChapterData = async () => {
		const { data } = await axios.get(
			`${baseUrl}/at-home/server/${state.chapterId}`,
			{
				params: {},
			}
		);

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
	};

	useEffect(() => {
		fetchChapterData();
		console.log(pages);
	}, [state]);
	return (
		<div
			style={{
				height: "100vh",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-start",
				alignItems: "center",
			}}
		>
			<Grid
				container
				direction='column'
				justifyContent='space-between'
				alignItems='center'
				sx={{ height: "90vh" }}
			>
				<Grid item sx={{ width: "100%" }}>
					<Header />
				</Grid>
				<Grid item>
					<div
						style={{
							width: "100%",
							display: "flex",
							flexDirection: "column",
							justifyContent: "flex-start",
							alignItems: "center",
						}}
					>
						<Typography color='white'>{state.mangaName}</Typography>
						<Typography color='white'>{state.title}</Typography>
						<Typography color='white'>
							Volume {state.volume} Chapter {state.chapter}
						</Typography>
					</div>
				</Grid>
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
								height: "60vh",
								width: "50%",
								position: "absolute",
								"&.MuiButtonBase-root:hover": {
									backgroundColor: "transparent",
								},
								".MuiTouchRipple-child": {
									backgroundColor: "white",
								},
							}}
							onClick={() => {
								setCurrentPage(currentPage - 1);
							}}
						></Button>

						<img
							style={{ width: "100%", height: "60vh", objectFit: "contain" }}
							src={pageBaseUrl + hash + "/" + pages[currentPage]}
							alt=''
						/>
						<Button
							sx={{
								backgroundColor: "transparent",
								height: "60vh",
								width: "50%",
								position: "absolute",
								transform: "translate(-100%)",
								"&.MuiButtonBase-root:hover": {
									backgroundColor: "transparent",
								},
								".MuiTouchRipple-child": {
									backgroundColor: "white",
								},
							}}
							onClick={() => {
								setCurrentPage(currentPage + 1);
							}}
						></Button>
					</div>

					<div>
						<Button
							sx={{ color: "white" }}
							onClick={() => {
								setCurrentPage(0);
							}}
						>
							<KeyboardDoubleArrowLeftIcon />
						</Button>
						<Button
							sx={{ color: "white" }}
							onClick={() => {
								setCurrentPage(currentPage - 1);
							}}
						>
							<KeyboardArrowLeftIcon />
						</Button>
						<Button
							sx={{ color: "white" }}
							onClick={() => {
								setCurrentPage(currentPage + 1);
							}}
						>
							<KeyboardArrowRightIcon />
						</Button>
						<Button
							sx={{ color: "white" }}
							onClick={() => {
								setCurrentPage(pages.length - 1);
							}}
						>
							<KeyboardDoubleArrowRightIcon />
						</Button>
					</div>
					<Typography color='white'>
						{currentPage} / {pages.length}
					</Typography>
				</Grid>
			</Grid>
		</div>
	);
};

export default Reader;
