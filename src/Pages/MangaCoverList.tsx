import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
} from "@mui/material";
import Header from "../Components/Header";
import CoverClickable from "../Components/CoverClickable";
import { useLocation } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const baseUrl = "https://api.mangadex.org";
const MangaCoverList = () => {
  const { state } = useLocation();
  let pageTitle = state.listType;
  const [offset, setOffset] = useState<number>(0);
  console.log(state.title);
  console.log(state.tagId !== undefined);
  console.log(state.listType);
  const [recentlyUpdatedMangaDetails, setRecentlyUpdatedMangaDetails] =
    useState<Object[]>([]);


  const fetchMangaByRecentlyAdded = async () => {
    //pageTitle = "Recently Added";
    (fetch(`${baseUrl}/manga?limit=60&offset=${offset}&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BcreatedAt%5D=desc`)
      .then((response) => response.json())
      .then((data) => {
        setRecentlyUpdatedMangaDetails(data.data);

            console.log(data.data);
          })
    )
  }

  const fetchMangaByTitle = async () => {
    (fetch(
          `${baseUrl}/manga?limit=60&offset=${offset}&title=${
            state.title === undefined ? "" : state.title
          }&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`
        )
          .then((response) => response.json())
          .then((data) => {
            setRecentlyUpdatedMangaDetails(data.data);

            console.log(data.data);
          })
          )
  }

  const fetchMangaByAuthor = async () => {
    (fetch(
        `${baseUrl}/manga?limit=60&offset=0&authors%5B%5D=${state.authorId}&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`
        )
          .then((response) => response.json())
          .then((data) => {
            setRecentlyUpdatedMangaDetails(data.data);

            console.log(data.data);
          }))
  }

  const fetchMangaByTag = async () => {
    (fetch(
          `${baseUrl}/manga?limit=60&offset=0&includedTags%5B%5D=${state.tagId}&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`
          )
          .then((response) => response.json())
          .then((data) => {
            setRecentlyUpdatedMangaDetails(data.data);

            console.log(data.data);
          }))
  }

  const fetchMangaByRecentlyUpdated = async () => {
    (fetch(
          `${baseUrl}/manga?limit=60&offset=${offset}&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`
          )
          .then((response) => response.json())
          .then((data) => {
            setRecentlyUpdatedMangaDetails(data.data);

            console.log(data.data);
          }))
  }

  const fetchMangaCoverList = async () => {
    console.log(state.listType);
    state.listType === "RecentlyAdded"
      ? (fetchMangaByRecentlyAdded())
      : //Add New Page Logic Here
      state.listType === "RecentlyUpdated"
      ? state.title !== undefined
        ? fetchMangaByTitle()
        : state.authorId !== undefined
        ? fetchMangaByAuthor()
        : state.tagId !== undefined
        ? fetchMangaByTag()
        : fetchMangaByRecentlyUpdated()
      : fetchMangaByRecentlyAdded()
        };
          

 useEffect(() => {
		fetchMangaCoverList();
	}, [offset, state]);
  return (
    <div>
      <Grid
        container
        direction="column"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Grid item sx={{ width: "100%" }}>
          <Header />
        </Grid>
        <Grid item>
          <Typography
            sx={{
              color: "white",
            }}
          >
            {state.listType}
          </Typography>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          wrap="wrap"
          spacing={1}
          sx={{
            overflow: "auto",
            height: { sm: "70vh", md: "85vh", lg: "82vh", xl: "82vh" },
            justifyContent: "center",
          }}
        >
          {recentlyUpdatedMangaDetails.map((element: any) => (
            <Grid item>
              <CoverClickable
                id={element["id"]}
                title={element["attributes"].title["en"]}
                coverId={
                  element["relationships"].find(
                    (i: any) => i.type === "cover_art"
                  ).id
                }
              />
            </Grid>
          ))}
        </Grid>
        <div>
          <Button
            sx={{
              color: "#333333",
              "&.MuiButtonBase-root:hover": {
                bgcolor: "transparent",
              },
              ".MuiTouchRipple-child": {
                backgroundColor: "white",
              },
            }}
            onClick={() => (offset - 60 >= 0 ? setOffset(offset - 60) : null)}
          >
            <ArrowBackIosNewIcon />
          </Button>
          <Button
            sx={{
              color: "#333333",
              "&.MuiButtonBase-root:hover": {
                bgcolor: "transparent",
              },
              ".MuiTouchRipple-child": {
                backgroundColor: "white",
              },
            }}
            onClick={() => {
              setOffset(offset + 60);
            }}
          >
            <ArrowForwardIosIcon />
          </Button>
        </div>
      </Grid>
    </div>
  );
          };
export default MangaCoverList;
