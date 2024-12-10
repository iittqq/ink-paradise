import { useEffect, useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Reading } from "../../interfaces/ReadingInterfaces";
import { getReadingByUserId } from "../../api/Reading";
import { useNavigate } from "react-router-dom";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

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
  accountId: number | null;
  contentFilter: number;
  sortOrder: string;
  oneshot?: boolean;
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
    accountId,
    contentFilter,
    sortOrder,
    oneshot,
  } = props;
  const [xsValue] = useState(
    window.innerWidth > 900 ? 2 : mangaFeed.length === 1 ? 12 : 6,
  );
  const [userProgress, setUserProgress] = useState<number | null>(null);

  const navigate = useNavigate();

  const handleClick = (
    mangaId: string,
    chapterId: string,
    title: string,
    volume: string,
    chapterNumber: number,
    mangaName: string,
    externalUrl: string,
    scanlationGroup: string,
    coverUrl: string,
    mangaFeed: MangaFeedScanlationGroup[],
    index: number,
  ) => {
    console.log(mangaId);
    if (insideReader) {
      console.log();
      navigate("/reader", {
        state: {
          mangaId: mangaId,
          chapterId: chapterId,
          title: title,
          volume: volume,
          chapterNumber: chapterNumber,
          mangaName: mangaName,
          scanlationGroup: scanlationGroup,
          coverUrl: coverUrl,
          accountId: accountId,
          mangaFeed: mangaFeed,
          chapterIndex: index,
          contentFilter: contentFilter,
          sortOrder: sortOrder,
          pageNumber: 0,
          oneshot: oneshot,
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
          chapterNumber: chapterNumber,
          mangaName: mangaName,
          externalUrl: externalUrl,
          scanlationGroup: scanlationGroup,
          coverUrl: coverUrl,
          accountId: accountId,
          mangaFeed: mangaFeed,
          chapterIndex: index,
          contentFilter: contentFilter,
          sortOrder: sortOrder,
          oneshot: oneshot,
        },
      });
    }
  };

  useEffect(() => {
    setUserProgress(null);
    if (accountId !== null) {
      getReadingByUserId(accountId).then((data: Reading[]) => {
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
        spacing={1}
      >
        {mangaFeed.map((current: MangaFeedScanlationGroup, index: number) =>
          current.attributes.translatedLanguage === selectedLanguage ? (
            <Grid item xs={xsValue} className="chapter-button-container">
              <Button
                className="chapter-button"
                disableRipple
                sx={{
                  outline:
                    Number(current.attributes.chapter) ===
                      Number(userProgress) && userProgress !== null
                      ? "2px solid #8E8E8E !important"
                      : "none",
                  opacity:
                    Number(current.attributes.chapter) < Number(userProgress)
                      ? ".7"
                      : "unset",
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
                      parseFloat(current.attributes.chapter),
                      mangaName,
                      current.attributes.externalUrl,
                      current.relationships[0].type === "scanlation_group"
                        ? current.relationships[0].attributes.name
                        : "Unknown",
                      coverUrl,
                      mangaFeed,
                      index,
                    );
                  }
                }}
              >
                <div className="info-stack">
                  <div className="chapter-row">
                    <AutoStoriesIcon />
                    <Typography
                      className="chapter-details"
                      sx={{
                        fontSize: { xs: 12, sm: 12, lg: 14 },
                        textTransform: "none",
                      }}
                    >
                      {oneshot === true
                        ? "Oneshot"
                        : "Ch " + current.attributes.chapter}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      className="scanlation-name"
                      sx={{
                        fontSize: { xs: 12, sm: 12, lg: 14 },
                        textTransform: "none",
                      }}
                    >
                      {current.attributes.title}
                    </Typography>
                  </div>
                </div>
                {current.attributes.externalUrl !== null ? (
                  <div className="external-link-button">
                    <OpenInNewIcon />
                  </div>
                ) : null}
              </Button>
            </Grid>
          ) : null,
        )}
      </Grid>
    </div>
  );
};

export default MangaChapterList;
