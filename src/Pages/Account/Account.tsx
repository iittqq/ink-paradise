import { Button, Card, CardMedia, Grid, Typography } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer";
import { STATIC_EXECUTION_CONTEXT } from "styled-components/dist/constants";
import "./Account.css";

import MangaCoverTitle from "../../Components/MangaCoverTitle";

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
			state.account["updates"]["manga"].map((current: any) => current.status)
		);
	}, []);
	return (
		<div>
			<div className='user-details-section'>
				<img
					className='user-image'
					src={state.account["images"]["jpg"]["image_url"]}
					alt='profile'
				></img>

				<Typography color='white' className='user-details'>
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
						flexWrap: "wrap",
					}}
				>
					{userMangaData.map((current) => (
						<Typography color='white' sx={{ padding: "8px" }}>
							{current[0]}: {current[1]} <br />
						</Typography>
					))}
				</div>
			</div>
			<Typography color='white' align='center' className='category-text'>
				Updated
			</Typography>
			<div className='category-buttons-container'>
				<Button
					className='category-button'
					onClick={() => {
						setCategory("All");
					}}
				>
					All
				</Button>
				{mangaStatus.map((current) => (
					<Button
						className='category-button'
						onClick={() => {
							setCategory(current);
						}}
					>
						{current}
					</Button>
				))}
			</div>

			<div className='centered-content'>
				{updates.map((current) =>
					current["status"] === category || category === "All" ? (
						<>
							<MangaCoverTitle
								image={current["entry"]["images"]["jpg"]["large_image_url"]}
								title={current["entry"]["title"]}
							/>
						</>
					) : null
				)}
			</div>

			<Typography color='white' align='center' className='category-text'>
				Favorites
			</Typography>
			<div className='centered-content'>
				{favorites.map((current) => (
					<>
						<MangaCoverTitle
							image={current["images"]["jpg"]["large_image_url"]}
							title={current["title"]}
						/>
					</>
				))}
			</div>
			<div className='footer'>
				<Footer />
			</div>
		</div>
	);
};

export default Account;
