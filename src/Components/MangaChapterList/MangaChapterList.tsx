import { useEffect, useState } from "react";
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
  const [xsValue, setXsValue] = useState(6);

  const navigate = useNavigate();

  const handleClick = (
    mangaId: string,
    chapterId: string,
    title: string,
    volume: string,
    chapter: string,
    mangaName: string,
    chapterNumber: number,
    externalUrl: string,
    scanlationGroup: string,
  ) => {
    if (insideReader) {
      navigate("/reader", {
        state: {
          mangaId: mangaId,
          chapterId: chapterId,
          title: title,
          volume: volume,
          chapter: chapter,
          mangaName: mangaName,
          scanlationGroup: scanlationGroup,
        },
      });
      if (setOpen !== undefined) setOpen(false);
    } else {
      navigate("/reader", {
        state: {
          mangaId: mangaId,
          chapterId: chapterId,
          title: title,
          volume: volume,
          chapter: chapter,
          mangaName: mangaName,
          chapterNumber: chapterNumber,
          externalUrl: externalUrl,
          scanlationGroup: scanlationGroup,
        },
      });
    }
  };

  useEffect(() => {
    if (mangaFeed.length === 1) {
      setXsValue(12);
    }
  }, [mangaFeed]);

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
          current.attributes.translatedLanguage === selectedLanguage ? (
            <Grid item xs={xsValue} className="chapter-button-container">
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
                    current.id,
                    current.attributes.title,
                    current.attributes.volume,
                    current.attributes.chapter,
                    mangaName,
                    +current.attributes.chapter,
                    current.attributes.externalUrl,
                    current.relationships[0].type === "scanlation_group"
                      ? current.relationships[0].attributes.name
                      : "Unknown",
                  );
                }}
              >
                <div className="chapter-button-text">
                  <div className="info-stack">
                    <Typography
                      className="chapter-details"
                      sx={{
                        fontSize: { xs: 10, sm: 10, lg: 13 },
                      }}
                    >
                      Chapter {current.attributes.chapter}
                    </Typography>
                    <Typography
                      fontFamily="Figtree"
                      color="#fff"
                      sx={{
                        fontSize: { xs: 10, sm: 10, lg: 13 },
                      }}
                    >
                      {current.attributes.translatedLanguage}
                    </Typography>
                  </div>

                  <div className="info-stack">
                    <Typography
                      className="chapter-details"
                      sx={{
                        fontSize: { xs: 10, sm: 10, lg: 13 },
                      }}
                    >
                      {current.relationships[0].type === "scanlation_group"
                        ? current.relationships[0].attributes.name
                        : "Unknown"}
                    </Typography>

                    <Typography
                      className="chapter-details"
                      sx={{
                        fontSize: { xs: 10, sm: 10, lg: 13 },
                      }}
                    >
                      {dayjs(current.attributes.createdAt).format("DD/MM/YYYY")}
                    </Typography>
                  </div>
                </div>
              </Button>
            </Grid>
          ) : null,
        )}
      </Grid>
    </div>
  );
};

export default MangaChapterList;
