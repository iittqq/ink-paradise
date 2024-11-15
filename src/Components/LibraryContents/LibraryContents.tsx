import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Button } from "@mui/material";
import { Manga, Relationship } from "../../interfaces/MangaDexInterfaces";
import MangaClickable from "../MangaClickable/MangaClickable";
import "./LibraryContents.css";
import { fetchMangaCoverBackend } from "../../api/MangaDexApi";

type Props = {
  libraryManga: Manga[];
  groupedLibraryManga: Manga[][] | null;
  currentMetric: string | null;
  handleLibraryEntryClick: (manga: Manga) => void;
  checked: boolean;
  libraryEntriesToDelete: string[];
  selectAll: boolean;
  accountId: number;
  contentFilter: number;
};

const LibraryContents = (props: Props) => {
  const {
    libraryManga,
    groupedLibraryManga,
    currentMetric,
    handleLibraryEntryClick,
    checked,
    libraryEntriesToDelete,
    selectAll,
    accountId,
    contentFilter,
  } = props;
  const navigate = useNavigate();

  const [coverUrlsLibrary, setCoverUrlsLibrary] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    const fetchCoverImagesLibrary = async () => {
      const coverUrlsLibrary: { [key: string]: string } = {};
      for (const manga of libraryManga) {
        const fileName = manga.relationships.find(
          (i: Relationship) => i.type === "cover_art",
        )?.attributes?.fileName;
        if (fileName) {
          const imageBlob = await fetchMangaCoverBackend(manga.id, fileName);
          coverUrlsLibrary[manga.id] = URL.createObjectURL(imageBlob);
          setCoverUrlsLibrary((prevCoverUrls) => ({
            ...prevCoverUrls,
            [manga.id]: URL.createObjectURL(imageBlob),
          }));
        }
      }
    };
    if (libraryManga.length > 0) {
      fetchCoverImagesLibrary();
    }
  }, [libraryManga]);

  return (
    <div className="library-entries-container">
      <Grid
        container
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        wrap={"wrap"}
        spacing={1}
      >
        {libraryManga.length === 0 ? (
          <Button
            className="redirect-button"
            onClick={() => {
              navigate("/", { state: { accountId: accountId } });
            }}
          >
            <Typography fontFamily="Figtree">Start Browsing</Typography>
          </Button>
        ) : null}
        {groupedLibraryManga !== null
          ? currentMetric === "Content Rating"
            ? groupedLibraryManga.map((currentRating: Manga[]) => (
                <>
                  <Typography
                    fontFamily={"Figtree"}
                    sx={{
                      marginTop: "20px",
                      width: "100%",
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {currentRating[0].attributes.contentRating}
                  </Typography>
                  {currentRating.map((manga: Manga) => (
                    <Grid item key={manga.id}>
                      <Button
                        className="manga-entry-overlay-button"
                        onClick={() => handleLibraryEntryClick(manga)}
                        sx={{
                          opacity: libraryEntriesToDelete.includes(manga.id)
                            ? 0.2
                            : 1,
                        }}
                      >
                        <MangaClickable
                          manga={manga}
                          id={manga.id}
                          title={
                            manga.attributes.title.en === undefined
                              ? Object.values(manga.attributes.title)[0]
                              : manga.attributes.title.en
                          }
                          coverUrl={coverUrlsLibrary[manga.id]}
                          disabled={checked || selectAll}
                          accountId={accountId}
                          contentFilter={contentFilter}
                        />
                      </Button>
                    </Grid>
                  ))}
                </>
              ))
            : groupedLibraryManga.map((demographic: Manga[]) => (
                <>
                  <Typography
                    fontFamily={"Figtree"}
                    sx={{
                      marginTop: "20px",
                      width: "100%",
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {demographic[0].attributes.publicationDemographic !== null
                      ? demographic[0].attributes.publicationDemographic
                      : "unknown"}
                  </Typography>
                  {demographic.map((manga: Manga) => (
                    <Grid item key={manga.id}>
                      <Button
                        className="manga-entry-overlay-button"
                        onClick={() => handleLibraryEntryClick(manga)}
                        sx={{
                          opacity: libraryEntriesToDelete.includes(manga.id)
                            ? 0.2
                            : 1,
                        }}
                      >
                        <MangaClickable
                          manga={manga}
                          id={manga.id}
                          title={
                            manga.attributes.title.en === undefined
                              ? Object.values(manga.attributes.title)[0]
                              : manga.attributes.title.en
                          }
                          coverUrl={coverUrlsLibrary[manga.id]}
                          disabled={checked || selectAll}
                          accountId={accountId}
                          contentFilter={contentFilter}
                        />
                      </Button>
                    </Grid>
                  ))}
                </>
              ))
          : libraryManga.map((manga: Manga) => (
              <Grid item>
                <Button
                  className="manga-entry-overlay-button"
                  onClick={() => {
                    handleLibraryEntryClick(manga);
                  }}
                  sx={{
                    opacity: libraryEntriesToDelete.includes(manga.id)
                      ? 0.2
                      : 1,
                  }}
                >
                  <MangaClickable
                    manga={manga}
                    id={manga.id}
                    title={
                      manga.attributes.title.en === undefined
                        ? Object.values(manga.attributes.title)[0]
                        : manga.attributes.title.en
                    }
                    coverUrl={coverUrlsLibrary[manga.id]}
                    disabled={checked || selectAll}
                    accountId={accountId}
                    contentFilter={contentFilter}
                  />
                </Button>
              </Grid>
            ))}
      </Grid>
    </div>
  );
};

export default LibraryContents;
