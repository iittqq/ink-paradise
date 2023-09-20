import { useState, useEffect } from "react";
import { RecentlyAdded } from "../APIs/MangaDexAPI";
import axios from "axios";
import MangaClickable from "./MangaClickable";
import { Grid } from "@mui/material";
import dayjs from "dayjs";

const RecentlyAddedList = () => {
	const [mangaDetails, setMangaDetails] = useState<any[]>([]);

	const fetchRecentlyAddedManga = async () => {
		const { data } = await axios.get(RecentlyAdded());
		setMangaDetails(data.data);

		console.log(data.data);
	};

	useEffect(() => {
		fetchRecentlyAddedManga();
	}, []);

	return (
		<div style={{ alignSelf: "center" }}>
			<Grid
				container
				direction='column'
				justifyContent='flex-start'
				alignItems='center'
				wrap='nowrap'
				spacing={1}
				sx={{ overflow: "auto", height: "80vh", scrollbarWidth: "none" }}
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
							updatedAt={dayjs(element["attributes"].updatedAt).format(
								"DD/MM/YYYY / HH:mm"
							)}
						/>
					</Grid>
				))}
			</Grid>
		</div>
	);
};

export default RecentlyAddedList;
