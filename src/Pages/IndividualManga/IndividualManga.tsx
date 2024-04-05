import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  Grid,
  Alert,
} from "@mui/material";
import Header from "../../Components/Header/Header";
import MangaBanner from "../../Components/MangaBanner/MangaBanner";
import MangaTags from "../../Components/MangaTags/MangaTags";
import MangaControls from "../../Components/MangaControls/MangaControls";
import MangaChapterList from "../../Components/MangaChapterList/MangaChapterList";
import AddIcon from "@mui/icons-material/Add";
import {
  Relationship,
  Manga,
  CoverFile,
  MangaTagsInterface,
  MangaFeed,
} from "../../interfaces/MangaDexInterfaces";

import {
  fetchMangaByTitle,
  fetchMangaCover,
  fetchMangaFeed,
  fetchMangaById,
} from "../../api/MangaDexApi";

import "./IndividualManga.css";
import {
  addMangaFolderEntry,
  getMangaFolderEntries,
} from "../../api/MangaFolderEntry";
import { MangaFolderEntry } from "../../interfaces/MangaFolderEntriesInterfaces";
import { getMangaFolders } from "../../api/MangaFolder";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";

const IndividualManga = () => {
  const { state } = useLocation();
  const [mangaId, setMangaId] = useState<string>("");
  const [mangaFromMalCoverFile, setMangaFromMalCoverFile] =
    useState<string>("");
  const [mangaName, setMangaName] = useState("");
  const [mangaDescription, setMangaDescription] = useState("");
  const [mangaAltTitles, setMangaAltTitles] = useState<object[]>([]);
  const [mangaLanguages, setMangaLanguages] = useState<string[]>([]);
  const [mangaContentRating, setMangaContentRating] = useState("");
  const [mangaRaw, setMangaRaw] = useState("");
  const [mangaTags, setMangaTags] = useState<MangaTagsInterface[]>([]);
  const [mangaFeed, setMangaFeed] = useState<MangaFeed[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [currentOffset, setCurrentOffset] = useState(0);
  const [currentOrder, setCurrentOrder] = useState("asc");
  const [scantalationGroups, setScantalationGroups] = useState<object[]>([]);
  const [folders, setFolders] = useState<MangaFolder[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [mangaExistsError, setMangaExistsError] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMangaExistsError(false);
  };
  const handleAddToFolder = (folderId: number, mangaId: string) => {
    if (folderId !== undefined) {
      getMangaFolderEntries().then((response) => {
        let exists = false;
        response.map((current: MangaFolderEntry) => {
          console.log(current);
          console.log(folderId);
          console.log(mangaId);
          if (current.folderId === folderId && current.mangaId === mangaId) {
            exists = true;
          }
        });
        if (!exists) {
          addMangaFolderEntry({ folderId, mangaId }).then((data) => {
            console.log(data);
          });
          setMangaExistsError(false);
        } else {
          console.log("entry already exists");
          setMangaExistsError(true);
        }
      });
    } else {
      console.log("no folder chosen");
    }
  };

  useEffect(() => {
    const account = window.localStorage.getItem("account");
    const accountData = JSON.parse(account as string);
    if (accountData !== null) {
      getMangaFolders().then((response) => {
        console.log(response);
        setFolders(
          response.filter((folder) => folder.userId === accountData.id),
        );
      });
    }
    if (state["title"] !== undefined) {
      fetchMangaByTitle(state["title"], 10).then((data: Manga[]) => {
        console.log(data);
        setMangaId(data[0].id);
        setMangaName(data[0].attributes.title.en);
        setMangaDescription(data[0].attributes.description.en);
        setMangaAltTitles(data[0].attributes.altTitles);
        setMangaLanguages(data[0].attributes.availableTranslatedLanguages);
        setMangaContentRating(data[0].attributes.contentRating);
        setMangaRaw("");
        setMangaTags(data[0].attributes.tags);

        const coverArtRelationship = data[0].relationships.find(
          (i: Relationship) => i.type === "cover_art",
        );
        if (coverArtRelationship) {
          const coverArt = coverArtRelationship.id;
          fetchMangaCover(coverArt).then((coverFile: CoverFile) => {
            setMangaFromMalCoverFile(coverFile.attributes.fileName);
          });
        }
        fetchMangaFeed(
          data[0].id,
          50,
          currentOffset,
          currentOrder,
          selectedLanguage,
        ).then((data: MangaFeed[]) => {
          data.length === 0 ? setCurrentOffset(0) : setMangaFeed(data);

          setScantalationGroups([]);
          /**
						data.forEach((current: any) => {
							fetchScantalationGroup(current["relationships"][0]["id"]).then(
								(data) => {
									setScantalationGroups((scantalationGroups) => [
										...scantalationGroups,
										data["attributes"]["name"],
									]);
								}
							);
						}); */
          console.log(data);
        });
      });
      //fetchMangaByName();
    } else {
      fetchMangaById(state.id).then((data: Manga) => {
        console.log(data);
        setMangaName(data.attributes.title.en);
        setMangaDescription(data.attributes.description.en);
        setMangaAltTitles(data.attributes.altTitles);
        setMangaLanguages(data.attributes.availableTranslatedLanguages);
        setMangaContentRating(data.attributes.contentRating);

        setMangaRaw(
          data["attributes"].links === null ? "" : data["attributes"].links.raw,
        );

        setMangaTags(data["attributes"].tags);
      });
      fetchMangaFeed(
        state.id,
        50,
        currentOffset,
        currentOrder,
        selectedLanguage,
      ).then((data: MangaFeed[]) => {
        data.length === 0 ? setCurrentOffset(0) : setMangaFeed(data);
        /**
					setScantalationGroups([]);
					data.forEach((current: any) => {
						fetchScantalationGroup(current["relationships"][0]["id"]).then(
							(data) => {
								setScantalationGroups((scantalationGroups) => [
									...scantalationGroups,
									data["attributes"]["name"],
								]);
							}
						);
					});
				*/
      });
    }
  }, [state, selectedLanguage, currentOffset, currentOrder]);

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <MangaBanner
        title={state.title}
        id={state.id}
        coverFile={state.coverFile}
        mangaFromMal={mangaId}
        mangaFromMalCoverFile={mangaFromMalCoverFile}
        mangaAltTitles={mangaAltTitles}
        mangaDescription={mangaDescription}
        mangaContentRating={mangaContentRating}
        mangaName={mangaName}
      />

      <div>
        <MangaTags mangaTags={mangaTags} />
      </div>
      <div className="centered-content">
        <Button className="raw-button" href={mangaRaw}>
          <Typography noWrap color="#333333" sx={{ fontSize: 10 }}>
            RAW
          </Typography>
        </Button>
        <Button
          className="folder-add-button"
          disableFocusRipple
          onClick={() => {
            handleClickOpen();
          }}
        >
          <AddIcon />
        </Button>
        <Dialog open={open} onClose={handleClose} id="folder-dialog">
          <DialogTitle>Select Folder</DialogTitle>
          <DialogActions>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {folders.map((current: MangaFolder) => (
                <Grid item>
                  <Button
                    className="folder-button"
                    onClick={() => {
                      if (current.folderId !== undefined) {
                        handleAddToFolder(
                          current.folderId,
                          state.id === undefined ? mangaId : state.id,
                        );
                      }
                    }}
                  >
                    {current.folderName}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </DialogActions>
          {mangaExistsError === true ? (
            <Alert variant="outlined" severity="error">
              Manga already exists in the folder
            </Alert>
          ) : null}
        </Dialog>
      </div>
      <div className="controls-chapters-section">
        <div className="manga-controls">
          <MangaControls
            mangaLanguages={mangaLanguages}
            currentOffset={currentOffset}
            setCurrentOffset={setCurrentOffset}
            currentOrder={currentOrder}
            setCurrentOrder={setCurrentOrder}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            mangaTranslators={scantalationGroups}
            setTranslator={setScantalationGroups}
          />
        </div>
        <div className="manga-chapter-list">
          <MangaChapterList
            mangaFeed={mangaFeed}
            mangaName={mangaName}
            selectedLanguage={selectedLanguage}
            mangaId={state.id === undefined ? mangaId : state.id}
            insideReader={false}
            scantalationGroups={scantalationGroups}
          />
        </div>
      </div>
    </div>
  );
};

export default IndividualManga;
