import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Button } from "@mui/material";
import MangaClickable from "./MangaClickable";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

type Props = {
	mangaData: any;
};
const RecentlyUpdatedMangaSection = (props: Props) => {
	const { mangaData } = props;
	let navigate = useNavigate();
	console.log(mangaData);

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
						<MangaClickable
							id={element["id"]}
							title={element["attributes"]["title"]["en"]}
							coverId={
								element["relationships"].find(
									(i: any) => i.type === "cover_art"
								).id
							}
							updatedAt={element["attributes"].updatedAt}
						/>
					</Grid>
				))}
			</Grid>
		</div>
	);
};
export default RecentlyUpdatedMangaSection;
