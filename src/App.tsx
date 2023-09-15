import "./App.css";
import { Container, Toolbar, Typography, Divider, Button } from "@mui/material";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
//#121212
function App() {
	return (
		<Container
			disableGutters
			sx={{ backgroundColor: "#121212", minWidth: "100%", minHeight: "100vh" }}
		>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Home />} />
				</Routes>
			</BrowserRouter>
		</Container>
	);
}

export default App;
