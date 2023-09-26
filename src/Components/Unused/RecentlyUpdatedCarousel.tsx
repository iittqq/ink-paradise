import { useState, useEffect } from "react";
import axios from "axios";
import Carousel, { CarouselItem } from "./Carousel";
import MangaClickable from "../MangaClickable";

const baseUrl = "https://api.mangadex.org/";

const RecentlyUpdatedCarousel = () => {
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
		<div>
			<Carousel>
				{mangaDetails.map((element, index) => (
					<CarouselItem width={""}>
						<MangaClickable
							id={element["id"]}
							title={element["attributes"].title["en"]}
							//description={element["attributes"].description["en"]}
							//updatedAt={element["attributes"].updatedAt}
							//tags={element["attributes"].tags}
							coverId={
								element["relationships"].find(
									(i: any) => i.type === "cover_art"
								).id
							}
							updatedAt='deez'
						/>
					</CarouselItem>
				))}
			</Carousel>
		</div>
	);
};

export default RecentlyUpdatedCarousel;
