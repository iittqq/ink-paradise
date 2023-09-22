import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardMedia, Button, Typography, Grid } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useNavigate } from "react-router-dom";

type Props = {
	id: string;
	title: string;
	coverUrl: string;
	rank: string;
};

dayjs.extend(utc);

const MangaClickableUniversalImage = (props: Props) => {
	let navigate = useNavigate();

	const { id, title, coverUrl, rank } = props;

	function handleClick() {}

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
							<CardMedia
								sx={{ width: "100%", height: "100%" }}
								image={coverUrl}
							/>
						</Card>
					</Grid>
					<Grid item>
						<Typography
							color='white'
							noWrap
							sx={{
								fontSize: { xs: 10, sm: 10, lg: 10 },
								maxWidth: "100px",
							}}
						>
							{title}
						</Typography>
						<Typography
							color='white'
							sx={{
								fontSize: { xs: 10, sm: 10, lg: 10 },
							}}
						>
							Rank: {rank}
						</Typography>
					</Grid>
				</Grid>
			</Button>
		</div>
	);
};

export default MangaClickableUniversalImage;
