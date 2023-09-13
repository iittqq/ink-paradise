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
	thumbnailImage: string;
	//id: string;
	//updatedDate: string;
	//volume: string;
};

dayjs.extend(utc);

const tempName = "Jujutsu Kaisen";
const MangaClickable = (props: Props) => {
	const [showDetails, setShowDetails] = useState(false);
	const { thumbnailImage } = props;
	/** 
	const [latestManga, setLatestManga] = useState<string[]>([]);

	useEffect(() => {
		getCovers();
	}, []);

	//https://uploads.mangadex.org/covers/:manga-id/:cover-filename
	const getCovers = () => {
		MangaDexAPI.getCoverArtList()
			.then((response) => {
				response.data.forEach((element: any) => {
					console.log(response);
					setLatestManga((latestManga) => [
						...latestManga,
						"https://uploads.mangadex.org/covers/" +
							element.relationships[0].id +
							"/" +
							element.attributes.fileName,
					]);
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};
*/
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
						<CardMedia sx={{ height: "100%" }} image={thumbnailImage} />
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
