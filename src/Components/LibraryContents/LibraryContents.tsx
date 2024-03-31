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
};

const LibraryContents = (props: Props) => {
  const {
    header,
    libraryManga,
    handleLibraryEntryClick,
    checked,
    libraryEntriesToDelete,
  } = props;
  return (
    <div>
      <div className="library-contents-header">
        <Typography>{header === "Dropped -" ? "Dropped" : header}</Typography>
      </div>
      <Grid
        container
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {libraryManga.map((manga: Manga) => (
          <Grid item>
            <Button
              className="manga-entry-overlay-button"
              onClick={() => {
                handleLibraryEntryClick(manga);
              }}
              sx={{
                //border: mangaEntriesToDelete.includes(element.id)
                //? "2px solid #ffffff"
                //: "none",
                opacity: libraryEntriesToDelete.includes(manga.id) ? 0.2 : 1,
              }}
            >
              <MangaClickable
                id={manga.id}
                title={manga.attributes.title.en}
                coverId={
                  manga.relationships.find(
                    (i: Relationship) => i.type === "cover_art",
                  )?.id
                }
                updatedAt={manga.attributes.updatedAt}
                disabled={checked}
              />
            </Button>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default LibraryContents;
