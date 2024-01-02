/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useState } from "react";

import { Card, CardMedia, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import "./MangaClickable.css";

type Props = {
	id?: string;
	title: string;
	coverId?: string;
	updatedAt?: string;
	rank?: string;
	coverUrl?: string;
	author?: string;
};

const baseUrl = "https://api.mangadex.org/";
const MangaClickable = (props: Props) => {
	const navigate = useNavigate();
	const [coverFile, setCoverFile] = useState("");
	//const [showDetails, setShowDetails] = useState(false);

	const { id, title, coverId, updatedAt, rank, coverUrl, author } = props;

	function handleClick() {
		navigate("/individualView", {
			state:
				coverUrl === undefined
					? { id: id, coverFile: coverFile }
					: { title: title, author: author },
		});
	}

	useEffect(() => {
		if (coverUrl === undefined) {
			fetch(`${baseUrl}/cover/${coverId}`)
				.then((response) => response.json())
				.then((data) => {
					setCoverFile(data.data["attributes"].fileName);
				});
		}
	}, [coverUrl, coverId]);

	return (
		<>
			<Button
				className='button'
				onClick={() => {
					handleClick();
				}}
			>
				<Card sx={{ width: "100px", height: "150px", position: "relative" }}>
					<CardMedia
						sx={{
							width: "100%",
							height: "100%",
						}}
						image={
							coverUrl === undefined
								? "https://uploads.mangadex.org/covers/" + id + "/" + coverFile
								: coverUrl
						}
					/>
				</Card>

				<div className='overlay'>
					<Typography
						textTransform='none'
						color='white'
						noWrap
						sx={{
							fontSize: 10,
							maxWidth: "100px",
							overflow: "hidden",
							top: 0,
						}}
					>
						{title}
					</Typography>
					<Typography
						color='white'
						sx={{
							fontSize: 10,
						}}
					>
						{updatedAt === undefined
							? null
							: dayjs(updatedAt).format("DD/MM/YYYY / HH:MM")}
					</Typography>
					{rank === undefined ? null : (
						<Typography
							textTransform='none'
							color='white'
							sx={{
								fontSize: 10,
							}}
						>
							Rank: {rank}
						</Typography>
					)}
				</div>
			</Button>
		</>
	);
};

export default MangaClickable;
