import "./App.css";
import { Container, Toolbar, Typography, Divider, Button } from "@mui/material";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import IndividualManga from "./Pages/IndividualManga";
import RecentlyAdded from "./Pages/RecentlyAdded";
import SearchResults from "./Pages/SearchResults";
import ListOfMangaPage from "./Pages/ListOfMangaPage";
import axios from "axios";
import { useState, useEffect } from "react";

//#121212

const baseUrl = "https://api.mangadex.org";

function App() {
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
		<Container
			disableGutters
			sx={{
				backgroundColor: "#121212",
				minWidth: "100%",
				minHeight: "100vh",
				overflow: "scroll",
			}}
		>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/individualView' element={<IndividualManga />}></Route>
					<Route path='/recentlyAdded' element={<RecentlyAdded />}></Route>
					<Route path='/results' element={<SearchResults />}></Route>
					<Route
						path='/mangaList'
						element={
							<ListOfMangaPage
								title='Recently Updated'
								mangaData={recentlyUpdatedMangaDetails}
							/>
						}
					></Route>
				</Routes>
			</BrowserRouter>
		</Container>
	);
}

export default App;
