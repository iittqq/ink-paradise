import React, { useEffect, useState } from "react";
import { CoverById } from "../APIs/MangaDexAPI";
import axios from "axios";

import {
	Card,
	Container,
	CardMedia,
	Button,
	Typography,
	Grid,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

type Props = {
	id: string;
	title: string;
	description: string;
	updatedAt: string;
	tags: { tagName: string[]; tagGroup: string[] };
	coverId: string;
};

dayjs.extend(utc);

const MangaClickable = (props: Props) => {
	const [coverFile, setCoverFile] = useState("");
	const [showDetails, setShowDetails] = useState(false);

	const { id, title, description, updatedAt, tags, coverId } = props;

	const fetchCoverFile = async (id: any) => {
		const { data } = await axios.get(CoverById(id));

		setCoverFile(data.data["attributes"].fileName);
	};

	useEffect(() => {
		fetchCoverFile(coverId);
	}, []);
	return (
		<Container
			sx={
				{
					//height: { xs: "200px", md: "100px", lg: "100px" },
					//width: { xs: "100px", md: "50px", lg: "50px" },
				}
			}
		>
			<Button
				sx={{
					color: "black",
					"&.MuiButtonBase-root:hover": {
						bgcolor: "transparent",
					},
				}}
				//onClick={pullClickedManga}
				//onMouseEnter={() => setShowDetails(true)}
				//onMouseLeave={() => setShowDetails(false)}
			>
				<div style={{ maxWidth: "200px" }}>
					<Card sx={{ height: "300px", width: "200px" }}>
						<CardMedia
							sx={{
								height: "100%",
								width: "100%",
							}}
							image={
								"https://uploads.mangadex.org/covers/" + id + "/" + coverFile
							}
						/>
					</Card>
					<div style={{ paddingTop: "5px" }}>
						<Typography
							fontSize={15}
							noWrap
							color='#EFEAD8'
							textTransform='none'
						>
							{title}
						</Typography>
					</div>
				</div>
			</Button>
		</Container>
	);
};

export default MangaClickable;
