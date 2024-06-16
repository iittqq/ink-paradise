import { Typography, Grid } from "@mui/material";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import MangaClickable from "../MangaClickable/MangaClickable";
import { Relationship } from "../../interfaces/MangaDexInterfaces";
import "./SimilarManga.css";
type Props = { manga: Manga[] };
const SimilarManga = (props: Props) => {
  const { manga } = props;

  return (
    <div>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        {manga.map((current: Manga) => (
          <Grid item className="similar-manga-item">
            <div>
              <MangaClickable
                id={current.id}
                title={current.attributes.title.en}
                coverUrl={
                  "https://uploads.mangadex.org/covers/" +
                  current.id +
                  "/" +
                  current.relationships.find(
                    (i: Relationship) => i.type === "cover_art",
                  )?.attributes?.fileName
                }
                updatedAt={current.attributes.updatedAt}
              />
            </div>
            <div className="info-column">
              <div className="similar-manga-details">
                {current.attributes.description.en}
              </div>
              <Typography fontFamily="Figtree">
                {" "}
                {current.attributes.contentRating}
              </Typography>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default SimilarManga;
