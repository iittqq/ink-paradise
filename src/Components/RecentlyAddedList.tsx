import { useState, useEffect, useRef } from "react";
import { RecentlyAdded } from "../APIs/MangaDexAPI";
import axios from "axios";
import MangaClickable from "./MangaClickable";
import { Grid } from "@mui/material";

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

	const scrollRef = useRef(null);

	return (
		<div style={{ width: "90%", alignSelf: "center" }} ref={scrollRef}>
			<Grid
				container
				direction='row'
				justifyContent='flex-start'
				alignItems='center'
				wrap='nowrap'
				sx={{ overflow: "auto" }}
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
						/>
					</Grid>
				))}
			</Grid>
		</div>
	);
};

export default RecentlyAddedList;
