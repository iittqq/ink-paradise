import { useState, useEffect } from "react";
import { Container, Grid, Typography, Button } from "@mui/material";
import Header from "../Components/Header";
import { RecentlyUpdated } from "../APIs/MangaDexAPI";
import axios from "axios";
import RecentlyUpdatedCarousel from "../Components/RecentlyUpdatedCarousel";
import RecentlyUpdatedList from "../Components/RecentlyUpdatedList";
import RecentlyAddedList from "../Components/RecentlyAddedList";
import { useNavigate } from "react-router-dom";

const noFilter = ["safe", "suggestive", "erotica", "pornographic"];
const baseUrl = "https://api.mangadex.org";

const Home = () => {
	let navigate = useNavigate();
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

				<Grid
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
						justifyContent='center'
						alignItems='center'
					>
						<Grid item sx={{ textAlign: "center", color: "white" }}>
							<Typography>Recently Updated</Typography>
							<RecentlyUpdatedList />
						</Grid>
						<Grid item sx={{ textAlign: "center", color: "white" }}>
						<Button 
						variant="text"  
						sx={{color:'white', textTransform:'none'}}
						onClick={() => {
							navigate("/recentlyAdded");}}
						>
							Recently Added</Button>
							<RecentlyAddedList />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Home;
