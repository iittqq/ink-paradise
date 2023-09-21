import "./App.css";
import { Container, Toolbar, Typography, Divider, Button } from "@mui/material";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import IndividualManga from "./Pages/IndividualManga";
//#121212

function App() {
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
				</Routes>
			</BrowserRouter>
		</Container>
	);
}

export default App;
