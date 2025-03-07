import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Alert,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InfoIcon from "@mui/icons-material/Info";
import CategoryIcon from "@mui/icons-material/Category";
import RawOnIcon from "@mui/icons-material/RawOn";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";
import { MangaTagsInterface } from "../../interfaces/MangaDexInterfaces";
import "./MangaPageButtonHeader.css";

type Props = {
  mangaRaw: string;
  folders: MangaFolder[];
  mangaAltTitles: object[];
  mangaTags: MangaTagsInterface[];
  id: string;
  handleClickOpen: () => void;
  handleOpenCategories: () => void;
  handleCloseCategories: () => void;
  handleOpenInfo: () => void;
  handleCloseInfo: () => void;
  handleClose: () => void;
  handleAddToFolder: (folderId: number, mangaId: string) => void;
  open: boolean;
  showInfoToggled: boolean;
  showCategoriesToggled: boolean;
  mangaExistsError: boolean;
  mangaContentRating: string;
};

const MangaPageButtonHeader = (props: Props) => {
  const {
    mangaRaw,
    folders,
    mangaAltTitles,
    mangaTags,
    id,
    handleAddToFolder,
    handleClickOpen,
    handleCloseCategories,
    handleOpenCategories,
    handleCloseInfo,
    handleOpenInfo,
    handleClose,
    open,
    showInfoToggled,
    showCategoriesToggled,
    mangaExistsError,
    mangaContentRating,
  } = props;

  return (
    <div className="manga-details-buttons-container">
      <Button className="individual-details-button" href={mangaRaw}>
        <RawOnIcon sx={{ color: "#ffffff" }} />
      </Button>

      <Button
        className="individual-details-button"
        disableFocusRipple
        onClick={() => {
          handleClickOpen();
        }}
      >
        <FolderIcon sx={{ color: "#ffffff" }} />
      </Button>
      <Dialog open={open} onClose={handleClose} id="folder-dialog">
        <DialogTitle sx={{ color: "#ffffff", textAlign: "center" }}>
          Select Folder
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            {folders.map((current: MangaFolder) => (
              <Grid item>
                <Button
                  className="folder-button"
                  onClick={() => {
                    if (current.folderId !== undefined) {
                      handleAddToFolder(current.folderId, id);
                    }
                  }}
                >
                  {current.folderName}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        {mangaExistsError === true ? (
          <Alert variant="outlined" severity="error">
            Manga already exists in the folder
          </Alert>
        ) : null}
      </Dialog>
      <Button
        className="individual-details-button"
        onClick={() => {
          handleOpenCategories();
        }}
      >
        <CategoryIcon sx={{ color: "#ffffff" }} />
      </Button>
      <Dialog
        open={showCategoriesToggled}
        onClose={handleCloseCategories}
        id="folder-dialog"
      >
        <DialogTitle sx={{ color: "#ffffff", textAlign: "center" }}>
          Categories
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            {mangaTags.map((current: MangaTagsInterface) => (
              <Grid item>
                <Button className="folder-button" onClick={() => {}}>
                  <Typography noWrap color="#ffffff">
                    {current.attributes.name.en}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
      <Button
        className="individual-details-button"
        onClick={() => {
          handleOpenInfo();
        }}
      >
        {" "}
        <InfoIcon sx={{ color: "#ffffff" }} />
      </Button>
      <Dialog
        open={showInfoToggled}
        onClose={handleCloseInfo}
        id="folder-dialog"
      >
        <DialogTitle
          sx={{
            color: "#ffffff",
            textAlign: "center",
            fontFamily: "Figtree",
            fontSize: 30,
          }}
        >
          Information
        </DialogTitle>
        <div className="content-rating-container">
          <DialogTitle
            sx={{
              color: "#ffffff",
              textAlign: "center",
              fontFamily: "Figtree",
            }}
          >
            Content Rating:
          </DialogTitle>

          <Button className="folder-button">
            <Typography
              noWrap
              color="#ffffff"
              fontFamily="Figtree"
              fontSize={20}
              sx={{ textAlign: "center" }}
            >
              {mangaContentRating}
            </Typography>
          </Button>
        </div>
        <DialogTitle sx={{ color: "#ffffff", textAlign: "center" }}>
          Alt Titles
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            {mangaAltTitles.map((current) => (
              <Grid item>
                <Typography
                  noWrap
                  color="#ffffff"
                  fontFamily="Figtree"
                  fontSize={16}
                >
                  {Object.values(current)} /
                </Typography>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MangaPageButtonHeader;
