import { useState, useEffect } from "react";
import { RecentlyAddedAPI } from "../APIs/MangaDexAPI";
import axios from "axios";
import MangaClickable from "./MangaClickable";
import { Grid } from "@mui/material";
import dayjs from "dayjs";

const RecentlyAddedList = () => {
	const [mangaDetails, setMangaDetails] = useState<any[]>([]);

	const fetchRecentlyAddedManga = async () => {
		const { data } = await axios.get(RecentlyAddedAPI());
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
