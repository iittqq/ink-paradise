import { Grid } from "@mui/material";
import { MalFavorites } from "../../interfaces/MalInterfaces";
import MangaClickable from "../MangaClickable/MangaClickable";
import "./LibraryContents.css";
type Props = { libraryManga: MalFavorites[] };

const LibraryContents = (props: Props) => {
  const { libraryManga } = props;
  return (
    <div>
      <Grid
        container
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {libraryManga.map((manga: MalFavorites) => (
          <Grid item>
            <MangaClickable
              title={manga.title}
              coverUrl={manga.images.jpg.large_image_url}
              rank={String(1)}
              id={String(manga.mal_id)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default LibraryContents;
