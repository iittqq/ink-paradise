import React, { useEffect, useState } from "react";

import axios from "axios";
import { Card, CardMedia, Button, Typography, Grid, CardContent, Box, CardActionArea } from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

type Props = {
	id: string;
	title: string;
	coverId: string;
	updatedAt?: string;
	homePage?: boolean;
};

const baseUrl = "https://api.mangadex.org/";
const CoverClickable = (props: Props) => {
	let navigate = useNavigate();
	const [coverFile, setCoverFile] = useState("");
	//const [showDetails, setShowDetails] = useState(false);

	const { id, title, coverId, updatedAt, homePage } = props;

	const fetchCoverFile = async () => {
		const { data } = await axios.get(`${baseUrl}/cover/${coverId}`);
		setCoverFile(data.data["attributes"].fileName);
	};

	function handleClick() {
		navigate("/individualView", {
			state: { id: id, coverFile: coverFile },
		});
	}

	useEffect(() => {
		fetchCoverFile();
	}, [props]);

	return (
		<div
			style={{
				display: "flex",

				justifyContent: "center",
			}}
		>
			<Button
				sx={{
					//backgroundColor: "#222222",
					backgroundColor: "transparent",
					"&.MuiButtonBase-root:hover": {
						bgcolor: "transparent",
					},
					".MuiTouchRipple-child": {
						backgroundColor: "white",
					},
					width: "100%",
				}}
				onClick={() => {
					handleClick();
				}}
				//onMouseEnter={() => setShowDetails(true)}
				//onMouseLeave={() => setShowDetails(false)}
			>
				<Grid
					container
					direction='column'
					justifyContent='space-evenly'
					alignItems='center'
				>
					<Grid item>
						<Card sx={{ width: "100px", height: "150px" }}>
							<Typography
								color='white'
								sx={{
									fontSize: { xs: 10, sm: 10, lg: 10 },
									maxWidth: "100px",
									display: "-webkit-box",
									overflow: "hidden",
									WebkitBoxOrient: "vertical",
									WebkitLineClamp: homePage === true ? 1 : 2,
									position: "top",
								}}
							>
								{title}
							</Typography>
							<CardMedia
								sx={{ width: "100%", height: "100%", position: "relative"}}
								image={
									"https://uploads.mangadex.org/covers/" + id + "/" + coverFile
								}
							/>
							
						</Card>
					</Grid>
				</Grid>
			</Button>
		</div>
	);
};

export default CoverClickable;
