import { Grid, Typography, Button } from "@mui/material";
import { Manga, Relationship } from "../../interfaces/MangaDexInterfaces";
import MangaClickable from "../MangaClickable/MangaClickable";
import "./LibraryContents.css";
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
                  "https://uploads.mangadex.org/covers/" +
                  manga.id +
                  "/" +
                  manga.relationships.find(
                    (i: Relationship) => i.type === "cover_art",
                  )?.attributes?.fileName
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
