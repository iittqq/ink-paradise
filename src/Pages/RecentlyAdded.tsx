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
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type Props = {
  title: string;
};

const RecentlyAdded = (props: Props) => {
  const { title } = props;
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
    console.log(offsetState);
  }, [offsetState]);

  const handleLeft = () =>
    offsetState !== 0 ? setOffsetState((a) => a - 30) : null;

  const handleRight = () => setOffsetState((a) => a + 30);

  return (
    <Container
      disableGutters
      sx={{
        minWidth: "100%",
        minHeight: "100vh",
      }}
    >
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
            fontSize={30}
            sx={{
              paddingTop: "0px",
              paddingBottom: "0px",
              color: "white",
            }}
          >
            {title}
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
            scrollbarWidth: "none",
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {mangaDetails.map((element, any) => (
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
            sx={{ paddingTop: "10px" }}
          >
            <IconButton onClick={() => handleLeft()}>
              <ArrowBackIosNewIcon sx={{ color: "white" }} />
            </IconButton>
            <IconButton onClick={() => handleRight()}>
              <ArrowForwardIosIcon sx={{ color: "white" }} />
            </IconButton>
          </ButtonGroup>
        </ThemeProvider>
      </Grid>
    </Container>
  );
};

export default RecentlyAdded;
