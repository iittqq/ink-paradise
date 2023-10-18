import { Grid, Card, CardMedia, Typography, Button } from "@mui/material";
import StandardButton from "./StandardButton";
import React, { useState } from "react";

type Props = {
	title: string;
	id: string;
	coverFile: string;
	mangaAltTitles: any[];
	mangaDescription: string;
	mangaContentRating: string;
	mangaFromMal: string;
	mangaFromMalCoverFile: string;
	mangaName: string;
};

const mangaCoverHeightXs = "200px";
const mangaCoverWidthXs = "100px";
const mangaCoverHeightMd = "250px";
const mangaCoverWidthMd = "150px";
const mangaCoverHeightLg = "300px";
const mangaCoverWidthLg = "200px";

const MangaBanner = (props: Props) => {
	const [showMoreToggled, setShowMoreToggled] = useState(false);
	const {
		title,
		id,
		coverFile,
		mangaAltTitles,
		mangaDescription,
		mangaContentRating,
		mangaFromMal,
		mangaFromMalCoverFile,
		mangaName,
	} = props;
	const handleShowMore = () => {
		setShowMoreToggled(!showMoreToggled);
	};
	return (
		<div>
			{" "}
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
								title === undefined
									? "https://uploads.mangadex.org/covers/" +
									  id +
									  "/" +
									  coverFile
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

							{mangaAltTitles.map((current, index) =>
								index > 10 ? null : (
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
								)
							)}
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
		</div>
	);
};

export default MangaBanner;
