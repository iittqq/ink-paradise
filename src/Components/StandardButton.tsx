import { Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

type Props = {
	text: string;
	widthXs?: string;
	widthSm?: string;
	widthLg?: string;
	width?: string;
	heightXs?: string;
	heightSm?: string;
	heightLg?: string;
	height?: string;
	location: string;
	backgroundColor: string;
	textColor: string;
	fontSizeXs?: number;
	fontSizeSm?: number;
	fontSizeLg?: number;
	fontSize?: number;
};

const StandardButton = (props: Props) => {
	const {
		text,
		widthXs,
		widthSm,
		widthLg,
		width,
		heightXs,
		heightSm,
		heightLg,
		height,
		location,
		backgroundColor,
		textColor,
		fontSizeXs,
		fontSizeSm,
		fontSizeLg,
		fontSize,
	} = props;
	let navigate = useNavigate();

	function handleClick() {
		navigate(location, {
			state: {},
		});
	}

	console.log(width);
	return (
		<Button
			sx={{
				backgroundColor: { backgroundColor },
				width:
					width === undefined
						? { xs: widthXs, sm: widthSm, lg: widthLg }
						: { width },
				height:
					height === undefined
						? { xs: heightXs, sm: heightSm, lg: heightLg }
						: { height },
				textAlign: "center",
				"&.MuiButtonBase-root:hover": {
					bgcolor: "transparent",
				},
				".MuiTouchRipple-child": {
					backgroundColor: "white",
				},
			}}
			onClick={() => {
				handleClick();
			}}
		>
			<Typography
				noWrap
				color={textColor}
				sx={{
					fontSize:
						fontSize === undefined
							? {
									xs: fontSizeXs,
									sm: fontSizeSm,
									lg: fontSizeLg,
							  }
							: { fontSize },
				}}
			>
				{text}
			</Typography>
		</Button>
	);
};

export default StandardButton;
