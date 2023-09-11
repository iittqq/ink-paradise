import React, { useState } from "react";
import {
	Card,
	Container,
	CardContent,
	CardMedia,
	Button,
	Typography,
} from "@mui/material";
import mangaCover from "../Assets/cover.jpg";

type Props = {
	manga: {
		name: string;
		updatedDate: string;
		cover: string;
		destination: string;
	};
};

const MangaClickable = (props: Props) => {
	const { manga } = props;
	const [showDetails, setShowDetails] = useState(false);
	return (
		<Container>
			<Button
				sx={{
					color: "black",
					"&.MuiButtonBase-root:hover": {
						bgcolor: "transparent",
					},
				}}
				onMouseEnter={() => setShowDetails(true)}
				onMouseLeave={() => setShowDetails(false)}
			>
				<Card
					sx={{
						height: "300px",
						width: "200px",
					}}
				>
					<CardMedia sx={{ height: "100%" }} image={manga.cover} />
					{showDetails && (
						<CardContent
							sx={{
								height: "10%",
								marginTop: "-7  0px",
								backgroundColor: "rgba(0, 0, 0, 0.7)",
								color: "white",
							}}
						>
							<div>
								<Typography fontSize={15}>{manga.name}</Typography>
								<Typography gutterBottom fontSize={13}>
									{manga.updatedDate}
								</Typography>
							</div>
						</CardContent>
					)}
				</Card>
			</Button>
		</Container>
	);
};

export default MangaClickable;
