import { useState, useEffect } from "react";
import {
	Container,
	Grid,
	Typography,
	Button,
	ButtonGroup,
} from "@mui/material";
import Header from "../Components/Header";
import axios from "axios";
import CoverClickable from "../Components/CoverClickable";

type Props = {
	title: string;
};
const baseUrl = "https://api.mangadex.org";
const ListOfMangaPage = (props: Props) => {
	const { title } = props;
	const [recentlyUpdatedMangaDetails, setRecentlyUpdatedMangaDetails] =
		useState<Object[]>([]);

	const fetchRecentlyAddedManga = async () => {
		const { data } = await axios.get(`${baseUrl}/manga`, {
			params: {
				order: {
					latestUploadedChapter: "desc",
				},
				limit: 50,
				contentRating: ["safe", "suggestive", "erotica"],
			},
		});
		setRecentlyUpdatedMangaDetails(data.data);

		console.log(data.data);
	};

	useEffect(() => {
		fetchRecentlyAddedManga();
	}, []);
	return (
		<Container disableGutters sx={{ minWidth: "100%", minHeight: "100vh" }}>
			<Grid
				container
				direction='column'
				justifyContent='space-evenly'
				alignItems='center'
			>
				<Grid item sx={{ width: "100%" }}>
					<Header />
				</Grid>
				<Grid item>
					<Typography
						sx={{
							color: "white",
						}}
					>
						{title}
					</Typography>
				</Grid>
				<Grid
					container
					direction='row'
					justifyContent='center'
					alignItems='center'
					wrap='wrap'
					spacing={1}
					sx={{
						overflow: "scroll",
						height: { sm: "70vh", md: "85vh", lg: "82vh", xl: "82vh" },
						scrollbarWidth: "none",
						justifyContent: "center",
					}}
				>
					{recentlyUpdatedMangaDetails.map((element: any) => (
						<Grid item>
							<CoverClickable
								id={element["id"]}
								title={element["attributes"].title["en"]}
								coverId={
									element["relationships"].find(
										(i: any) => i.type === "cover_art"
									).id
								}
							/>
						</Grid>
					))}
				</Grid>

				<ButtonGroup
					variant='text'
					aria-label='text button group'
					sx={{ color: "white", paddingTop: "10px" }}
				>
					<Button sx={{ color: "white" }}>1</Button>
					<Button sx={{ color: "white" }}>2</Button>
					<Button sx={{ color: "white" }}>3</Button>
					<Button sx={{ color: "white" }}>...</Button>
					<Button sx={{ color: "white" }}>15</Button>
				</ButtonGroup>
			</Grid>
		</Container>
	);
};

export default ListOfMangaPage;
