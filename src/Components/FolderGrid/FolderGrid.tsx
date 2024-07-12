import { useState, useEffect } from "react";
import { Grid, Button, CircularProgress, Typography } from "@mui/material";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";
import { Manga, Relationship } from "../../interfaces/MangaDexInterfaces";
import MangaClickable from "../MangaClickable/MangaClickable";
import "./FolderGrid.css";
import { fetchMangaCoverBackend } from "../../api/MangaDexApi";
import { useNavigate } from "react-router-dom";

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
  selectAll: boolean;
  accountId: number;
};

const FolderGrid = (props: Props) => {
  const navigate = useNavigate();
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
    selectAll,
    accountId,
  } = props;

  const [coverUrlsFolderGrid, setCoverUrlsFolderGrid] = useState<{
    [key: string]: string;
  }>({});

  const handleFolderClick = (folder: MangaFolder) => {
    folderClick(folder);
  };

  const handleMangaEntryClick = (manga: Manga) => {
    mangaEntryClick(manga);
  };

  useEffect(() => {
    const fetchCoverImagesFolderGrid = async () => {
      if (folderMangaData) {
        for (const manga of folderMangaData) {
          const fileName = manga.relationships.find(
            (i: Relationship) => i.type === "cover_art",
          )?.attributes?.fileName;
          if (fileName) {
            const imageBlob = await fetchMangaCoverBackend(manga.id, fileName);
            const imageUrl = URL.createObjectURL(imageBlob);
            setCoverUrlsFolderGrid((prevCoverUrls) => ({
              ...prevCoverUrls,
              [manga.id]: imageUrl,
            }));
          }
        }
      }
    };

    if (folderMangaData) {
      fetchCoverImagesFolderGrid();
    }
  }, [folderMangaData]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="row"
      spacing={1}
    >
      {loading ? (
        <Grid item>
          <CircularProgress size={25} sx={{ color: "#ffffff" }} />
        </Grid>
      ) : selectedFolder === null ? (
        folders.map((folder: MangaFolder) => (
          <Grid item key={folder.folderId} className="folder-grid-item">
            <Button
              className="folder"
              onClick={() => {
                handleFolderClick(folder);
              }}
              sx={{
                opacity:
                  folder.folderId !== undefined
                    ? mangaFoldersToDelete.includes(folder.folderId)
                      ? 0.2
                      : 1
                    : undefined,
              }}
            >
              <div>
                <Typography
                  textTransform="none"
                  color="#ffffff"
                  fontFamily="Figtree"
                >
                  {folder.folderName} <br />
                </Typography>
              </div>
            </Button>
          </Grid>
        ))
      ) : folderMangaData?.length === 0 ? (
        <Grid item>
          <Button
            className="redirect-button"
            onClick={() => {
              navigate("/", { state: { accountId: accountId } });
            }}
          >
            <Typography fontFamily="Figtree">Start Browsing</Typography>
          </Button>
        </Grid>
      ) : (
        folderMangaData?.map((element: Manga) => (
          <Grid item key={element.id}>
            <Button
              className="manga-entry-overlay-button"
              onClick={() => {
                handleMangaEntryClick(element);
              }}
              sx={{
                opacity: mangaEntriesToDelete.includes(element.id) ? 0.2 : 1,
              }}
            >
              <MangaClickable
                id={element.id}
                title={element.attributes.title.en}
                coverUrl={coverUrlsFolderGrid[element.id]}
                updatedAt={element.attributes.updatedAt}
                disabled={checked || selectAll}
                accountId={accountId}
              />
            </Button>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default FolderGrid;
