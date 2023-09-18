import React, { useEffect, useState, memo } from "react";
import { CoverById } from "../APIs/MangaDexAPI";
import axios from "axios";
import { Card, CardMedia, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useNavigate } from "react-router-dom";

type Props = {
	id: string;
	title: string;
	coverId: string;
};
const mangaCoverHeightXs = "200px";
const mangaCoverWidthXs = "100px";
const mangaCoverHeightMd = "250px";
const mangaCoverWidthMd = "150px";
const mangaCoverHeightLg = "300px";
const mangaCoverWidthLg = "200px";

dayjs.extend(utc);

const MangaClickable = (props: Props) => {
	let navigate = useNavigate();
	const [coverFile, setCoverFile] = useState("");
	//const [showDetails, setShowDetails] = useState(false);

	const { id, title, coverId } = props;

	const fetchCoverFile = async () => {
		const { data } = await axios.get(CoverById(coverId));
		setCoverFile(data.data["attributes"].fileName);
		return data.data;
	};

	function handleClick() {
		navigate("/individualView", {
			state: { id: id, coverFile: coverFile },
		});
	}

	useEffect(() => {
		fetchCoverFile();
	}, []);

	return (
		<div>
			<Button
				sx={{
					color: "black",
					"&.MuiButtonBase-root:hover": {
						bgcolor: "transparent",
					},
				}}
				onClick={() => {
					handleClick();
				}}
				//onMouseEnter={() => setShowDetails(true)}
				//onMouseLeave={() => setShowDetails(false)}
			>
				<div>
					<Card
						sx={{
							height: {
								xs: mangaCoverHeightXs,
								md: mangaCoverHeightMd,
								lg: mangaCoverHeightLg,
							},
							width: {
								xs: mangaCoverWidthXs,
								md: mangaCoverWidthMd,
								lg: mangaCoverWidthLg,
							},
						}}
					>
						<CardMedia
							sx={{
								height: "100%",
								width: "100%",
							}}
							image={
								"https://uploads.mangadex.org/covers/" + id + "/" + coverFile
							}
						/>
					</Card>
					<Typography
						fontSize={15}
						noWrap
						color='#EFEAD8'
						textTransform='none'
						sx={{
							width: {
								xs: mangaCoverWidthXs,
								md: mangaCoverWidthMd,
								lg: mangaCoverWidthLg,
							},
						}}
					>
						{title}
					</Typography>
				</div>
			</Button>
		</div>
	);
};

export default MangaClickable;
