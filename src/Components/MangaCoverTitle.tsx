import { Button, Card, CardMedia, Typography } from "@mui/material";
import React from "react";
type Props = {
	image: string;
	title: string;
};

const MangaCoverTitle = (props: Props) => {
	const { image, title } = props;
	return (
		<div>
			<Button>
				<Card
					sx={{
						position: "relative",
					}}
				>
					<CardMedia className='manga-cover' image={image} />

					<Typography
						color='white'
						textTransform='none'
						align='center'
						noWrap
						className='manga-text'
					>
						{title}
					</Typography>
				</Card>
			</Button>
		</div>
	);
};

export default MangaCoverTitle;
