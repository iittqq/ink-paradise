import React from "react";
import MangaClickable from "../Components/MangaClickable";
import { Container, Grid } from "@mui/material";

type Props = {
	manga: {
		name: string;
		updatedDate: string;
		latestChapter: string;
		cover: string;
		destination: string;
	}[];
};

const Upcoming = (props: Props) => {
	const { manga } = props;
	return (
		<Container>
			<Grid
				container
				direction='row'
				justifyContent='space-between'
				alignItems='center'
			>
				{manga.map((current) => (
					<Grid item>
						<MangaClickable manga={current} />
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default Upcoming;
