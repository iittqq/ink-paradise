import { Typography, Button, Grid } from "@mui/material";
import { useState } from "react";
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
  oneshot: boolean;
  handleAddToLibrary: () => void;
  libraryEntryExists: boolean;
  accountId: number | null;
  setFolders: (folders: MangaFolder[]) => void;
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
    oneshot,
    handleAddToLibrary,
    libraryEntryExists,
    accountId,
    setFolders,
  } = props;

  const [showMore, setShowMore] = useState<boolean>(false);

  return (
    <div className="banner-container">
      <div className="cover-name-container">
        <img className="cover-image" src={coverUrl} alt="" />
        <div className="header-details-stack">
          <div className="manga-banner-manga-details">
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
                  fontSize: { xs: 16, sm: 20, lg: 25 },
                }}
              >
                Author:{" "}
                <span className="manga-details-color-text">{author}</span>
              </Typography>
            ) : null}
            <Typography
              className="manga-author"
              sx={{
                fontSize: { xs: 16, sm: 20, lg: 25 },
              }}
            >
              Content Rating:{" "}
              <span className="manga-details-color-text">{contentRating}</span>
            </Typography>
            <Typography
              className="manga-author"
              sx={{
                fontSize: { xs: 16, sm: 20, lg: 25 },
              }}
            >
              Status:{" "}
              <span className="manga-details-color-text"> {status}</span>
            </Typography>
            {oneshot && (
              <Typography
                className="manga-details-color-text"
                sx={{
                  fontSize: { xs: 16, sm: 20, lg: 25 },
                }}
              >
                Oneshot
              </Typography>
            )}
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={1}
              sx={{ minHeight: "50px", paddingBottom: "2px" }}
              className="categories-buttons-container"
            >
              {mangaTags.map((current: MangaTagsInterface) => (
                <Grid item>
                  <Button
                    className="categories-buttons"
                    onClick={() => {
                      handleMangaCategoryClicked(current);
                    }}
                  >
                    {current.attributes.name.en}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </div>
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
            handleAddToLibrary={handleAddToLibrary}
            libraryEntryExists={libraryEntryExists}
            accountId={accountId}
            setFolders={setFolders}
          />
        </div>
      </div>
      <div
        className="manga-details"
        style={{ maxHeight: showMore === true ? "none" : "3em" }}
      >
        <Typography className="manga-description">
          {mangaDescription}
        </Typography>
      </div>
      <div className="show-more-container">
        <Button className="show-button" onClick={() => setShowMore(!showMore)}>
          {showMore ? "Show Less" : "Show More"}
        </Button>
      </div>
    </div>
  );
};

export default MangaBanner;
