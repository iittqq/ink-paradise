import { useState } from "react";
import { Card, CardMedia, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import MangaDetailsDialog from "../MangaDetailsDialog/MangaDetailsDialog";

import "./MangaClickable.css";

type Props = {
  manga: Manga;
  id?: string;
  title: string;
  coverUrl?: string;
  disabled?: boolean;
  accountId: number | null;
  contentFilter: number;
};

const MangaClickable = (props: Props) => {
  const navigate = useNavigate();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [mangaDetailsToDisplay, setMangaDetailsToDisplay] = useState<Manga>();
  const [mangaCoverToDisplay, setMangaCoverToDisplay] = useState<string>();

  const { manga, title, coverUrl, disabled, accountId, contentFilter } = props;

  const handleClick = (id: string) => {
    console.log("id: ", id);
    console.log(accountId);
    navigate(`/manga/${id}`);
  };
  const handleDetailsDialogClose = () => {
    setOpenDetailsDialog(false);
  };

  const handleMangaClicked = (mangaData: Manga, cover: string) => {
    setOpenDetailsDialog(true);
    setMangaDetailsToDisplay(mangaData);
    setMangaCoverToDisplay(cover);
  };

  return (
    <>
      {mangaDetailsToDisplay && (
        <MangaDetailsDialog
          mangaDetails={mangaDetailsToDisplay}
          openDetailsDialog={openDetailsDialog}
          handleDetailsDialogClose={handleDetailsDialogClose}
          coverUrl={mangaCoverToDisplay!}
          handleClick={handleClick}
          accountId={accountId}
          contentFilter={contentFilter}
        />
      )}

      <Button
        className="manga-button"
        disabled={disabled && disabled != undefined ? true : false}
        onClick={() => {
          handleMangaClicked(manga, coverUrl!);
        }}
      >
        <Card
          sx={{
            width: { xs: "90px", sm: "130px", md: "130px", lg: "130px" },
            height: { xs: "140px", sm: "200px", md: "200px", lg: "200px" },
            position: "relative",
          }}
        >
          <CardMedia
            sx={{
              width: "100%",
              height: "100%",
            }}
            image={coverUrl}
          />
        </Card>

        <div className="overlay">
          <div className="chapter-count-number">
            {manga.latestChapter &&
            manga.chapterNumber !== null &&
            manga.chapterNumber !== undefined
              ? Math.max(
                  0,
                  Math.floor(
                    Number(manga.latestChapter[0]?.attributes?.chapter) -
                      manga.chapterNumber,
                  ),
                )
              : null}
          </div>
          <Typography
            textTransform="none"
            color="white"
            className="overlay-title"
          >
            {title}
          </Typography>
        </div>
      </Button>
    </>
  );
};

export default MangaClickable;
