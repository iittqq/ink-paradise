import React, { useState } from "react";
import { Container, Grid, Typography, Button } from "@mui/material";
import MangaClickableUniversalImage from "./MangaClickableUniversalImage";
import dayjs from "dayjs";

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
			>
				{mangaData.map((element: any) => (
					<Grid item>
						<MangaClickableUniversalImage
							id={element["mal_id"]}
							title={element["title"]}
							coverUrl={element["images"]["jpg"]["image_url"]}
						/>
					</Grid>
				))}
			</Grid>
		</div>
	);
};
export default TrendingHomePage;
