import { Grid, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import "./MangaChapterList.css";
import { MangaFeedScanlationGroup } from "../../interfaces/MangaDexInterfaces";

type Props = {
  mangaId: string;
  mangaFeed: MangaFeedScanlationGroup[];
  mangaName: string;
  selectedLanguage: string;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  insideReader: boolean;
};
const MangaChapterList = (props: Props) => {
  const {
    mangaId,
    mangaFeed,
    mangaName,
    selectedLanguage,
    insideReader,
    setOpen,
  } = props;

  const navigate = useNavigate();

  const handleClick = (
    mangaId: string,
    chapterId: string,
    title: string,
    volume: string,
    chapter: string,
    mangaName: string,
    chapterNumber: number,
  ) => {
    navigate("/reader", {
      state: {
        mangaId: mangaId,
        chapterId: chapterId,
        title: title,
        volume: volume,
        chapter: chapter,
        mangaName: mangaName,
        chapterNumber: chapterNumber,
      },
    });
  };

  const handleClickInsideReader = (
    mangaId: string,
    chapterId: string,
    title: string,
    volume: string,
    chapter: string,
    mangaName: string,
  ) => {
    //setCurrentPage(0);
    navigate("/reader", {
      state: {
        mangaId: mangaId,
        chapterId: chapterId,
        title: title,
        volume: volume,
        chapter: chapter,
        mangaName: mangaName,
      },
    });
  };

  return (
    <div className="manga-chapters">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        className="chapters-list"
      >
        {mangaFeed.map((current: MangaFeedScanlationGroup) =>
          current["attributes"]["translatedLanguage"] === selectedLanguage ? (
            <Grid item xs={6} className="chapter-button-container">
              {insideReader === true ? (
                <Button
                  disableRipple
                  className="chapter-button"
                  sx={{
                    backgroundColor: "#191919",
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                  onClick={() => {
                    handleClickInsideReader(
                      mangaId,
                      current["id"],
                      current["attributes"]["title"],
                      current["attributes"]["volume"],
                      current["attributes"]["chapter"],
                      mangaName,
                    );
                    if (setOpen !== undefined) setOpen(false);
                  }}
                >
                  <div className="chapter-button-text">
                    <Typography
                      sx={{
                        textTransform: "none",
                        fontFamily: "Figtree",
                        fontSize: { xs: 8, sm: 10, lg: 15 },
                      }}
                      color="#fff"
                    >
                      Chapter {current["attributes"].chapter}
                    </Typography>
                    <Typography
                      color="#fff"
                      sx={{
                        fontSize: { xs: 8, sm: 10, lg: 15 },
                        fontFamily: "Figtree",
                        paddingLeft: "10px",
                      }}
                    >
                      {current["attributes"].translatedLanguage}
                    </Typography>
                    <Typography
                      color="#fff"
                      sx={{
                        fontSize: { xs: 8, sm: 10, lg: 15 },
                        fontFamily: "Figtree",
                        paddingLeft: "10px",
                      }}
                    >
                      {current.relationships[0].attributes.name}
                    </Typography>

                    <Typography
                      color="#fff"
                      sx={{
                        fontFamily: "Figtree",
                        fontSize: { xs: 8, sm: 10, lg: 15 },
                      }}
                    >
                      {dayjs(current["attributes"].createdAt).format(
                        "DD/MM/YYYY / HH:mm",
                      )}
                    </Typography>
                  </div>
                </Button>
              ) : (
                <Button
                  className="chapter-button"
                  disableRipple
                  sx={{
                    backgroundColor: "#191919",
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                  onClick={() => {
                    handleClick(
                      mangaId,
                      current["id"],
                      current["attributes"]["title"],
                      current["attributes"]["volume"],
                      current["attributes"]["chapter"],
                      mangaName,
                      +current["attributes"]["chapter"],
                    );
                  }}
                >
                  <div className="chapter-button-text">
                    <Typography
                      sx={{
                        fontFamily: "Figtree",
                        textTransform: "none",
                        fontSize: { xs: 8, sm: 10, lg: 15 },
                      }}
                      color="#fff"
                    >
                      Chapter {current["attributes"].chapter}
                    </Typography>
                    <Typography
                      color="#fff"
                      sx={{
                        fontFamily: "Figtree",
                        fontSize: { xs: 8, sm: 10, lg: 15 },
                        paddingLeft: "10px",
                      }}
                    >
                      {current["attributes"].translatedLanguage}
                    </Typography>
                    <Typography
                      color="#fff"
                      sx={{
                        fontFamily: "Figtree",
                        fontSize: { xs: 8, sm: 10, lg: 15 },
                        paddingLeft: "10px",
                      }}
                    >
                      {current.relationships[0].attributes.name}
                    </Typography>

                    <Typography
                      color="#fff"
                      sx={{
                        fontFamily: "Figtree",
                        fontSize: { xs: 8, sm: 10, lg: 15 },
                      }}
                    >
                      {dayjs(current["attributes"].createdAt).format(
                        "DD/MM/YYYY / HH:mm",
                      )}
                    </Typography>
                  </div>
                </Button>
              )}
            </Grid>
          ) : null,
        )}
      </Grid>
    </div>
  );
};

export default MangaChapterList;
