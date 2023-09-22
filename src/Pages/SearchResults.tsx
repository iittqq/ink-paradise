import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Grid } from "@mui/material";
import MangaClickable from "../Components/MangaClickable";
import dayjs from "dayjs";
import Header from "../Components/Header";
import axios from "axios";

const baseUrl = "https://api.mangadex.org/";
const SearchResults = () => {
	const { state } = useLocation();
	const [mangaData, setMangaData] = useState<any[]>([]);
	const fetchMangaByName = async () => {
		const { data } = await axios.get(`${baseUrl}/manga`, {
			params: {
				limit: 10,
				title: state.id,
				contentRating: ["safe", "suggestive", "erotica"],
				order: {
					createdAt: "desc",
				},
			},
		});
		setMangaData(data.data);
	};
	useEffect(() => {
		fetchMangaByName();
	}, []);

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
					<Grid
						container
						direction='row'
						justifyContent='center'
						alignItems='center'
					>
						{mangaData.map((element: any) => (
							<Grid item>
								<MangaClickable
									id={element["id"]}
									title={element["attributes"].title["en"]}
									coverId={
										element["relationships"].find(
											(i: any) => i.type === "cover_art"
										).id
									}
									updatedAt={element["attributes"].updatedAt}
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
