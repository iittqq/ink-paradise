import { Box, Card, CardMedia, Grid, Typography } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const baseUrlMangaDex = "https://api.mangadex.org";
const baseUrlMal = "https://api.jikan.moe/v4";

const Account = () => {
	const { state } = useLocation();
	const [favorites, setFavorites] = useState<any[]>([]);
	const [updates, setUpdates] = useState<any[]>([]);
	const getFavoritesList = async () => {
		fetch(`${baseUrlMal}/users/${state.account["username"]}/favorites`)
			.then((response) => response.json())
			.then((favorites) => {
				console.log(favorites.data);
				setFavorites(favorites.data);
			});
	};
	const getUpdatesList = async () => {
		fetch(`${baseUrlMal}/users/${state.account["username"]}/userupdates`)
			.then((response) => response.json())
			.then((updates) => {
				console.log(updates.data["manga"]);
				setUpdates(updates.data["manga"]);
			});
	};
	useEffect(() => {
		console.log(state.account["username"]);
		getFavoritesList();
		getUpdatesList();
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
			<Grid
				container
				direction='row'
				justifyContent='center'
				alignItems='center'
			>
				<Grid item>
					{updates.map((current) => (
						<Box sx={{ position: "absolute" }}>
							<Card>
								<CardMedia
									sx={{
										width: "100px",
										height: "150px",
										borderRadius: "6%",
									}}
									image={current["entry"]["images"]["jpg"]["large_image_url"]}
								/>
							</Card>
							<Box
								sx={{
									position: "absolute",
									bottom: "-1px",
									left: 0,
									width: "80%",
									height: "130px",
									backgroundImage:
										"linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.05)) ",
									borderRadius: "4%",
									backgroundSize: "100px 150px",
									color: "white",
									padding: "10px",
								}}
							>
								<Typography
									color='white'
									marginTop={14}
									marginRight={0}
									marginLeft={0}
									textTransform='none'
									align='center'
									sx={{
										fontSize: { xs: 10, sm: 10, lg: 10 },
										maxWidth: "100px",
										display: "-webkit-box",
										overflow: "hidden",
										WebkitBoxOrient: "vertical",
										WebkitLineClamp: 2,
										position: "static",
										alignContent: "flex-end",
									}}
								>
									{current["entry"]["title"]}
								</Typography>
							</Box>
						</Box>
					))}
				</Grid>
			</Grid>
		</div>
	);
};

export default Account;
