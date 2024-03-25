import { Grid, Button, CircularProgress, Typography } from "@mui/material";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import { Relationship } from "../../interfaces/MangaDexInterfaces";
import MangaClickable from "../MangaClickable/MangaClickable";
import "./FolderGrid.css";

type Props = {
  folderClick: (folder: MangaFolder) => void;
  mangaEntryClick: (manga: Manga) => void;
  loading: boolean;
  selectedFolder: MangaFolder | null;
  checked: boolean;
  folders: MangaFolder[];
  mangaFoldersToDelete: number[];
  folderMangaData: Manga[] | null;
  mangaEntriesToDelete: string[];
};

const FolderGrid = (props: Props) => {
  const {
    folderClick,
    mangaEntryClick,
    loading,
    selectedFolder,
    checked,
    folders,
    mangaFoldersToDelete,
    folderMangaData,
    mangaEntriesToDelete,
  } = props;
  const handleFolderClick = (folder: MangaFolder) => {
    folderClick(folder);
  };

  const handleMangaEntryClick = (manga: Manga) => {
    mangaEntryClick(manga);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="row"
      spacing={2}
    >
      {loading ? (
        <Grid item>
          <CircularProgress size={25} sx={{ color: "#ffffff" }} />
        </Grid>
      ) : selectedFolder === null ? (
        folders.map((folder: MangaFolder) => (
          <Grid item>
            <Button
              className="folder"
              onClick={() => {
                handleFolderClick(folder);
              }}
              sx={{
                //border: mangaEntriesToDelete.includes(element.id)
                //? "2px solid #ffffff"
                //: "none",
                opacity:
                  folder.folderId !== undefined
                    ? mangaFoldersToDelete.includes(folder.folderId)
                      ? 0.2
                      : 1
                    : null,
              }}
            >
              <div>
                <Typography
                  textTransform={"none"}
                  color={"#ffffff"}
                  fontFamily={"Figtree"}
                >
                  {folder.folderName} <br />
                </Typography>
                <Typography className="folder-description">
                  {folder.folderDescription}
                </Typography>
              </div>
            </Button>
          </Grid>
        ))
      ) : folderMangaData?.length === 0 ? (
        <Grid item>
          <Typography fontFamily={"Figtree"}>Empty...</Typography>
        </Grid>
      ) : (
        folderMangaData?.map((element: Manga) => (
          <Grid item>
            <Button
              className="manga-entry-overlay-button"
              onClick={() => {
                handleMangaEntryClick(element);
              }}
              sx={{
                //border: mangaEntriesToDelete.includes(element.id)
                //? "2px solid #ffffff"
                //: "none",
                opacity: mangaEntriesToDelete.includes(element.id) ? 0.2 : 1,
              }}
            >
              <MangaClickable
                id={element.id}
                title={element.attributes.title.en}
                coverId={
                  element.relationships.find(
                    (i: Relationship) => i.type === "cover_art",
                  )?.id
                }
                updatedAt={element.attributes.updatedAt}
                disabled={checked}
              />
            </Button>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default FolderGrid;
