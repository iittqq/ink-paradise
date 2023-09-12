import "./App.css";
import { Container, Toolbar, Typography, Divider, Button } from "@mui/material";
import { Route, Routes, HashRouter } from "react-router-dom";
import Home from "./Pages/Home";

function App() {
	return (
		<Container
			disableGutters
			sx={{ backgroundColor: "#121212", minWidth: "100%" }}
		>
			<HashRouter>
				<Routes>
					<Route path='/' element={<Home />} />
				</Routes>
			</HashRouter>
		</Container>
	);
}

export default App;
