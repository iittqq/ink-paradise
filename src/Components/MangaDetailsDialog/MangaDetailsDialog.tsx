import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  Card,
  Grid,
  CardMedia,
} from "@mui/material";
import { Manga, MangaTagsInterface } from "../../interfaces/MangaDexInterfaces";
import "./MangaDetailsDialog.css";

type Props = {
  mangaDetails: Manga;
  openDetailsDialog: boolean;
  handleDetailsDialogClose: () => void;
  coverUrl: string;
  handleClick: (id: string, coverUrl: string) => void;
};

const MangaDetailsDialog = (props: Props) => {
  const {
    mangaDetails,
    openDetailsDialog,
    handleDetailsDialogClose,
    coverUrl,
    handleClick,
  } = props;

  return (
    <>
      <Dialog
        id="clicked-manga-dialog"
        open={openDetailsDialog}
        onClose={handleDetailsDialogClose}
      >
        <DialogTitle className="clicked-manga-dialog-title">
          {mangaDetails.attributes.title.en}
        </DialogTitle>
        <div className="manga-details-dialog-contents">
          <div className="manga-details-cover-section">
            <Card
              sx={{
                maxWidth: "100px",
                minWidth: "100px",
                height: "150px",
              }}
            >
              <CardMedia
                sx={{
                  width: "100%",
                  height: "150px",
                }}
                image={coverUrl}
              />
            </Card>
            <div className="manga-details-stack">
              <Typography className="manga-details-header-text-author">
                Author:{" "}
                {
                  mangaDetails.relationships.find(
                    (element) => element.type === "author",
                  )?.attributes.name
                }
              </Typography>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                className="manga-categories-dialog"
              >
                {mangaDetails.attributes.tags.map(
                  (current: MangaTagsInterface) => (
                    <Grid item>
                      <Typography
                        noWrap
                        className="manga-categories-dialog-text"
                      >
                        {current.attributes.name.en} /{" "}
                      </Typography>
                    </Grid>
                  ),
                )}
              </Grid>
              <div className="details-row">
                {" "}
                <Typography className="manga-details-header-text">
                  {mangaDetails.attributes.contentRating}
                </Typography>
                <Typography className="manga-details-header-text">
                  {mangaDetails.attributes.status}
                </Typography>
                <Typography className="manga-details-header-text">
                  {mangaDetails.attributes.publicationDemographic}
                </Typography>
              </div>{" "}
            </div>
          </div>
          <div className="manga-details-description">
            <Typography className="manga-description-header-text">
              Description:
            </Typography>
            <Typography className="manga-details-description-text">
              {mangaDetails.attributes.description.en}
            </Typography>
          </div>
          <Button
            className="manga-details-dialog-button"
            onClick={() => {
              handleClick(mangaDetails.id, coverUrl);
            }}
          >
            Visit Page
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default MangaDetailsDialog;
