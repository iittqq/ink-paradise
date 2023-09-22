import { useState, useEffect } from "react";
import axios from "axios";
import MangaClickable from "./MangaClickable";
import { Grid } from "@mui/material";
import dayjs from "dayjs";

const baseUrl = "https://api.mangadex.org/";

const RecentlyAddedList = () => {
	const [mangaDetails, setMangaDetails] = useState<any[]>([]);

	const fetchRecentlyAddedManga = async () => {
		const { data } = await axios.get(`${baseUrl}/manga`, {
			params: {
				limit: 10,
				contentRating: ["safe", "suggestive", "erotica"],
				order: {
					createdAt: "desc",
				},
			},
		});
		setMangaDetails(data.data);

		console.log(data.data);
	};

	useEffect(() => {
		fetchRecentlyAddedManga();
	}, []);

	return (
		<div style={{}}>
			<Grid
				container
				direction='row'
				justifyContent='center'
				alignItems='center'
				sx={{ height: "580px", overflow: "clip" }}
			>
				{mangaDetails.map((element, index) => (
					<Grid item>
						<MangaClickable
							id={element["id"]}
							title={element["attributes"].title["en"]}
							coverId={
								element["relationships"].find(
									(i: any) => i.type === "cover_art"
								).id
							}
							updatedAt={element["attributes"].createdAt}
						/>
					</Grid>
				))}
			</Grid>
		</div>
	);
};

export default RecentlyAddedList;
