import { useState, useEffect, useRef } from "react";
import { Grid, Typography, Button } from "@mui/material";
import MangaClickable from "../../Components/MangaClickable/MangaClickable";
import { useLocation } from "react-router-dom";
import "./MangaCoverList.css";

import {
  fetchMangaCoverBackend,
  fetchSimilarManga,
  fetchRecentlyUpdated,
  fetchRecentlyAdded,
} from "../../api/MangaDexApi";
import { Manga, Relationship } from "../../interfaces/MangaDexInterfaces";
import { AccountDetails } from "../../interfaces/AccountDetailsInterfaces";
import { Account } from "../../interfaces/AccountInterfaces";

interface MangaCoverListProps {
  account: Account | null;
  accountDetails: AccountDetails | null;
}

const MangaCoverList = ({ accountDetails, account }: MangaCoverListProps) => {
  const { state } = useLocation();
  const [mangaDetails, setMangaDetails] = useState<Manga[]>(state.manga);
  const [coverUrls, setCoverUrls] = useState<{ [key: string]: string }>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const [offset, setOffset] = useState<number>(100);

  const fetchCoverImages = async (mangaList: Manga[]) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    for (const mangaCurrent of mangaList) {
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

  const handleShowMore = () => {
    if (state.tagId !== undefined) {
      fetchSimilarManga(
        100,
        offset,
        [state.tagId],
        accountDetails === null ? 3 : accountDetails.contentFilter,
      ).then((response: Manga[]) => {
        setMangaDetails([...mangaDetails, ...response]);
        fetchCoverImages(response);
      });
    } else if (state.listType === "Recently Updated") {
      fetchRecentlyUpdated(
        100,
        offset,
        accountDetails === null ? 3 : accountDetails.contentFilter,
      ).then((response: Manga[]) => {
        setMangaDetails([...mangaDetails, ...response]);
        fetchCoverImages(response);
      });
    } else if (state.listType === "Recently Added") {
      fetchRecentlyAdded(
        100,
        offset,
        accountDetails === null ? 3 : accountDetails.contentFilter,
      ).then((response: Manga[]) => {
        setMangaDetails([...mangaDetails, ...response]);
        fetchCoverImages(response);
      });
    }
    setOffset(offset + 100);
  };

  useEffect(() => {
    setMangaDetails(state.manga);
    if (state.manga.length > 0) {
      fetchCoverImages(state.manga);
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [state]);

  return (
    <>
      <Typography className="title">{state.listType}</Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          wrap="wrap"
          spacing={1}
          columns={{ xs: 12, sm: 15, md: 21, lg: 30, xl: 39 }}
        >
          {mangaDetails.map((element: Manga) => (
            <Grid item xs={3}>
              <MangaClickable
                manga={element}
                id={element.id}
                title={
                  element.attributes.title.en === undefined
                    ? Object.values(element.attributes.title)[0]
                    : element.attributes.title.en
                }
                coverUrl={coverUrls[element.id]}
                accountId={account === null ? null : account.id}
                contentFilter={state.contentFilter}
              />
            </Grid>
          ))}
        </Grid>
        <Button
          className="show-more-manga-cover-list"
          onClick={() => {
            handleShowMore();
          }}
        >
          Show more
        </Button>{" "}
      </div>
    </>
  );
};
export default MangaCoverList;
