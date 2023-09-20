import { useState, useEffect } from "react";
import { RecentlyUpdated } from "../APIs/MangaDexAPI";
import axios from "axios";
import Carousel, { CarouselItem } from "./Carousel";
import MangaClickable from "./MangaClickable";

const RecentlyUpdatedCarousel = () => {
	const [mangaDetails, setMangaDetails] = useState<any[]>([]);

	const fetchRecentlyUpdatedManga = async () => {
		const { data } = await axios.get(RecentlyUpdated());
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
						{/** 
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
						/>*/}
					</CarouselItem>
				))}
			</Carousel>
		</div>
	);
};

export default RecentlyUpdatedCarousel;
