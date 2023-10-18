import { Grid, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

type Props = {
	mangaId: string;
	mangaFeed: any[];
	mangaFromMal?: string;
	mangaName: string;
	selectedLanguage: any;
	setOpen?: any;
	insideReader: boolean;
	scantalationGroups: any[];
};
const MangaChapterList = (props: Props) => {
	const {
		mangaId,
		mangaFeed,
		mangaFromMal,
		mangaName,
		selectedLanguage,
		insideReader,
		setOpen,
		scantalationGroups,
	} = props;
	let navigate = useNavigate();
	const handleClick = (
		mangaId: string,
		chapterId: string,
		title: string,
		volume: string,
		chapter: string,
		mangaName: string,
		chapterNumber: number
	) => {
		navigate("/reader", {
			state: {
				mangaId: mangaId,
				chapterId: chapterId,
				title: title,
				volume: volume,
				chapter: chapter,
				mangaName: mangaName,
				chapterNumber: chapterNumber,
			},
		});
	};
	const handleClickInsideReader = (
		mangaId: string,
		chapterId: string,
		title: string,
		volume: string,
		chapter: string,
		mangaName: string
	) => {
		//setCurrentPage(0);
		navigate("/reader", {
			state: {
				mangaId: mangaId,
				chapterId: chapterId,
				title: title,
				volume: volume,
				chapter: chapter,
				mangaName: mangaName,
			},
		});
	};
	useEffect(() => console.log(mangaFeed), []);
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Grid
				container
				direction='column'
				justifyContent='center'
				alignItems='center'
				sx={{
					height: "100%",
					overflow: "scroll",
					display: "inline",
					scrollbarWidth: "none",
					"::-webkit-scrollbar": {
						display: "none",
					},
				}}
			>
				{mangaFeed.map((current: any, index) =>
					current["attributes"]["translatedLanguage"] === selectedLanguage ? (
						<Grid item sx={{ width: "100%", height: "50px", padding: "2px" }}>
							{insideReader === true ? (
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
									onClick={() => {
										handleClickInsideReader(
											mangaId,
											current["id"],
											current["attributes"]["title"],
											current["attributes"]["volume"],
											current["attributes"]["chapter"],
											mangaName
										);
										setOpen(false);
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
										<Typography
											color='#555555'
											sx={{
												fontSize: { xs: 10, sm: 10, lg: 15 },
												paddingLeft: "10px",
											}}
										>
											{scantalationGroups[index]}
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
							) : (
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
									onClick={() => {
										handleClick(
											mangaId,
											current["id"],
											current["attributes"]["title"],
											current["attributes"]["volume"],
											current["attributes"]["chapter"],
											mangaName,
											+current["attributes"]["chapter"]
										);
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
										<Typography
											color='#555555'
											sx={{
												fontSize: { xs: 10, sm: 10, lg: 15 },
												paddingLeft: "10px",
											}}
										>
											{scantalationGroups[index]}
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
							)}
						</Grid>
					) : null
				)}
			</Grid>
		</div>
	);
};

export default MangaChapterList;
