import React from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";

type Props = {};

const NewAdditions = (props: Props) => {
	const [emblaRef] = useEmblaCarousel();
	return (
		<Container>
			<Grid
				container
				direction='row'
				justifyContent='space-evenly'
				alignItems='center'
			>
				<Grid item sx={{ overflow: "hidden" }}>
					{" "}
					<div ref={emblaRef}></div>
				</Grid>
			</Grid>
		</Container>
	);
};

export default NewAdditions;
