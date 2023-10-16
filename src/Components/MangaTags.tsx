import React from "react";
import { Grid, Typography } from "@mui/material";
import StandardButton from "./StandardButton";

type Props = { mangaTags: any[] };
const MangaTags = (props: Props) => {
	const { mangaTags } = props;
	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
				}}
			>
				<Typography
					align='center'
					color='#555555'
					sx={{ fontSize: { xs: 12, sm: 14, lg: 16 } }}
				>
					Categories
				</Typography>

				<Grid
					container
					direction='row'
					justifyContent='center'
					alignItems='center'
					spacing={1}
					sx={{ paddingTop: "10px" }}
				>
					{mangaTags.map((current: any) => (
						<Grid item>
							<StandardButton
								backgroundColor='#191919'
								widthXs='110px'
								widthSm='120px'
								widthLg='120px'
								heightXs='20px'
								heightSm='20px'
								heightLg='20px'
								textColor='#333333'
								fontSizeXs={9}
								fontSizeSm={10}
								fontSizeLg={10}
								text={current["attributes"].name["en"]}
								location='none'
							/>
						</Grid>
					))}
				</Grid>
			</div>
		</div>
	);
};

export default MangaTags;
