import React, { useEffect, useState } from "react";
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

type Props = {
	mangaLanguages: any[];
	currentOffset: any;
	currentOrder: any;
	selectedLanguage: any;
	setSelectedLanguage: any;
	setCurrentOffset: any;
	setCurrentOrder: any;
	mangaTranslators: any[];
	setTranslator: any;
};

const MangaControls = (props: Props) => {
	const [open, setOpen] = useState(false);
	const [openTranslators, setOpenTranslators] = useState(false);
	const [uniqueTranslators, setUniqueTranslators] = useState<any[]>([]);
	const [doneSettingTranslators, setDoneSettingTranslators] = useState(false);

	const {
		mangaLanguages,
		currentOffset,
		currentOrder,
		selectedLanguage,
		setSelectedLanguage,
		setCurrentOffset,
		setCurrentOrder,
		mangaTranslators,
		setTranslator,
	} = props;
	const handleOpenTags = () => {
		setOpen(!open);
	};
	const handleOpenTranslators = () => {
		setOpenTranslators(!openTranslators);
	};
	useEffect(() => {}, [currentOrder]);

	const distinguishUniqueTranslators = () => {
		if (doneSettingTranslators === false) {
			const uniqueTranslatorsArray: any[] = [];
			for (const current of mangaTranslators) {
				if (!uniqueTranslatorsArray.includes(current)) {
					uniqueTranslatorsArray.push(current);
				}
			}
			setUniqueTranslators(uniqueTranslatorsArray);
		}
		setDoneSettingTranslators(true);
	};

	return (
		<div
			style={{
				width: "50%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<List
				sx={{
					width: "100%",
					justifyContent: "center",
					display: "flex",
					alignItems: "center",
					flexDirection: "column",
				}}
			>
				<ListItemButton
					sx={{
						width: "150px",
						color: "#121212",
						backgroundColor: "transparent",
						"&.MuiButtonBase-root:hover": {
							bgcolor: "transparent",
						},
					}}
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
				<Collapse
					unmountOnExit
					sx={{
						width: "100%",
						height: "20%",
					}}
					in={openTranslators}
					timeout='auto'
				>
					<Grid
						container
						direction='row'
						justifyContent='center'
						alignItems='center'
						sx={{}}
						spacing={1}
					>
						{uniqueTranslators.map((current) => (
							<Grid item>
								<Button
									sx={{
										backgroundColor: "#191919",
										width: { xs: "55px", sm: "55px", lg: "55px" },
										height: { xs: "45px", sm: "45px", lg: "45px" },
										"&.MuiButtonBase-root:hover": {
											bgcolor: "transparent",
										},
										".MuiTouchRipple-child": {
											backgroundColor: "white",
										},
									}}
									onClick={() => {
										setTranslator(current);
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
				<ListItemButton
					sx={{
						width: "150px",
						color: "#121212",
						backgroundColor: "transparent",
						"&.MuiButtonBase-root:hover": {
							bgcolor: "transparent",
						},
					}}
					onClick={() => handleOpenTags()}
				>
					<ListItemText sx={{ color: "#555555" }} primary='Languages' />
					{open ? (
						<ExpandLess sx={{ color: "#333333" }} />
					) : (
						<ExpandMore sx={{ color: "#333333" }} />
					)}
				</ListItemButton>
				<Collapse
					unmountOnExit
					sx={{
						width: "100%",
						height: "20%",
					}}
					in={open}
					timeout='auto'
				>
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
									sx={{
										backgroundColor: "#191919",
										width: { xs: "20px", sm: "20px", lg: "20px" },
										height: { xs: "20px", sm: "20px", lg: "20px" },
										"&.MuiButtonBase-root:hover": {
											bgcolor: "transparent",
										},
										".MuiTouchRipple-child": {
											backgroundColor: "white",
										},
									}}
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
			{currentOrder === "desc" ? (
				<Button
					sx={{
						color: "#333333",

						height: "20px",
						width: { xs: "80%", md: "60%", lg: "20%" },
						backgroundColor: "#191919",
						"&.MuiButtonBase-root:hover": {
							bgcolor: "transparent",
						},
						".MuiTouchRipple-child": {
							backgroundColor: "white",
						},
					}}
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
					sx={{
						color: "#333333",

						height: "20px",
						width: { xs: "80%", md: "60%", lg: "20%" },
						backgroundColor: "#191919",
						"&.MuiButtonBase-root:hover": {
							bgcolor: "transparent",
						},
						".MuiTouchRipple-child": {
							backgroundColor: "white",
						},
					}}
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
					sx={{
						color: "#333333",
						"&.MuiButtonBase-root:hover": {
							bgcolor: "transparent",
						},
						".MuiTouchRipple-child": {
							backgroundColor: "white",
						},
					}}
					onClick={() =>
						currentOffset === 0 ? null : setCurrentOffset(currentOffset - 100)
					}
				>
					<ArrowBackIosNew />
				</Button>
				<Button
					sx={{
						color: "#333333",
						"&.MuiButtonBase-root:hover": {
							bgcolor: "transparent",
						},
						".MuiTouchRipple-child": {
							backgroundColor: "white",
						},
					}}
					onClick={() => {
						setCurrentOffset(currentOffset + 100);
					}}
				>
					<ArrowForwardIos />
				</Button>
			</div>
		</div>
	);
};

export default MangaControls;
