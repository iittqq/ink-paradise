import React, { useEffect, useState, useRef, useCallback } from "react";
import { MangaDexAPI } from "../APIs/MangaDexAPI";
import {
	Card,
	Container,
	CardContent,
	CardMedia,
	Button,
	Typography,
	Box,
	Grid,
} from "@mui/material";
import mangaCoverTemp from "../Assets/cover.jpg";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

type Props = {
	id: string;
	title: string;
	description: string;
	updatedAt: string;
	tags: { tagName: string[]; tagGroup: string[] };
	coverId: string;
	coverUrl: string;
};

dayjs.extend(utc);

const MangaClickable = (props: Props) => {
	const [showDetails, setShowDetails] = useState(false);

	const { id, title, description, updatedAt, tags, coverId, coverUrl } = props;

	return (
		<Container sx={{ height: "100%", width: "100%" }}>
			<Button
				sx={{
					color: "black",
					"&.MuiButtonBase-root:hover": {
						bgcolor: "transparent",
					},
				}}
				//onClick={pullClickedManga}
				onMouseEnter={() => setShowDetails(true)}
				onMouseLeave={() => setShowDetails(false)}
			>
				<div style={{ maxWidth: "220px" }}>
					<Card
						sx={{
							height: "300px",
							width: "200px",
						}}
					>
						<CardMedia sx={{ height: "100%" }} image={coverUrl} />
						{showDetails && (
							<Grid
								container
								direction='row'
								justifyContent='space-between'
								alignItems='center'
								sx={{ marginTop: "-20px" }}
							>
								<Grid item>
									<Card
										sx={{
											backgroundColor: "#000000",
											opacity: 0.8,
											height: "50px",
											width: "80px",
											borderRadius: 1,
										}}
									>
										<Typography fontSize={13} color='white'>
											{updatedAt}
										</Typography>
									</Card>
								</Grid>

								<Grid item>
									<Card
										sx={{
											backgroundColor: "#000000",
											height: "50px",
											opacity: 0.8,
											width: "80px",
											borderRadius: 1,
										}}
									>
										<Typography
											fontSize={13}
											color='white'
											textTransform='none'
										>
											{updatedAt}
										</Typography>
									</Card>
								</Grid>
							</Grid>
						)}
					</Card>
					<div style={{ paddingTop: "5px" }}>
						<Typography
							fontSize={15}
							noWrap
							color='#EFEAD8'
							textTransform='none'
						>
							{title}
						</Typography>
					</div>
				</div>
			</Button>
		</Container>
	);
};

export default MangaClickable;
