import { Button, Typography } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import Header from "../Components/Header";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ListIcon from "@mui/icons-material/List";
import Footer from "../Components/Footer";
//type Props = { malUserProfile: any };

let options = new Map<number, string>();

const Library = () => {
	const [category, setCategory] = useState("all");
	const [open, setOpen] = useState(false);

	useEffect(() => {}, []);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "center",
				minHeight: "100vh",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					color: "white",
					width: "98%",
				}}
			>
				<Typography padding={1} fontSize={20}>
					Library
				</Typography>
				<div>
					<Button sx={{ color: "white" }}>
						<SearchIcon />
					</Button>
					<Button sx={{ color: "white" }}>
						<FilterListIcon />
					</Button>
					<Button sx={{ color: "white" }}>
						<ListIcon />
					</Button>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-evenly",
					alignItems: "center",
					color: "white",
					width: "98%",
				}}
			></div>

			<Footer />
		</div>
	);
};

export default Library;
