import { useState, useEffect, useRef } from "react";
import { RecentlyUpdated } from "../APIs/MangaDexAPI";
import axios from "axios";
import Carousel, { CarouselItem } from "./Carousel";
import MangaClickable from "./MangaClickable";
import { Container, Grid } from "@mui/material";

const RecentlyUpdatedList = () => {
	const [mangaDetails, setMangaDetails] = useState<any[]>([]);

	const fetchRecentlyUpdatedManga = async () => {
		const { data } = await axios.get(RecentlyUpdated());
		setMangaDetails(data.data);

		console.log(data.data);
	};

	useEffect(() => {
		fetchRecentlyUpdatedManga();
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

export default RecentlyUpdatedList;
