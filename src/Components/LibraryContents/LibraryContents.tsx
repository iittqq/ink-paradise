import {useEffect, useState} from "react";
import { Grid, Typography, Button } from "@mui/material";
import { Manga, Relationship } from "../../interfaces/MangaDexInterfaces";
import MangaClickable from "../MangaClickable/MangaClickable";
import "./LibraryContents.css";
import { fetchMangaCoverBackend } from "../../api/MangaDexApi";

type Props = {
  header: string;
  libraryManga: Manga[];
  handleLibraryEntryClick: (manga: Manga) => void;
  checked: boolean;
  libraryEntriesToDelete: string[];
  selectAll: boolean;
};

const LibraryContents = (props: Props) => {
  const {
    header,
    libraryManga,
    handleLibraryEntryClick,
    checked,
    libraryEntriesToDelete,
    selectAll,
  } = props;

  const [coverUrlsLibrary, setCoverUrlsLibrary] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCoverImagesLibrary = async () => {
      const coverUrlsLibrary: { [key: string]: string } = {};
      for (const manga of libraryManga) {
        const fileName = manga.relationships.find(
          (i: Relationship) => i.type === "cover_art",
        )?.attributes?.fileName;
        if (fileName) {
          const imageBlob = await fetchMangaCoverBackend(manga.id, fileName);
          coverUrlsLibrary[manga.id] = URL.createObjectURL(imageBlob);
        }
      }
      setCoverUrlsLibrary(coverUrlsLibrary);
    };
    if (libraryManga.length > 0) {
      fetchCoverImagesLibrary();
    }
  }, [libraryManga]);
    
  return (
    <div>
      <div className="library-contents-header">
        <Typography fontFamily={"Figtree"} fontSize={20}>{header}</Typography>
      </div>
      <Grid
        container
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {libraryManga.length === 0 ? (
          <Typography fontFamily={"Figtree"}>Empty...</Typography>
        ) : null}
        {libraryManga.map((manga: Manga) => (
          <Grid item>
            <Button
              className="manga-entry-overlay-button"
              onClick={() => {
                handleLibraryEntryClick(manga);
              }}
              sx={{
                opacity: libraryEntriesToDelete.includes(manga.id) ? 0.2 : 1,
              }}
            >
              <MangaClickable
                id={manga.id}
                title={manga.attributes.title.en}
                coverUrl={
                coverUrlsLibrary[manga.id]
                }
                updatedAt={manga.attributes.updatedAt}
                disabled={checked || selectAll}
              />
            </Button>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default LibraryContents;
