import { Grid } from "@mui/material";
import MangaClickable from "./MangaClickable";

type Props = {
	mangaData: any;
};
const RecentlyUpdatedMangaSection = (props: Props) => {
	const { mangaData } = props;

	return (
		<div>
			<Grid
				container
				direction='row'
				justifyContent='center'
				alignItems='center'
				sx={{
					height: "580px",
					overflow: "clip",
				}}
			>
				{mangaData.map((element: any) => (
					<Grid item>
						<MangaClickable
							id={element["id"]}
							title={element["attributes"]["title"]["en"]}
							coverId={
								element["relationships"].find(
									(i: any) => i.type === "cover_art"
								).id
							}
							updatedAt={element["attributes"].updatedAt}
							homePage={true}
						/>
					</Grid>
				))}
			</Grid>
		</div>
	);
};
export default RecentlyUpdatedMangaSection;
