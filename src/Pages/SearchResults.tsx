import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import MangaClickable from "../Components/MangaClickable";
import Header from "../Components/Header";
import axios from "axios";

const baseUrl = "https://api.mangadex.org/";
const SearchResults = () => {
	const { state } = useLocation();
	const [mangaData, setMangaData] = useState<any[]>([]);
	const [refreshData, setRefreshData] = useState(false);
	const fetchMangaByName = async () => {
		const { data } = await axios.get(`${baseUrl}/manga`, {
			params: {
				limit: 100,
				title: state.id,
				contentRating: ["safe", "suggestive", "erotica"],
				order: {
					relevance: "desc",
				},
			},
		});
		setMangaData(data.data);
		console.log(data.data);
	};
	useEffect(() => {
		fetchMangaByName();
	}, [state]);

	console.log(state);
	console.log(mangaData);
	return (
		<div>
			<Grid
				container
				direction='column'
				justifyContent='center'
				alignItems='center'
			>
				<Grid item sx={{ width: "100%" }}>
					<Header />
				</Grid>
				<Grid item>
					<Typography color='white' textTransform={"capitalize"}>
						{state.id}
					</Typography>
				</Grid>
				<Grid item sx={{ width: "95%" }}>
					<Grid
						container
						direction='row'
						justifyContent='center'
						alignItems='center'
					>
						{mangaData.map((element: any) => (
							<Grid item sx={{ height: "192px" }}>
								<MangaClickable
									id={element["id"]}
									title={element["attributes"].title["en"]}
									coverId={
										element["relationships"].find(
											(i: any) => i.type === "cover_art"
										).id
									}
								/>
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default SearchResults;
