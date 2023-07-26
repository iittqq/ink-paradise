import "./App.css";
import { Container, Toolbar, Typography, Divider, Button } from "@mui/material";
import { Route, Routes, HashRouter } from "react-router-dom";
import Home from "./Pages/Home";

function App() {
	return (
		<Container
			disableGutters
			sx={{ minWidth: "100%", backgroundColor: "#181716" }}
		>
			<Toolbar sx={{ justifyContent: "space-between" }}>
				<div>
					<Typography color='white'>Ink Paradise</Typography>
					<Typography color='white'>Hello Degenerate</Typography>
				</div>
				<Button>Recent Updates</Button>
				<Button>Recent Updates</Button>
				<Button>Recent Updates</Button>
			</Toolbar>
			<Divider sx={{ height: 3, bgcolor: "#8A6240" }} />
			<HashRouter>
				<Routes>
					<Route path='/' element={<Home />} />
				</Routes>
			</HashRouter>
		</Container>
	);
}

export default App;
