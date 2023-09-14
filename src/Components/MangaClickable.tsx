import React, { useEffect, useState, useRef, useCallback } from "react";
import { MangaDexAPI } from "../APIs/MangaDexAPI";
import {
	Card,
	Container,
	CardContent,
	CardMedia,
	Button,
	Typography,
	Box,
	Grid,
} from "@mui/material";
import mangaCover from "../Assets/cover.jpg";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

type Props = {
	ids: string[];
};

dayjs.extend(utc);

const MangaClickable = (props: Props) => {
	const [showDetails, setShowDetails] = useState(false);
	const [latestMangaCoversUrl, setLatestMangaCoversUrl] = useState<string[]>(
		[]
	);
	const [mangaName, setMangaName] = useState<string[]>([]);
	const { ids } = props;

	useEffect(() => {
		console.log(ids);
		ids.forEach((current) => {
			setMangaName((mangaName) => [...mangaName, current]);
		});

		getMangaCovers(mangaName);
		getMangaCovers(mangaName);
	}, []);
	/** 
	const getCoverFromId = (manga: any) => {
		console.log(manga);
		MangaDexAPI.getNewMangaCovers(manga).then((response) => {
			buildCoverUrls(response);
			console.log(response);
		});
	};
*/
	const getMangaCovers = (manga: any) => {
		console.log(manga);
		MangaDexAPI.getNewMangaCovers(manga).then((response) => {
			console.log(response);
		});
	};

	const buildCoverUrls = (manga: any) => {
		console.log(manga);
		manga.data.forEach((element: any) => {
			console.log(element);
			console.log(element.relationships[0].id);
			setLatestMangaCoversUrl((latestMangaCoversUrl) => [
				...latestMangaCoversUrl,
				"https://uploads.mangadex.org/covers/" +
					element.relationships[0].id +
					"/" +
					element.attributes.fileName,
			]);
		});
	};
	console.log(mangaName);
	console.log(latestMangaCoversUrl);
	return (
		<Container>
			<Button
				sx={{
					color: "black",
					"&.MuiButtonBase-root:hover": {
						bgcolor: "transparent",
					},
				}}
				//onClick={pullClickedManga}
				onMouseEnter={() => setShowDetails(true)}
				onMouseLeave={() => setShowDetails(false)}
			>
				<div style={{ maxWidth: "220px" }}>
					<Card
						sx={{
							height: "300px",
							width: "200px",
						}}
					>
						<CardMedia sx={{ height: "100%" }} image={mangaCover} />
						{showDetails && (
							<Grid
								container
								direction='row'
								justifyContent='space-between'
								alignItems='center'
								sx={{ marginTop: "-20px" }}
							>
								<Grid item>
									<Card
										sx={{
											backgroundColor: "#000000",
											opacity: 0.8,
											height: "50px",
											width: "80px",
											borderRadius: 1,
										}}
									>
										<Typography fontSize={13} color='white'>
											12
										</Typography>
									</Card>
								</Grid>

								<Grid item>
									<Card
										sx={{
											backgroundColor: "#000000",
											height: "50px",
											opacity: 0.8,
											width: "80px",
											borderRadius: 1,
										}}
									>
										<Typography
											fontSize={13}
											color='white'
											textTransform='none'
										>
											12
										</Typography>
									</Card>
								</Grid>
							</Grid>
						)}
					</Card>
					<div style={{ paddingTop: "5px" }}>
						<Typography
							fontSize={15}
							noWrap
							color='#EFEAD8'
							textTransform='none'
						>
							12
						</Typography>
					</div>
				</div>
			</Button>
		</Container>
	);
};

export default MangaClickable;
