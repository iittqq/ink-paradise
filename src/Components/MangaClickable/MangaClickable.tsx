import { useState } from "react";
import { Card, CardMedia, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchAccountDetails } from "../../api/AccountDetails";
import { AccountDetails } from "../../interfaces/AccountDetailsInterfaces";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import MangaDetailsDialog from "../MangaDetailsDialog/MangaDetailsDialog";

import "./MangaClickable.css";

type Props = {
  manga: Manga;
  id?: string;
  title: string;
  coverUrl?: string;
  disabled?: boolean;
  accountId: number;
};

const MangaClickable = (props: Props) => {
  const navigate = useNavigate();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [mangaDetailsToDisplay, setMangaDetailsToDisplay] = useState<Manga>();
  const [mangaCoverToDisplay, setMangaCoverToDisplay] = useState<string>();

  const { manga, title, coverUrl, disabled, accountId } = props;

  const handleClick = (id: string, coverUrl: string) => {
    const encodedCoverUrl = encodeURIComponent(coverUrl!);
    console.log("id: ", id);
    console.log("coverUrl", coverUrl);
    if (accountId !== null) {
      fetchAccountDetails(accountId).then((response: AccountDetails) => {
        navigate(`/individualView/${id}/${encodedCoverUrl}`, {
          state: {
            accountId: accountId,
            contentFilter: response.contentFilter,
          },
        });
      });
    } else {
      navigate(`/individualView/${id}/${encodedCoverUrl}`, {
        state: { accountId: accountId, contentFilter: 3 },
      });
    }
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
