import React, { useEffect, useState } from "react";

import axios from "axios";
import {
	Card,
	CardMedia,
	Button,
	Typography,
	Grid,
	CardContent,
	Box,
	CardActionArea,
} from "@mui/material";
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
							<Box sx={{ position: "relative" }}>
								<CardMedia
									sx={{ width: "100px", height: "150px" }}
									image={
										"https://uploads.mangadex.org/covers/" +
										id +
										"/" +
										coverFile
									}
								/>
								<Box
									sx={{
										position: "absolute",
										bottom: "0px",
										left: 0,
										width: "80%",
										height: "130px",
										//bgcolor: "rgba(0, 0, 0, 0.54)",
										backgroundImage:
											"linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.05)) ",
										backgroundSize: "100px 150px",
										color: "white",
										padding: "10px",
									}}
								>
									<Typography
										textTransform='none'
										color='white'
										marginTop={14}
										//marginRight={0}
										//marginLeft={-1}
										sx={{
											fontSize: { xs: 10, sm: 10, lg: 10 },
											maxWidth: "100px",
											display: "-webkit-box",
											overflow: "hidden",
											WebkitBoxOrient: "vertical",
											WebkitLineClamp: homePage === true ? 1 : 2,
											position: "static",
										}}
									>
										{title}
									</Typography>
								</Box>
							</Box>
						</Card>
					</Grid>
				</Grid>
			</Button>
		</div>
	);
};

export default CoverClickable;
