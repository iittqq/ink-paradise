import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import Header from "../../Components/Header/Header";
import MangaBanner from "../../Components/MangaBanner/MangaBanner";
import MangaControls from "../../Components/MangaControls/MangaControls";
import MangaChapterList from "../../Components/MangaChapterList/MangaChapterList";
import MangaPageButtonHeader from "../../Components/MangaPageButtonHeader/MangaPageButtonHeader";
import SimilarManga from "../../Components/SimilarManga/SimilarManga";
import {
  Manga,
  MangaTagsInterface,
  Relationship,
  ScanlationGroup,
  MangaFeedScanlationGroup,
} from "../../interfaces/MangaDexInterfaces";

import {
  fetchMangaFeed,
  fetchMangaById,
  fetchSimilarManga,
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

  const [mangaName, setMangaName] = useState("");
  const [mangaDescription, setMangaDescription] = useState("");
  const [mangaAltTitles, setMangaAltTitles] = useState<object[]>([]);
  const [mangaLanguages, setMangaLanguages] = useState<string[]>([]);
  const [mangaContentRating, setMangaContentRating] = useState("");
  const [mangaRaw, setMangaRaw] = useState("");
  const [mangaTags, setMangaTags] = useState<MangaTagsInterface[]>([]);
  const [mangaFeed, setMangaFeed] = useState<MangaFeedScanlationGroup[]>([]);
  const [filteredMangaFeed, setFilteredMangaFeed] = useState<
    MangaFeedScanlationGroup[] | undefined
  >(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [currentOffset, setCurrentOffset] = useState(0);
  const [currentOrder, setCurrentOrder] = useState("asc");
  const [scanlationGroups, setScanlationGroups] = useState<ScanlationGroup[]>(
    [],
  );
  const [selectedScanlationGroup, setSelectedScanlationGroup] = useState<
    ScanlationGroup | undefined
  >();
  const [folders, setFolders] = useState<MangaFolder[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [mangaExistsError, setMangaExistsError] = useState<boolean>(false);
  const [showInfoToggled, setShowInfoToggled] = useState(false);
  const [showCategoriesToggled, setShowCategoriesToggled] = useState(false);
  const [switchedOrder, setSwitchedOrder] = useState<boolean>(false);
  const [similarManga, setSimilarManga] = useState<Manga[]>([]);
  const [previousLanguage, setPreviousLanguage] = useState<string>("en");
  const [previousId, setPreviousId] = useState<string>("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSwitchOrder = () => {
    setSwitchedOrder(true);
    setCurrentOffset(0);
  };

  const handleCloseCategories = () => {
    setShowCategoriesToggled(false);
  };

  const handleOpenCategories = () => {
    setShowCategoriesToggled(true);
  };

  const handleOpenInfo = () => {
    setShowInfoToggled(true);
  };

  const handleCloseInfo = () => {
    setShowInfoToggled(false);
  };

  const handleClose = () => {
    setOpen(false);
    setMangaExistsError(false);
  };
  const handleFilterScanlationGroups = (
    scanlationGroup: ScanlationGroup | undefined,
  ) => {
    if (scanlationGroup !== undefined) {
      setSelectedScanlationGroup(scanlationGroup);
    } else {
      setSelectedScanlationGroup(undefined);
    }
  };

  const handleClickedLanguageButton = (language: string) => {
    setSelectedLanguage(language);
    setSelectedScanlationGroup(undefined);
    setCurrentOffset(0);
  };
  const handleAddToFolder = (folderId: number, mangaId: string) => {
    if (folderId !== undefined) {
      getMangaFolderEntries().then((response) => {
        let exists = false;
        response.map((current: MangaFolderEntry) => {
          if (current.folderId === folderId && current.mangaId === mangaId) {
            exists = true;
          }
        });
        if (!exists) {
          addMangaFolderEntry({ folderId, mangaId });
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

  const handleShowMore = () => {
    setSelectedScanlationGroup(undefined);
    setCurrentOffset(currentOffset + 100);
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
    fetchMangaById(state.id).then((data: Manga) => {
      console.log(data);
      setMangaName(data.attributes.title.en);
      setMangaDescription(data.attributes.description.en);
      setMangaAltTitles(data.attributes.altTitles);
      setMangaLanguages(data.attributes.availableTranslatedLanguages);
      setMangaContentRating(data.attributes.contentRating);

      console.log(data.attributes.availableTranslatedLanguages);
      setMangaRaw(
        data["attributes"].links === null ? "" : data["attributes"].links.raw,
      );

      setMangaTags(data["attributes"].tags);
      const tagIds = data["attributes"].tags.map((tag) => tag.id);
      console.log(tagIds);
      fetchSimilarManga(10, tagIds).then((data: Manga[]) => {
        console.log(data);
        setSimilarManga(data);
      });
    });
    console.log(currentOffset);
    console.log(selectedScanlationGroup);
    if (
      currentOffset <= mangaFeed.length &&
      selectedScanlationGroup === undefined
    ) {
      fetchMangaFeed(
        state.id,
        100,
        currentOffset,
        currentOrder,
        selectedLanguage,
      ).then((data: MangaFeedScanlationGroup[]) => {
        data.length === 0 ? setCurrentOffset(0) : switchedOrder === true;
        if (previousLanguage !== selectedLanguage || state.id !== previousId) {
          setMangaFeed(data);
        } else {
          setMangaFeed((mangaFeed) => [...mangaFeed, ...data]);
        }

        const promises = data.map(
          (current: MangaFeedScanlationGroup) =>
            current.relationships.filter(
              (rel: Relationship) => rel.type === "scanlation_group",
            )[0],
        );
        Promise.all(promises).then((data) => {
          if (
            previousLanguage !== selectedLanguage ||
            state.id !== previousId
          ) {
            setScanlationGroups([
              ...new Set(data.filter((element) => element !== undefined)),
            ]);
          } else {
            setScanlationGroups((scanlationGroups) => [
              ...scanlationGroups,
              ...new Set(data.filter((element) => element !== undefined)),
            ]);
          }
        });
      });
    }
    if (selectedScanlationGroup !== undefined) {
      const filteredFeed: MangaFeedScanlationGroup[] = [];
      mangaFeed.map((current: MangaFeedScanlationGroup) => {
        if (Array.isArray(current.relationships)) {
          const hasMatchingGroup = current.relationships.some(
            (rel: Relationship) => rel.id === selectedScanlationGroup.id,
          );
          if (hasMatchingGroup) {
            filteredFeed.push(current);
          }
        }
      });
      setFilteredMangaFeed(filteredFeed);
    }
    setPreviousLanguage(selectedLanguage);
    setPreviousId(state.id);
    setSwitchedOrder(false);
  }, [
    state,
    selectedLanguage,
    currentOffset,
    currentOrder,
    selectedScanlationGroup,
  ]);

  return (
    <div className="individual-page-container">
      <div className="header">
        <Header />
      </div>
      <div>
        <MangaPageButtonHeader
          mangaRaw={mangaRaw}
          folders={folders}
          mangaAltTitles={mangaAltTitles}
          mangaTags={mangaTags}
          id={state.id}
          handleAddToFolder={handleAddToFolder}
          handleClickOpen={handleClickOpen}
          handleCloseCategories={handleCloseCategories}
          handleCloseInfo={handleCloseInfo}
          handleOpenCategories={handleOpenCategories}
          handleOpenInfo={handleOpenInfo}
          open={open}
          showInfoToggled={showInfoToggled}
          showCategoriesToggled={showCategoriesToggled}
          mangaExistsError={mangaExistsError}
          handleClose={handleClose}
          mangaContentRating={mangaContentRating}
        />{" "}
      </div>

      <MangaBanner
        coverUrl={state.coverUrl}
        mangaDescription={mangaDescription}
        mangaName={mangaName}
      />

      <div className="controls-chapters-section">
        <MangaControls
          mangaLanguages={mangaLanguages}
          currentOrder={currentOrder}
          setCurrentOrder={setCurrentOrder}
          selectedLanguage={selectedLanguage}
          handleClickedLanguageButton={handleClickedLanguageButton}
          mangaTranslators={scanlationGroups}
          setTranslator={setScanlationGroups}
          handleSwitchOrder={handleSwitchOrder}
          handleFilterScanlationGroups={handleFilterScanlationGroups}
        />
        <div className="bottom-desktop-container">
          <div className="manga-chapter-list">
            <MangaChapterList
              mangaFeed={
                selectedScanlationGroup !== undefined &&
                filteredMangaFeed !== undefined
                  ? filteredMangaFeed
                  : mangaFeed
              }
              mangaName={mangaName}
              selectedLanguage={selectedLanguage}
              mangaId={state.id}
              insideReader={false}
            />

            <Button
              className="show-more-button"
              onClick={() => {
                handleShowMore();
              }}
            >
              {" "}
              Show More
            </Button>
          </div>
          <div className="similar-manga-section">
            <Typography fontSize={22} fontFamily="Figtree" align="center">
              Similar Manga
            </Typography>{" "}
            <div className="similar-manga">
              <SimilarManga manga={similarManga} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualManga;
