/* eslint-disable no-mixed-spaces-and-tabs */
import { useState } from "react";
import { TextField, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./Header.css";
import { fetchMangaByTitle } from "../../api/MangaDexApi";
import { Manga } from "../../interfaces/MangaDexInterfaces";

const Header = () => {
	const navigate = useNavigate();
	const [searchInput, setSearchInput] = useState("");

	const handleClickHome = async () => {
		navigate("/");
	};
	const handleClick = async () =>
		searchInput === ""
			? null
			: fetchMangaByTitle(searchInput).then((data: Manga[]) => {
					navigate("/mangaCoverList", {
						state: { listType: "SearchResults", manga: data },
					});
			  });

	return (
		<div className='container-header'>
			<Button onClick={() => handleClickHome()}>
				<Typography textTransform='none' color='white'>
					Ink Paradise
				</Typography>
			</Button>
			<div className='search-section'>
				<TextField
					variant='outlined'
					focused
					size='small'
					className='input-field'
					onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
						if (e.key === "Enter") {
							handleClick();
						}
					}}
					onChange={(event) => {
						setSearchInput(event.target.value);
					}}
				/>

				<Button className='search-button' onClick={() => handleClick()}>
					<KeyboardArrowRightIcon />
				</Button>
			</div>
		</div>
	);
};

export default Header;
