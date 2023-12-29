import { Button, Typography } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ListIcon from "@mui/icons-material/List";
import Footer from "../../Components/Footer";
import "./Library.css";
//type Props = { malUserProfile: any };

let options = new Map<number, string>();

const Library = () => {
	const [category, setCategory] = useState("all");
	const [open, setOpen] = useState(false);

	useEffect(() => {}, []);

	return (
		<div>
			<div className='library-header'>
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
			<div></div>
			<div className='footer'>
				<Footer />
			</div>
		</div>
	);
};

export default Library;
