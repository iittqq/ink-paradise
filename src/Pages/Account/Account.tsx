import { Button, Typography } from "@mui/material";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";

import {
	MalFavorites,
	UserMangaLogistics,
	MalUpdates,
	MangaStatus,
} from "../../interfaces/MalInterfaces";

import "./Account.css";

import MangaClickable from "../../Components/MangaClickable/MangaClickable";

const Account = () => {
	const { state } = useLocation();
	const [favorites, setFavorites] = useState<MalFavorites[]>([]);
	const [updates, setUpdates] = useState<MalUpdates[]>([]);
	const [userMangaData, setUserMangaData] = useState<UserMangaLogistics[]>([]);
	const [category, setCategory] = useState("All");
	const [mangaStatus, setMangaStatus] = useState<string[]>([]);

	useEffect(() => {
		setUpdates(state.account["updates"]["manga"]);

		setFavorites(state.account["favorites"]["manga"]);
		setUserMangaData(
			Object.keys(state.account["statistics"]["manga"]).map((key) => [
				key,
				state.account["statistics"]["manga"][key],
			]),
		);
		setMangaStatus(
			state.account["updates"]["manga"].map(
				(current: MangaStatus) => current.status,
			),
		);
	}, [state.account]);
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
					{userMangaData.map((current: UserMangaLogistics) => (
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
				{mangaStatus.map((current: string) => (
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
				{updates.map((current: MalUpdates) =>
					current.status === category || category === "All" ? (
						<>
							<MangaClickable
								title={current.entry.title}
								coverUrl={current.entry.images.jpg.large_image_url}
							/>
						</>
					) : null,
				)}
			</div>

			<Typography color='white' align='center' className='category-text'>
				Favorites
			</Typography>
			<div className='centered-content'>
				{favorites.map((current: MalFavorites) => (
					<>
						<MangaClickable
							coverUrl={current.images.jpg.large_image_url}
							title={current.title}
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
