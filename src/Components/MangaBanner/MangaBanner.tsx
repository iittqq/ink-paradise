import { Typography } from "@mui/material";
import "./MangaBanner.css";
import MangaPageButtonHeader from "../MangaPageButtonHeader/MangaPageButtonHeader";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";
import { MangaTagsInterface } from "../../interfaces/MangaDexInterfaces";

type Props = {
  coverUrl: string;
  mangaDescription: string;
  mangaName: string;
  author: string | undefined;
  contentRating: string;
  status: string | undefined;
  mangaRaw: string;
  folders: MangaFolder[];
  mangaAltTitles: object[];
  mangaTags: MangaTagsInterface[];
  id: string | undefined;
  handleAddToFolder: (folderId: number, mangaId: string) => void;
  handleClickOpen: () => void;
  handleCloseCategories: () => void;
  handleCloseInfo: () => void;
  handleOpenCategories: () => void;
  handleOpenInfo: () => void;
  open: boolean;
  showInfoToggled: boolean;
  showCategoriesToggled: boolean;
  mangaExistsError: boolean;
  handleClose: () => void;
  mangaContentRating: string;
  mangaAddedAlert: boolean;
  handleMangaCategoryClicked: (category: MangaTagsInterface) => void;
};

const MangaBanner = (props: Props) => {
  const {
    coverUrl,
    mangaDescription,
    mangaName,
    author,
    contentRating,
    status,
    mangaRaw,
    folders,
    mangaAltTitles,
    mangaTags,
    id,
    handleAddToFolder,
    handleClickOpen,
    handleCloseCategories,
    handleCloseInfo,
    handleOpenCategories,
    handleOpenInfo,
    open,
    showInfoToggled,
    showCategoriesToggled,
    mangaExistsError,
    handleClose,
    mangaContentRating,
    mangaAddedAlert,
    handleMangaCategoryClicked,
  } = props;

  return (
    <div className="banner-container">
      <div className="cover-name-container">
        <img className="cover-image" src={coverUrl} alt="" />
        <div className="header-details-stack">
          <Typography
            className="manga-name"
            sx={{
              fontSize: { xs: 20, sm: 25, lg: 30 },
            }}
          >
            {mangaName}
          </Typography>
          {author !== undefined ? (
            <Typography
              className="manga-author"
              sx={{
                fontSize: { xs: 15, sm: 20, lg: 25 },
              }}
            >
              Author: <span className="manga-details-color-text">{author}</span>
            </Typography>
          ) : null}
          <Typography
            className="manga-author"
            sx={{
              fontSize: { xs: 15, sm: 20, lg: 25 },
            }}
          >
            Content Rating:{" "}
            <span className="manga-details-color-text">{contentRating}</span>
          </Typography>
          <Typography
            className="manga-author"
            sx={{
              fontSize: { xs: 15, sm: 20, lg: 25 },
            }}
          >
            Status: <span className="manga-details-color-text"> {status}</span>
          </Typography>
          <MangaPageButtonHeader
            mangaRaw={mangaRaw}
            folders={folders}
            mangaAltTitles={mangaAltTitles}
            mangaTags={mangaTags}
            id={id !== undefined ? id : ""}
            handleAddToFolder={handleAddToFolder}
            handleClickOpen={handleClickOpen}
            handleCloseCategories={handleCloseCategories}
            handleCloseInfo={handleCloseInfo}
            handleOpenCategories={handleOpenCategories}
            handleOpenInfo={handleOpenInfo}
            open={open}
            showInfoToggled={showInfoToggled}
            showCategoriesToggled={showCategoriesToggled}
            mangaExistsError={mangaExistsError}
            handleClose={handleClose}
            mangaContentRating={mangaContentRating}
            mangaAddedAlert={mangaAddedAlert}
            handleMangaCategoryClicked={handleMangaCategoryClicked}
          />
        </div>
      </div>
      <div className="manga-details">
        <Typography
          className="manga-description"
          sx={{
            WebkitLineClamp: 5,
            fontSize: { xs: 15, sm: 15, lg: 18 },
          }}
        >
          {mangaDescription}
        </Typography>
      </div>
    </div>
  );
};

export default MangaBanner;
