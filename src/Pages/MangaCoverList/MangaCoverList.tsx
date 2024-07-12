import { useState, useEffect, useRef } from "react";
import { Grid, Typography, Button } from "@mui/material";
import Header from "../../Components/Header/Header";
import MangaClickable from "../../Components/MangaClickable/MangaClickable";
import { useLocation } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./MangaCoverList.css";

import { fetchMangaCoverBackend } from "../../api/MangaDexApi";
import { Manga, Relationship } from "../../interfaces/MangaDexInterfaces";

const MangaCoverList = () => {
  const { state } = useLocation();
  const [offset, setOffset] = useState<number>(0);
  const [mangaDetails, setMangaDetails] = useState<Manga[]>([]);
  const [coverUrls, setCoverUrls] = useState<{ [key: string]: string }>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCoverImages = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    for (const mangaCurrent of state.manga) {
      const fileName = mangaCurrent.relationships.find(
        (i: Relationship) => i.type === "cover_art",
      )?.attributes?.fileName;
      if (fileName) {
        const imageBlob = await fetchMangaCoverBackend(
          mangaCurrent.id,
          fileName,
        );
        const imageUrl = URL.createObjectURL(imageBlob);
        setCoverUrls((prevCoverUrls) => ({
          ...prevCoverUrls,
          [mangaCurrent.id]: imageUrl,
        }));
      }
    }
  };

  useEffect(() => {
    setMangaDetails(state.manga);
    if (state.manga.length > 0) {
      fetchCoverImages();
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [state]);

  return (
    <>
      <div className="header">
        <Header
          accountId={state.accountId === undefined ? null : state.accountId}
        />
      </div>
      <Typography className="title">{state.listType}</Typography>
      <div>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          wrap="wrap"
          spacing={1}
        >
          {mangaDetails.map((element: Manga) => (
            <Grid item>
              <MangaClickable
                id={element.id}
                title={element.attributes.title.en}
                coverUrl={coverUrls[element.id]}
                accountId={
                  state.accountId === undefined ? null : state.accountId
                }
              />
            </Grid>
          ))}
        </Grid>
      </div>
      <div className="nav-buttons">
        <Button
          className="nav-button-styling"
          onClick={() => (offset - 75 >= 0 ? setOffset(offset - 75) : null)}
        >
          <ArrowBackIosNewIcon />
        </Button>
        <Button
          className="nav-button-styling"
          onClick={() => {
            setOffset(offset + 75);
          }}
        >
          <ArrowForwardIosIcon />
        </Button>
      </div>
    </>
  );
};
export default MangaCoverList;
