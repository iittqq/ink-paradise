import { Grid, Typography } from "@mui/material";
import { Manga, Relationship } from "../../interfaces/MangaDexInterfaces";
import MangaClickable from "../MangaClickable/MangaClickable";
import "./LibraryContents.css";
type Props = { libraryManga: Manga[] };

const LibraryContents = (props: Props) => {
  const { libraryManga } = props;
  return (
    <div>
      <div className="library-contents-header">
        <Typography>Favorites</Typography>
      </div>
      <Grid
        container
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {libraryManga.map((manga: Manga) => (
          <Grid item>
            <MangaClickable
              id={manga.id}
              title={manga.attributes.title.en}
              coverId={
                manga.relationships.find(
                  (i: Relationship) => i.type === "cover_art",
                )?.id
              }
              updatedAt={manga.attributes.updatedAt}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default LibraryContents;
