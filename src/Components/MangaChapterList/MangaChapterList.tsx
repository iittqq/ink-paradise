import { useEffect, useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Reading } from "../../interfaces/ReadingInterfaces";
import { getReadingByUserId } from "../../api/Reading";
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
  coverUrl: string;
};
const MangaChapterList = (props: Props) => {
  const {
    mangaId,
    mangaFeed,
    mangaName,
    selectedLanguage,
    insideReader,
    setOpen,
    coverUrl,
  } = props;
  const [xsValue, setXsValue] = useState(6);
  const [userProgress, setUserProgress] = useState<number>(0);

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
    coverUrl: string,
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
          coverUrl: coverUrl,
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
          coverUrl: coverUrl,
        },
      });
    }
  };

  useEffect(() => {
    if (mangaFeed.length === 1) {
      setXsValue(12);
    } else {
      setXsValue(6);
    }
    setUserProgress(0);
    const account = window.localStorage.getItem("accountId") as string | null;
    if (account !== null) {
      getReadingByUserId(parseInt(account)).then((data: Reading[]) => {
        data
          .filter((reading: Reading) => reading.mangaId === mangaId)
          .map((reading: Reading) => {
            setUserProgress(reading.chapter);
          });
      });
    }
  }, [mangaFeed, mangaId]);

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
                  backgroundColor:
                    Number(current.attributes.chapter) < Number(userProgress)
                      ? "#191919"
                      : Number(current.attributes.chapter) ===
                          Number(userProgress)
                        ? "#ff7597"
                        : "#333333",
                  "&:hover": { backgroundColor: "transparent" },
                }}
                onClick={() => {
                  if (current.attributes.externalUrl !== null) {
                    window.location.replace(current.attributes.externalUrl);
                  } else {
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
                      coverUrl,
                    );
                  }
                }}
              >
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
                {current.attributes.externalUrl !== null ? (
                  <div className="external-link-button">
                    <OpenInNewIcon />
                  </div>
                ) : null}
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
              </Button>
            </Grid>
          ) : null,
        )}
      </Grid>
    </div>
  );
};

export default MangaChapterList;
