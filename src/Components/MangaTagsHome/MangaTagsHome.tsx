import { Grid, Button, Dialog, DialogTitle } from "@mui/material";
import { MangaTagsInterface } from "../../interfaces/MangaDexInterfaces";
import "./MangaTagsHome.css";

type Props = {
  mangaTags: MangaTagsInterface[];
  handleClickedTag: (tag: MangaTagsInterface | null) => void;
  selectedTag?: MangaTagsInterface;
  handleClickOpenTags: () => void;
  openTags: boolean;
  handleTagsDialogClose: () => void;
};

const MangaTagsHome = (props: Props) => {
  const {
    mangaTags,
    handleClickedTag,
    selectedTag,
    openTags,
    handleTagsDialogClose,
  } = props;

  return (
    <div className="manga-tags-home-container">
      <Dialog
        id="open-tags-dialog"
        open={openTags}
        onClose={handleTagsDialogClose}
      >
        <DialogTitle className="open-tags-dialog-title">Categories</DialogTitle>

        <Grid className="tags-container" container>
          {mangaTags.map((tag) => (
            <Grid item className="tag-item">
              <Button
                sx={{
                  opacity:
                    selectedTag !== undefined && selectedTag.id === tag.id
                      ? "50%"
                      : "none",
                }}
                disabled={
                  selectedTag !== undefined && selectedTag.id === tag.id
                }
                className="tag-button"
                onClick={() => {
                  handleClickedTag(tag);
                }}
              >
                {tag.attributes.name.en}
              </Button>
            </Grid>
          ))}
          <Grid item className="tag-item">
            {" "}
            <Button
              className="tag-button"
              onClick={() => {
                handleClickedTag(null);
              }}
            >
              None
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};
export default MangaTagsHome;
