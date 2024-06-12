import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import Header from "../../Components/Header/Header";
import MangaBanner from "../../Components/MangaBanner/MangaBanner";
import MangaControls from "../../Components/MangaControls/MangaControls";
import MangaChapterList from "../../Components/MangaChapterList/MangaChapterList";
import MangaPageButtonHeader from "../../Components/MangaPageButtonHeader/MangaPageButtonHeader";
import {
  Manga,
  MangaTagsInterface,
  Relationship,
  ScanlationGroup,
  MangaFeedScanlationGroup,
} from "../../interfaces/MangaDexInterfaces";

import { fetchMangaFeed, fetchMangaById } from "../../api/MangaDexApi";

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
    });
    if (
      currentOffset !== mangaFeed.length ||
      currentOffset === 0 ||
      currentOffset === 100
    ) {
      fetchMangaFeed(
        state.id,
        100,
        currentOffset,
        currentOrder,
        selectedLanguage,
      ).then((data: MangaFeedScanlationGroup[]) => {
        data.length === 0
          ? setCurrentOffset(0)
          : switchedOrder === true || currentOffset === 0
            ? setMangaFeed(data)
            : setMangaFeed((mangaFeed) => [...mangaFeed, ...data]);

        const promises = data.map(
          (current: MangaFeedScanlationGroup) =>
            current.relationships.filter(
              (rel: Relationship) => rel.type === "scanlation_group",
            )[0],
        );
        Promise.all(promises).then((data) => {
          setScanlationGroups((scanlationGroups) => [
            ...scanlationGroups,
            ...new Set(
              data.filter(function (element) {
                return element !== undefined;
              }),
            ),
          ]);
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
    setSwitchedOrder(false);
  }, [
    state,
    selectedLanguage,
    currentOffset,
    currentOrder,
    selectedScanlationGroup,
  ]);

  return (
    <div>
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
        id={state.id}
        coverFile={state.coverFile}
        mangaDescription={mangaDescription}
        mangaName={mangaName}
      />

      <div className="controls-chapters-section">
        <MangaControls
          mangaLanguages={mangaLanguages}
          setCurrentOffset={setCurrentOffset}
          currentOrder={currentOrder}
          setCurrentOrder={setCurrentOrder}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          mangaTranslators={scanlationGroups}
          setTranslator={setScanlationGroups}
          handleSwitchOrder={handleSwitchOrder}
          handleFilterScanlationGroups={handleFilterScanlationGroups}
        />
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
      </div>
    </div>
  );
};

export default IndividualManga;
