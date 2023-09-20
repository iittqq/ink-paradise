import React, { useEffect, useState } from "react";
import { CoverById } from "../APIs/MangaDexAPI";
import axios from "axios";
import { Card, CardMedia, Button, Typography, Grid } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useNavigate } from "react-router-dom";

type Props = {
	id: string;
	title: string;
	coverId: string;
	updatedAt: string;
};

dayjs.extend(utc);

const MangaClickable = (props: Props) => {
	let navigate = useNavigate();
	const [coverFile, setCoverFile] = useState("");
	//const [showDetails, setShowDetails] = useState(false);

	const { id, title, coverId, updatedAt } = props;

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
		<div style={{ width: "300px", display: "flex", justifyContent: "center" }}>
			<Button
				sx={{
					backgroundColor: "#222222",
					"&.MuiButtonBase-root:hover": {
						bgcolor: "transparent",
					},
					width: "90%",
					height: "120px",
				}}
				onClick={() => {
					handleClick();
				}}
				//onMouseEnter={() => setShowDetails(true)}
				//onMouseLeave={() => setShowDetails(false)}
			>
				<Grid
					sx={{
						color: "white",
						height: "100%",
						width: "100%",
					}}
					container
					direction='row'
					justifyContent='space-between'
					alignItems='center'
				>
					<Grid item sx={{ width: "30%", minHeight: "100%" }}>
						<Card sx={{ width: "80px", height: "108px", overflow: "contain" }}>
							<CardMedia
								sx={{ width: "100%", height: "100%" }}
								image={
									"https://uploads.mangadex.org/covers/" + id + "/" + coverFile
								}
							/>
						</Card>
					</Grid>
					<Grid
						item
						sx={{
							width: { xs: "60%", md: "60%", lg: "60%" },
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "flex-start",
								alignItems: "flex-start",
							}}
						>
							<Typography
								sx={{
									display: "-webkit-box",
									overflow: "hidden",
									textAlign: "left",
									WebkitBoxOrient: "vertical",
									WebkitLineClamp: 2.5,
									fontSize: { xs: 10, sm: 10, lg: 10 },
									paddingBottom: "20px",
									paddingTop: "10px",
								}}
							>
								{title}
							</Typography>

							<Typography
								sx={{
									fontSize: { xs: 10, sm: 10, lg: 10 },
								}}
							>
								{updatedAt}
							</Typography>
						</div>
					</Grid>
				</Grid>
			</Button>
		</div>
	);
};

export default MangaClickable;
