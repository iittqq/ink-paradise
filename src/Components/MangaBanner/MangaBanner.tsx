/* eslint-disable no-mixed-spaces-and-tabs */
import { Typography, Button } from "@mui/material";
import { useState } from "react";
import "./MangaBanner.css";

type Props = {
	title: string;
	id: string;
	coverFile: string;
	mangaAltTitles: object[];
	mangaDescription: string;
	mangaContentRating: string;
	mangaFromMal: string;
	mangaFromMalCoverFile: string;
	mangaName: string;
};

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
		<div className='banner-container'>
			<div className='cover-image'>
				<img
					style={{ width: "100%", height: "100%" }}
					src={
						title === undefined
							? "https://uploads.mangadex.org/covers/" + id + "/" + coverFile
							: "https://uploads.mangadex.org/covers/" +
							  mangaFromMal +
							  "/" +
							  mangaFromMalCoverFile
					}
					alt=''
				/>
			</div>
			<div className='manga-details'>
				<div className='alt-name-container'>
					<Typography
						className='manga-name'
						sx={{
							fontSize: { xs: 20, sm: 25, lg: 30 },
						}}
					>
						{mangaName}
					</Typography>

					{mangaAltTitles.map((current, index) =>
						index > 10 ? null : (
							<Typography
								className='manga-alt-name'
								sx={{
									fontSize: { xs: 0, sm: 9, lg: 10 },
								}}
							>
								/ {Object.values(current)}
							</Typography>
						),
					)}
				</div>
				<Typography
					className='description'
					sx={{
						WebkitLineClamp: showMoreToggled === true ? 5 : 1,
						fontSize: { xs: 15, sm: 15, lg: 20 },
					}}
				>
					{mangaDescription}
				</Typography>

				<Button
					variant='text'
					className='show-button'
					sx={{
						height: { xs: "20px", sm: "25px", lg: "30px" },
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

				<div>
					<Typography
						sx={{
							color: "#555555",
							fontSize: { xs: 10, sm: 10, lg: 15 },
						}}
					>
						Content Rating:
					</Typography>
					<Button className='content-rating-button'>
						<Typography
							noWrap
							color='#333333'
							sx={{
								fontSize: 10,
							}}
						>
							{mangaContentRating}
						</Typography>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default MangaBanner;
