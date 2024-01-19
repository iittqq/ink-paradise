import { Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import Header from "../../Components/Header/Header";

import { UserMangaLogistics } from "../../interfaces/MalInterfaces";

import "./Account.css";

const Account = () => {
	const { state } = useLocation();

	const [userMangaData, setUserMangaData] = useState<UserMangaLogistics[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>("");

	const searchFolders = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			setSearchTerm(event.currentTarget.value);
			console.log(event.currentTarget.value);
		}
	};

	useEffect(() => {
		setUserMangaData(
			Object.keys(state.account.statistics.manga).map((key) => [
				key,
				state.account.statistics.manga[key],
			]),
		);
	}, [state.account]);
	return (
		<div className='user-page-container'>
			<Header />
			<div className='user-details-section'>
				<div className='image-details-section'>
					<img
						className='user-image'
						src={state.account.images.jpg.image_url}
						alt='profile'
					></img>

					<Typography color='white' className='user-details'>
						{state.account.username} <br /> <br />
						About:&nbsp;
						{state.account.about}
						<br />
						Gender:&nbsp;
						{state.account.gender}
						<br />
						Birthday:&nbsp;
						{state.account.birthday}
						<br />
					</Typography>
				</div>
				<div className='user-stats'>
					{userMangaData.map((current: UserMangaLogistics) => (
						<Typography color='white' sx={{ padding: "8px" }}>
							{current[0]}: {current[1]} <br />
						</Typography>
					))}
				</div>
			</div>
			<div className='folder-section-header'>
				<div>
					<input
						type='search'
						className='folder-search-bar'
						onKeyDown={searchFolders}
					/>
					<Button className='search-button'>
						<SearchIcon />
					</Button>
				</div>
				<Button className='add-folder-button'>
					<AddIcon />
				</Button>
			</div>
			<div className='personal-folders'>
				<Button className='folder'>
					<Typography>Folder</Typography>
				</Button>
			</div>
		</div>
	);
};

export default Account;
