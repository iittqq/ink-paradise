import { Button, Grid, Typography } from "@mui/material";
import { MangaTagsInterface } from "../../interfaces/MangaDexInterfaces";
import "./MangaTags.css";

type Props = { mangaTags: MangaTagsInterface[] };
const MangaTags = (props: Props) => {
	const { mangaTags } = props;
	return (
		<div className='tags-container'>
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
				{mangaTags.map((current: MangaTagsInterface) => (
					<Grid item>
						<Button className='tag-button' onClick={() => {}}>
							<Typography
								noWrap
								color='#333333'
								sx={{
									fontSize: 10,
								}}
							>
								{current.attributes.name.en}
							</Typography>
						</Button>
					</Grid>
				))}
			</Grid>
		</div>
	);
};

export default MangaTags;
