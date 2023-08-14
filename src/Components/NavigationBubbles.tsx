import React, { useState } from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
	buttons: {
		name: string;
		location: string;
		background: string;
	}[];
};
const buttonColor = "#635985";
const NavigationBubbles = (props: Props) => {
	/**const [isShown, setIsShown] = useState(false);*/
	const { buttons } = props;
	const navigate = useNavigate();
	return (
		<Container>
			<Grid
				container
				direction='row'
				justifyContent='space-evenly'
				alignItems='center'
				sx={{
					height: "20vh",
					width: "100vh",
				}}
			>
				{buttons.map((current) => (
					<Grid item>
						<Button
							onClick={() => navigate(current.location)}
							sx={{
								"&:hover": {
									backgroundImage: `url(${current.background})`,
									backgroundSize: "100%",
								},
								backgroundColor: buttonColor,
								height: "10vh",
								width: "20vh",
							}}
						>
							<Typography color='black'>{current.name}</Typography>
						</Button>
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default NavigationBubbles;
