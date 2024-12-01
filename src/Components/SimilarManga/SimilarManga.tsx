import { Typography, Grid, Button, Card, CardMedia } from "@mui/material";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import MangaDetailsDialog from "../MangaDetailsDialog/MangaDetailsDialog";
import { Relationship } from "../../interfaces/MangaDexInterfaces";
import "./SimilarManga.css";
import { useNavigate } from "react-router-dom";
import { fetchMangaCoverBackend } from "../../api/MangaDexApi";
import { useEffect, useState } from "react";

type Props = {
  manga: Manga[];
  accountId: number | null;
  contentFilter: number;
};
const SimilarManga = (props: Props) => {
  const { manga, accountId, contentFilter } = props;
  const navigate = useNavigate();
  const [coverUrls, setCoverUrls] = useState<{ [key: string]: string }>({});
  const [mangaDetailsToDisplay, setMangaDetailsToDisplay] = useState<Manga>();
  const [mangaCoverToDisplay, setMangaCoverToDisplay] = useState<string>();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const handleMangaClicked = (manga: Manga, cover: string) => {
    setOpenDetailsDialog(true);
    setMangaDetailsToDisplay(manga);
    setMangaCoverToDisplay(cover);
  };
  const handleDetailsDialogClose = () => {
    setOpenDetailsDialog(false);
  };

  const handleClick = (id: string) => {
    handleDetailsDialogClose();
    navigate(`/manga/${id}`, {});
  };

  useEffect(() => {
    const fetchCoverImages = async () => {
      for (const mangaCurrent of manga) {
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
    if (manga.length > 0) {
      fetchCoverImages();
    }
  }, [manga]);

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

      <Grid container spacing={1} className="similar-manga-grid-container">
        {manga.map((current) => (
          <>
            <Grid item className="similar-manga-grid-item">
              <Button
                className="similar-manga-button"
                onClick={() => {
                  handleMangaClicked(current, coverUrls[current.id]);
                }}
              >
                <Card
                  sx={{
                    minWidth: "80px",
                    height: "110px",
                  }}
                >
                  <CardMedia
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                    image={coverUrls[current.id]}
                  />
                </Card>
                <div className="similar-manga-text">
                  <Typography className="similar-manga-name">
                    {current.attributes.title.en === undefined
                      ? Object.values(current.attributes.title)[0]
                      : current.attributes.title.en}
                  </Typography>
                  <Typography className="similar-manga-details">
                    {current.attributes.status}
                  </Typography>
                  <Typography className="similar-manga-details">
                    {current.attributes.contentRating}
                  </Typography>
                </div>
              </Button>
            </Grid>
          </>
        ))}
      </Grid>
    </>
  );
};

export default SimilarManga;
