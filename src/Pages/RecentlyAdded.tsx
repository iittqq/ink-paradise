import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  IconButton,
  ButtonGroup,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import Header from "../Components/Header";
import axios from "axios";
import CoverClickable from "../Components/CoverClickable";
import dayjs from "dayjs";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { off } from "process";
import { ConstructionRounded } from "@mui/icons-material";

const RecentlyAdded = () => {
  const [mangaDetails, setMangaDetails] = useState<any[]>([]);
  const [offsetState, setOffsetState] = useState<number>(0);
  const baseUrl = "https://api.mangadex.org";
  const fetchRecentlyAddedManga = async () => {
    const { data } = await axios.get(`${baseUrl}/manga`, {
      params: {
        order: { createdAt: "desc" },
        limit: 60,
        offset: offsetState,
        contentRating: ["safe", "suggestive", "erotica"],
      },
    });

    setMangaDetails(data.data);


    console.log(data.data);
  };


  const customTheme = createTheme({
    palette: {
      primary: { main: "#121212" },
      secondary: { main: "#FFEEF4" },
    },
  });


  useEffect(() => {
    fetchRecentlyAddedManga();
    console.log(offsetState)
  }, [offsetState]);
 
  const handleLeft = () =>
    offsetState !== 0 ? setOffsetState((a) => a - 60): null;

  const handleRight = () =>
     setOffsetState((a) => a + 60);
  
  return (
    <Container disableGutters sx={{ minWidth: "100%", minHeight: "100vh" }}>
      <Grid
        container
        direction="column"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Grid item sx={{ paddingTop: "1vh", width: "100%" }}>
          <Header />
        </Grid>
        <Grid item>
          <Typography
            sx={{ paddingTop: "25px", paddingBottom: "25px", color: "white" }}
          >
            Recently Added
          </Typography>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          wrap="wrap"
          spacing={1}
          sx={{
            overflow: "auto",
            height: "80vh",
            scrollbarWidth: "none",
            justifyContent: "center",
          }}
        >
          {mangaDetails.map((element, index) => (
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
        <ThemeProvider theme={customTheme}>
          <ButtonGroup
            variant="text"
            aria-label="text button group"
            color="primary"
          >
            <IconButton 
            onClick={()=>handleLeft()}
            >
              <ArrowBackIosNewIcon
               sx={{ color: "white" }} 
               />
            </IconButton>
            <IconButton
            onClick={()=>handleRight()}
            >
              <ArrowForwardIosIcon 
              sx={{ color: "white" }} 
              />
            </IconButton>
          </ButtonGroup>
        </ThemeProvider>
      </Grid>
    </Container>
  );
};

export default RecentlyAdded;
