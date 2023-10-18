import "./App.css";
import { Container } from "@mui/material";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import IndividualManga from "./Pages/IndividualManga";
import RecentlyAdded from "./Pages/RecentlyAdded";
import SearchResults from "./Pages/SearchResults";
import ListOfMangaPage from "./Pages/ListOfMangaPage";
import Reader from "./Pages/Reader";
import MangaCoverList from "./Pages/MangaCoverList";

//#121212

function App() {
	return (
		<Container
			disableGutters
			sx={{
				backgroundColor: "#121212",
				minWidth: "100%",
				minHeight: "100vh",
				overflow: "hidden",
			}}
		>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/individualView' element={<IndividualManga />}></Route>
					<Route 
						path='/mangaCoverList' 
						element={<MangaCoverList />}
					></Route>
					<Route path='/results' element={<SearchResults />}></Route>
					<Route
						path='/mangaList'
						element={<ListOfMangaPage title='Recently Updated' />}
					></Route>
					<Route path='/reader' element={<Reader />}></Route>
				</Routes>
			</BrowserRouter>
		</Container>
	);
}

export default App;
