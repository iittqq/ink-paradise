import "./App.css";
import { Container, Toolbar, Typography, Divider, Button } from "@mui/material";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import IndividualManga from "./Pages/IndividualManga";
import RecentlyAdded from "./Pages/RecentlyAdded";
//#121212

function App() {
	return (
		<Container
			disableGutters
			sx={{
				backgroundColor: "#121212",
				minWidth: "100%",
				minHeight: "100vh",
			}}
		>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/individualView' element={<IndividualManga />}></Route>
					<Route path='/recentlyAdded' element={<RecentlyAdded />}></Route>
				</Routes>
			</BrowserRouter>
		</Container>
	);
}

export default App;
