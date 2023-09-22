import { useState, useEffect } from "react";
import axios from "axios";
import MangaClickable from "./MangaClickable";
import { Container, Grid } from "@mui/material";
import dayjs from "dayjs";

const baseUrl = "https://api.mangadex.org/";

const RecentlyUpdatedList = () => {
	const [mangaDetails, setMangaDetails] = useState<any[]>([]);

	const fetchRecentlyUpdatedManga = async () => {
		const { data } = await axios.get(`${baseUrl}/manga`, {
			params: {
				limit: 10,
				contentRating: ["safe", "suggestive", "erotica"],
				order: {
					latestUploadedChapter: "desc",
				},
			},
		});
		setMangaDetails(data.data);

		console.log(data.data);
	};

	useEffect(() => {
		fetchRecentlyUpdatedManga();
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

export default RecentlyUpdatedList;
