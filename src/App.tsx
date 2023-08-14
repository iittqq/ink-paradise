import "./App.css";
import { Container, Toolbar, Typography, Divider, Button } from "@mui/material";
import { Route, Routes, HashRouter } from "react-router-dom";
import Home from "./Pages/Home";

function App() {
	return (
		<Container
			disableGutters
			sx={{ minWidth: "100%", backgroundColor: "#1A120B" }}
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
