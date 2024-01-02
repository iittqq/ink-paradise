import { Button, Typography } from "@mui/material";
import { useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ListIcon from "@mui/icons-material/List";
import Footer from "../../Components/Footer/Footer";
import "./Library.css";
//type Props = { malUserProfile: any };

const Library = () => {
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
