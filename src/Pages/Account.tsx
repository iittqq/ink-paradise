import { Box, Button, Card, CardMedia, Grid, Typography } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";

const baseUrlMangaDex = "https://api.mangadex.org";
const baseUrlMal = "https://api.jikan.moe/v4";

const Account = () => {
	const { state } = useLocation();
	const [favorites, setFavorites] = useState<any[]>([]);
	const [updates, setUpdates] = useState<any[]>([]);

	useEffect(() => {
		console.log(state.account);
		setUpdates(state.account["updates"]["manga"]);
		setFavorites(state.account["favorites"]["manga"]);
	}, []);
	return (
		<div
			style={{
				width: "100%",
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "center",
			}}
		>
			<div>
				<Typography color='white'>{state.account["username"]}</Typography>
			</div>
			<div style={{ width: "50%" }}>
				<Typography color='white' align='center'>
					Updated
				</Typography>
				<Grid
					container
					direction='row'
					justifyContent='space-evenly'
					alignItems='center'
				>
					{updates.map((current) => (
						<Button>
							<Grid item>
								<Card
									sx={{
										position: "relative",
									}}
								>
									<CardMedia
										sx={{
											width: "100px",
											height: "150px",
											borderRadius: "6%",
											filter: "brightness(40%)",
										}}
										image={current["entry"]["images"]["jpg"]["large_image_url"]}
									/>

									<Typography
										color='white'
										textTransform='none'
										align='center'
										noWrap
										sx={{
											position: "absolute",
											bottom: "10px",
											width: "100%",
										}}
									>
										{current["entry"]["title"]}
									</Typography>
								</Card>
							</Grid>
						</Button>
					))}
				</Grid>
			</div>
			<div style={{ width: "50%" }}>
				<Typography color='white' align='center'>
					Favorites
				</Typography>
				<Grid
					container
					direction='row'
					justifyContent='space-evenly'
					alignItems='center'
				>
					{favorites.map((current) => (
						<Button>
							<Grid item>
								<Card
									sx={{
										position: "relative",
									}}
								>
									<CardMedia
										sx={{
											width: "100px",
											height: "150px",
											borderRadius: "6%",
											filter: "brightness(40%)",
										}}
										image={current["images"]["jpg"]["large_image_url"]}
									/>

									<Typography
										color='white'
										textTransform='none'
										align='center'
										noWrap
										sx={{
											position: "absolute",
											bottom: "10px",
											width: "100%",
										}}
									>
										{current["title"]}
									</Typography>
								</Card>
							</Grid>
						</Button>
					))}
				</Grid>
			</div>
			<Footer />
		</div>
	);
};

export default Account;
