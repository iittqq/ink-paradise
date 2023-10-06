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
import { useLocation } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type Props = {
	title: string;
};

const ListOfMangaPage = (props: Props) => {
	const { state } = useLocation();
	const { title } = props;

	console.log(state);
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
					{state.mangaData.map((element: any) => (
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
				<div>
					<Button
						sx={{
							color: "#333333",
							"&.MuiButtonBase-root:hover": {
								bgcolor: "transparent",
							},
							".MuiTouchRipple-child": {
								backgroundColor: "white",
							},
						}}
						onClick={() => {}}
					>
						<ArrowBackIosNewIcon />
					</Button>
					<Button
						sx={{
							color: "#333333",
							"&.MuiButtonBase-root:hover": {
								bgcolor: "transparent",
							},
							".MuiTouchRipple-child": {
								backgroundColor: "white",
							},
						}}
						onClick={() => {}}
					>
						<ArrowForwardIosIcon />
					</Button>
				</div>
			</Grid>
		</Container>
	);
};

export default ListOfMangaPage;
