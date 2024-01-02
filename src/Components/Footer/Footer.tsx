import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import WhatsHotIcon from "@mui/icons-material/Whatshot";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
	const navigate = useNavigate();

	const handleClickHome = async () => {
		navigate("/");
	};
	const handleClickProfile = async () => {
		navigate("/login");
	};

	const handleClickLibrary = async () => {
		navigate("/library");
	};

	return (
		<div className='container'>
			<Button className='nav-buttons' onClick={() => handleClickHome()}>
				<HomeIcon />
			</Button>
			<Button className='nav-buttons' onClick={() => handleClickLibrary()}>
				<BookIcon />
			</Button>
			<Button className='nav-buttons'>
				<WhatsHotIcon />
			</Button>
			<Button className='nav-buttons' onClick={() => handleClickProfile()}>
				<AccountBoxIcon />
			</Button>
		</div>
	);
};

export default Footer;
