import {
	Box,
	Button,
	Card,
	CardMedia,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import { STATIC_EXECUTION_CONTEXT } from "styled-components/dist/constants";

const baseUrlMangaDex = "https://api.mangadex.org";
const baseUrlMal = "https://api.jikan.moe/v4";

const Account = () => {
	const { state } = useLocation();
	const [favorites, setFavorites] = useState<any[]>([]);
	const [updates, setUpdates] = useState<any[]>([]);
	const [userMangaData, setUserMangaData] = useState<any[]>([]);
	const [category, setCategory] = useState("All");
	const [mangaStatus, setMangaStatus] = useState<any[]>([]);

	useEffect(() => {
		console.log(state.account);
		setUpdates(state.account["updates"]["manga"]);

		setFavorites(state.account["favorites"]["manga"]);
		setUserMangaData(state.account["statistics"]["manga"]);
		setUserMangaData(
			Object.keys(state.account["statistics"]["manga"]).map((key) => [
				key,
				state.account["statistics"]["manga"][key],
			])
		);
		setMangaStatus(
			state.account["updates"]["manga"].map((current: any) => [
				...mangaStatus,
				current["status"].split(" ")[0],
			])
		);
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
			<div
				style={{
					alignSelf: "flex-start",
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-evenly",
					alignItems: "flex-start",
				}}
			>
				<Card>
					<CardMedia
						sx={{ width: "250px", height: "250px" }}
						image={state.account["images"]["jpg"]["image_url"]}
					/>
				</Card>
				<Typography
					color='white'
					sx={{
						paddingLeft: "20px",
						maxWidth: "300px",

						height: "250px",
					}}
				>
					{state.account["username"]} <br /> <br />
					About:&nbsp;
					{state.account["about"]}
					<br />
					Gender:&nbsp;
					{state.account["gender"]}
					<br />
					Birthday:&nbsp;
					{state.account["birthday"]}
					<br />
				</Typography>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						flexWrap: "wrap",
						width: "600px",
						height: "150px",
						padding: "10px",
					}}
				>
					{userMangaData.map((current) => (
						<Typography color='white' sx={{ padding: "8px" }}>
							{current[0]}: {current[1]} <br />
						</Typography>
					))}
				</div>
			</div>
			<Typography color='white' align='center'>
				Updated
			</Typography>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-evenly",
					alignItems: "center",
					width: "50%",
				}}
			>
				<Button
					sx={{
						color: "white",
						"&.MuiButtonBase-root:hover": {
							bgcolor: "transparent",
						},
						".MuiTouchRipple-child": {
							backgroundColor: "white",
						},
						textTransform: "none",
					}}
					onClick={() => {
						setCategory("All");
					}}
				>
					All
				</Button>
				{mangaStatus.map((current) => (
					<Button
						sx={{
							color: "white",
							"&.MuiButtonBase-root:hover": {
								bgcolor: "transparent",
							},
							".MuiTouchRipple-child": {
								backgroundColor: "white",
							},
							textTransform: "none",
						}}
						onClick={() => {
							setCategory(current[0]);
						}}
					>
						{current}
					</Button>
				))}
			</div>
			<div
				style={{
					width: "50%",
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<Grid
					container
					direction='row'
					justifyContent='space-evenly'
					alignItems='center'
				>
					{updates.map((current) =>
						current["status"].split(" ")[0] === category ||
						category === "All" ? (
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
											image={
												current["entry"]["images"]["jpg"]["large_image_url"]
											}
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
						) : null
					)}
				</Grid>
			</div>
			<Typography color='white' align='center'>
				Favorites
			</Typography>
			<div
				style={{
					width: "50%",
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
				}}
			>
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
