import { Typography, Grid } from "@mui/material";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import MangaClickable from "../MangaClickable/MangaClickable";
import { Relationship } from "../../interfaces/MangaDexInterfaces";
import "./SimilarManga.css";
import {fetchMangaCoverBackend} from "../../api/MangaDexApi";
import { useEffect, useState } from "react";

type Props = { manga: Manga[] };
const SimilarManga = (props: Props) => {
  const { manga } = props;
  const [coverUrls, setCoverUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCoverImages = async () => {
      const coverUrls: { [key: string]: string } = {};
      for (const mangaCurrent of manga) {
      const fileName = mangaCurrent.relationships.find(
        (i: Relationship) => i.type === "cover_art",
      )?.attributes?.fileName;
      if (fileName) {
        const imageBlob = await fetchMangaCoverBackend(mangaCurrent.id, fileName);
        coverUrls[mangaCurrent.id] = URL.createObjectURL(imageBlob);
      }
      }
      setCoverUrls(coverUrls);
    };
    if (manga.length > 0) {
      fetchCoverImages();
    }
  }, [manga]);

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
                coverUrls[current.id]
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
