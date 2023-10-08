import { Grid } from "@mui/material";
import MangaClickable from "./MangaClickable";

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
						<MangaClickable
							id={element["mal_id"]}
							title={element["title"]}
							coverUrl={element["images"]["jpg"]["image_url"]}
							rank={element["rank"]}
							homePage={true}
							author={element["authors"][0]["name"]}
						/>
					</Grid>
				))}
			</Grid>
		</div>
	);
};
export default TrendingHomePage;
