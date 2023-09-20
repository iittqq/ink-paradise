import { useState, useEffect, useRef } from "react";
import { RecentlyUpdated } from "../APIs/MangaDexAPI";
import axios from "axios";
import Carousel, { CarouselItem } from "./Carousel";
import MangaClickable from "./MangaClickable";
import { Container, Grid } from "@mui/material";
import dayjs from "dayjs";

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
		<div style={{ alignSelf: "center" }} ref={scrollRef}>
			<Grid
				container
				direction='column'
				justifyContent='flex-start'
				alignItems='center'
				wrap='nowrap'
				spacing={1}
				sx={{ overflow: "auto", height: "80vh" }}
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

export default RecentlyUpdatedList;
