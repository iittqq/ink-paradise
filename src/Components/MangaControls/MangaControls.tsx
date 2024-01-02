import { useState } from "react";
import {
	List,
	ListItemButton,
	ListItemText,
	Collapse,
	Grid,
	Typography,
	Button,
} from "@mui/material";
import {
	ExpandLess,
	ExpandMore,
	ArrowForwardIos,
	ArrowBackIosNew,
} from "@mui/icons-material";

import "./MangaControls.css";

type Props = {
	mangaLanguages: string[];
	currentOffset: number;
	currentOrder: string;
	selectedLanguage: string;
	setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
	setCurrentOffset: React.Dispatch<React.SetStateAction<number>>;
	setCurrentOrder: React.Dispatch<React.SetStateAction<string>>;
	mangaTranslators: object[];
	setTranslator: React.Dispatch<React.SetStateAction<object[]>>;
};

const MangaControls = (props: Props) => {
	const [open, setOpen] = useState(false);
	const [openTranslators, setOpenTranslators] = useState(false);
	const [uniqueTranslators, setUniqueTranslators] = useState<object[]>([]);
	const [doneSettingTranslators, setDoneSettingTranslators] = useState(false);

	const {
		mangaLanguages,
		currentOffset,
		currentOrder,
		setSelectedLanguage,
		setCurrentOffset,
		setCurrentOrder,
		mangaTranslators,
	} = props;
	const handleOpenTags = () => {
		setOpen(!open);
	};
	const handleOpenTranslators = () => {
		setOpenTranslators(!openTranslators);
	};

	const distinguishUniqueTranslators = () => {
		if (doneSettingTranslators === false) {
			const uniqueTranslatorsArray: object[] = [];

			for (const current of mangaTranslators) {
				if (!uniqueTranslatorsArray.includes(current)) {
					uniqueTranslatorsArray.push(current);
				}
			}
			console.log(uniqueTranslatorsArray);
			setUniqueTranslators(uniqueTranslatorsArray);
		}
		setDoneSettingTranslators(true);
	};

	return (
		<div>
			<List className='list-container'>
				<ListItemButton
					className='list-button'
					onClick={() => {
						handleOpenTranslators();
						distinguishUniqueTranslators();
					}}
				>
					<ListItemText sx={{ color: "#555555" }} primary='Translators' />
					{openTranslators ? (
						<ExpandLess sx={{ color: "#333333" }} />
					) : (
						<ExpandMore sx={{ color: "#333333" }} />
					)}
				</ListItemButton>
				<Collapse unmountOnExit in={openTranslators} timeout='auto'>
					<Grid
						container
						direction='row'
						justifyContent='center'
						alignItems='center'
						sx={{}}
						spacing={1}
					>
						{uniqueTranslators.map((current: object) => (
							<Grid item>
								<Button
									className='translator-button'
									onClick={() => {
										//setTranslator(current);
										setCurrentOffset(0);
									}}
								>
									<Typography
										sx={{ fontSize: { xs: 10, sm: 10, lg: 12 } }}
										color='#333333'
									>
										{current.toString()}
									</Typography>
								</Button>
							</Grid>
						))}
					</Grid>
				</Collapse>
				<ListItemButton
					className='list-button'
					onClick={() => handleOpenTags()}
				>
					<ListItemText sx={{ color: "#555555" }} primary='Languages' />
					{open ? (
						<ExpandLess sx={{ color: "#333333" }} />
					) : (
						<ExpandMore sx={{ color: "#333333" }} />
					)}
				</ListItemButton>
				<Collapse unmountOnExit in={open} timeout='auto'>
					<Grid
						container
						direction='row'
						justifyContent='center'
						alignItems='center'
						sx={{}}
						spacing={1}
					>
						{mangaLanguages.map((current) => (
							<Grid item>
								<Button
									className='language-button'
									onClick={() => {
										setSelectedLanguage(current);
										setCurrentOffset(0);
									}}
								>
									<Typography
										sx={{ fontSize: { xs: 10, sm: 10, lg: 12 } }}
										color='#333333'
									>
										{current}
									</Typography>
								</Button>
							</Grid>
						))}
					</Grid>
				</Collapse>
			</List>
			<div className='controls'>
				{currentOrder === "desc" ? (
					<Button
						className='asc-desc-button'
						onClick={() => {
							setCurrentOrder("asc");
							console.log(currentOrder);
							setCurrentOffset(0);
						}}
					>
						<Typography textTransform={"none"}>Ascending</Typography>
					</Button>
				) : (
					<Button
						className='asc-desc-button'
						onClick={() => {
							setCurrentOrder("desc");
							console.log(currentOrder);
						}}
					>
						<Typography textTransform={"none"}>Descending</Typography>
					</Button>
				)}
				<div>
					<Button
						className='arrow-button'
						onClick={() =>
							currentOffset === 0 ? null : setCurrentOffset(currentOffset - 100)
						}
					>
						<ArrowBackIosNew />
					</Button>
					<Button
						className='arrow-button'
						onClick={() => {
							setCurrentOffset(currentOffset + 100);
						}}
					>
						<ArrowForwardIos />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default MangaControls;
