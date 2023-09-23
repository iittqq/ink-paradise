import { Grid } from "@mui/material";
import MangaClickableUniversalImage from "./MangaClickableUniversalImage";

type Props = {
	mangaData: any;
};
const TrendingHomePage = (props: Props) => {
	const { mangaData } = props;

	return (
		<div>
			<Grid
				container
				direction='row'
				justifyContent='center'
				alignItems='center'
				sx={{ height: "580px", overflow: "clip" }}
			>
				{mangaData.map((element: any) => (
					<Grid item>
						<MangaClickableUniversalImage
							id={element["mal_id"]}
							title={element["title"]}
							coverUrl={element["images"]["jpg"]["image_url"]}
							rank={element["rank"]}
						/>
					</Grid>
				))}
			</Grid>
		</div>
	);
};
export default TrendingHomePage;
