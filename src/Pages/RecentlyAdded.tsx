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
import MangaClickable from "../Components/MangaClickable";
import dayjs from "dayjs";

const baseUrl = "https://api.mangadex.org";

const RecentlyAdded = () => {
	const [mangaDetails, setMangaDetails] = useState<any[]>([]);

	const fetchRecentlyAddedManga = async () => {
		const { data } = await axios.get(`${baseUrl}/manga`, {
			params: { order: "createdAt: desc" },
		});
		setMangaDetails(data.data);

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
				<Grid item sx={{ paddingTop: "1vh", width: "100%" }}>
					<Header />
				</Grid>
				<Grid item>
					<Typography
						sx={{ paddingTop: "25px", paddingBottom: "25px", color: "white" }}
					>
						Recently Added
					</Typography>
				</Grid>
				<Grid
					container
					direction='column'
					item
					sx={{
						width: "100%",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<Grid
						container
						direction='row'
						justifyContent='flex-start'
						alignItems='center'
						wrap='wrap'
						spacing={1}
						sx={{
							overflow: "auto",
							height: "80vh",
							scrollbarWidth: "none",
							justifyContent: "center",
						}}
					>
						{mangaDetails.map((element, index) => (
							<Grid item>
								<MangaClickable
									id={element["id"]}
									title={element["attributes"].title["en"]}
									coverId={
										element["relationships"].find(
											(i: any) => i.type === "cover_art"
										).id
									}
									updatedAt={dayjs(element["attributes"].updatedAt).format(
										"DD/MM/YYYY / HH:mm"
									)}
								/>
							</Grid>
						))}
					</Grid>
				</Grid>
				<ButtonGroup
					variant='text'
					aria-label='text button group'
					sx={{ color: "white" }}
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

export default RecentlyAdded;
