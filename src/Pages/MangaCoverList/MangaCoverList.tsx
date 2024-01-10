/* eslint-disable no-mixed-spaces-and-tabs */
import { useState, useEffect } from "react";
import { Grid, Typography, Button } from "@mui/material";
import Header from "../../Components/Header/Header";
import MangaClickable from "../../Components/MangaClickable/MangaClickable";
import { useLocation } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./MangaCoverList.css";

import { Manga, Relationship } from "../../interfaces/MangaDexInterfaces";

const MangaCoverList = () => {
	const { state } = useLocation();
	const [offset, setOffset] = useState<number>(0);
	const [mangaDetails, setMangaDetails] = useState<Manga[]>([]);

	useEffect(() => {
		setMangaDetails(state.manga);
	}, [state]);
	return (
		<>
			<div className='header'>
				<Header />
			</div>
			<Typography className='title'>{state.listType}</Typography>
			<div>
				<Grid
					container
					direction='row'
					justifyContent='center'
					alignItems='center'
					wrap='wrap'
					spacing={1}
				>
					{mangaDetails.map((element: Manga) => (
						<Grid item>
							<MangaClickable
								id={element["id"]}
								title={element["attributes"].title["en"]}
								coverId={
									element["relationships"].find(
										(i: Relationship) => i.type === "cover_art",
									)?.id
								}
							/>
						</Grid>
					))}
				</Grid>
			</div>
			<div className='nav-buttons'>
				<Button
					className='nav-button-styling'
					onClick={() => (offset - 75 >= 0 ? setOffset(offset - 75) : null)}
				>
					<ArrowBackIosNewIcon />
				</Button>
				<Button
					className='nav-button-styling'
					onClick={() => {
						setOffset(offset + 75);
					}}
				>
					<ArrowForwardIosIcon />
				</Button>
			</div>
		</>
	);
};
export default MangaCoverList;
