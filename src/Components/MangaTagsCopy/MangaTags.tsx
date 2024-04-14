import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { MangaTagsInterface } from "../../interfaces/MangaDexInterfaces";
import "./MangaTags.css";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

type Props = { mangaTags: MangaTagsInterface[] };
const MangaTags = (props: Props) => {
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const { mangaTags } = props;
  const navigate = useNavigate();

  const handleClick = async (tagId: string) => {
    console.log(tagId);
    navigate("mangaList", {
      state: { tagId: tagId },
    });
  };

  return (
    <div className="tags-container">
      <div className="tags-title">
        <MenuIcon
          onClick={() => {
            setOpen(true);
          }}
          className="tags-button"
        ></MenuIcon>
      </div>
      <div className="tags-list">
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          id="nav-dialog"
        >
          <DialogTitle>Tags</DialogTitle>
          <DialogActions>
            {" "}
            <div className="grid-container">
              {mangaTags.map((current: MangaTagsInterface) => (
                <Grid
                  container
                  justifyContent={"center"}
                  alignItems={"center"}
                  item
                >
                  <Button
                    className="tag-button"
                    onClick={() => handleClick(current.id)}
                  >
                    <Typography
                      noWrap
                      color="#FBFF9E"
                      sx={{
                        textTransform: "none",
                        fontSize: 10,
                      }}
                    >
                      {current.attributes.name.en}
                    </Typography>
                  </Button>
                </Grid>
              ))}
            </div>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
  /**
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
	); */
};
export default MangaTags;
