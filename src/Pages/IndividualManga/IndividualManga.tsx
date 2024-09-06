import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  const { id, coverUrl } = useParams();
  const navigate = useNavigate();

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
  const [similarManga, setSimilarManga] = useState<Manga[]>([]);
  const [previousLanguage, setPreviousLanguage] = useState<string>("en");
  const [previousId, setPreviousId] = useState<string>("");
  const [mangaAddedAlert, setMangaAddedAlert] = useState<boolean>(false);
  const { state } = useLocation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSwitchOrder = () => {
    if (currentOrder === "asc") {
      setCurrentOrder("desc");
    } else {
      setCurrentOrder("asc");
    }
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
          setMangaAddedAlert(true);
          setTimeout(() => {
            setMangaAddedAlert(false);
          }, 3000);
        } else {
          setMangaExistsError(true);
          setTimeout(() => {
            setMangaExistsError(false);
          }, 3000);
        }
      });
    }
  };

  const handleMangaCategoryClicked = (category: MangaTagsInterface) => {
    fetchSimilarManga(25, 0, [category.id], state.contentFilter).then(
      (data: Manga[]) => {
        navigate("/mangaCoverList", {
          state: {
            listType: category.attributes.name.en,
            manga: data,
            accountId: state.accountId,
          },
        });
      },
    );
  };

  const handleShowMore = () => {
    setSelectedScanlationGroup(undefined);
    setCurrentOffset(currentOffset + 100);
  };

  useEffect(() => {
    console.log(state);
    if (state.accountId !== null) {
      getMangaFolders().then((response) => {
        console.log(response);
        setFolders(
          response.filter((folder) => folder.userId === state.accountId),
        );
      });
    }
    if (id !== undefined) {
      fetchMangaById(id).then((data: Manga) => {
        setMangaName(
          data.attributes.title.en === undefined
            ? Object.values(data.attributes.title)[0]
            : data.attributes.title.en,
        );
        setMangaDescription(data.attributes.description.en);
        setMangaAltTitles(data.attributes.altTitles);
        setMangaLanguages(data.attributes.availableTranslatedLanguages);
        setMangaContentRating(data.attributes.contentRating);

        setMangaRaw(
          data["attributes"].links === null ? "" : data["attributes"].links.raw,
        );

        setMangaTags(data["attributes"].tags);
        const tagIds = data["attributes"].tags.map((tag) => tag.id);
        fetchSimilarManga(10, 0, tagIds, state.contentFilter).then(
          (data: Manga[]) => {
            setSimilarManga(data);
          },
        );
      });

      if (
        currentOffset <= mangaFeed.length &&
        selectedScanlationGroup === undefined
      ) {
        fetchMangaFeed(
          id,
          100,
          currentOffset,
          currentOrder,
          selectedLanguage,
        ).then((data: MangaFeedScanlationGroup[]) => {
          data.length === 0 ? setCurrentOffset(0) : null;
          if (
            previousLanguage !== selectedLanguage ||
            id !== previousId ||
            currentOffset === 0
          ) {
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
              id !== previousId ||
              currentOffset === 0
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
    if (!id || !coverUrl) {
      navigate("/", { state: { accountId: state.accountId } });
    } else {
      setPreviousId(id);
    }
    console.log(mangaFeed.length);
  }, [
    id,
    coverUrl,
    selectedLanguage,
    currentOffset,
    currentOrder,
    selectedScanlationGroup,
  ]);

  return (
    <div className="individual-page-container">
      <div className="header">
        <Header
          accountId={state.accountId === undefined ? null : state.accountId}
          contentFilter={state.contentFilter}
        />
      </div>
      <div>
        <MangaPageButtonHeader
          mangaRaw={mangaRaw}
          folders={folders}
          mangaAltTitles={mangaAltTitles}
          mangaTags={mangaTags}
          id={id !== undefined ? id : ""}
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
          mangaAddedAlert={mangaAddedAlert}
          handleMangaCategoryClicked={handleMangaCategoryClicked}
        />{" "}
      </div>

      <MangaBanner
        coverUrl={coverUrl !== undefined ? decodeURIComponent(coverUrl) : ""}
        mangaDescription={mangaDescription}
        mangaName={mangaName}
      />

      <div className="controls-chapters-section">
        <MangaControls
          mangaLanguages={mangaLanguages}
          selectedLanguage={selectedLanguage}
          handleClickedLanguageButton={handleClickedLanguageButton}
          mangaTranslators={scanlationGroups}
          setTranslator={setScanlationGroups}
          handleSwitchOrder={handleSwitchOrder}
          handleFilterScanlationGroups={handleFilterScanlationGroups}
          selectedScanlationGroup={selectedScanlationGroup}
        />
        <div className="bottom-desktop-container">
          <div className="manga-chapter-list">
            {mangaFeed.length !== 0 && filteredMangaFeed?.length !== 0 ? (
              <>
                <Typography fontSize={20} fontFamily="Figtree" align="center">
                  Chapters
                </Typography>

                <MangaChapterList
                  mangaFeed={
                    selectedScanlationGroup !== undefined &&
                    filteredMangaFeed !== undefined
                      ? filteredMangaFeed
                      : mangaFeed
                  }
                  mangaName={mangaName}
                  selectedLanguage={selectedLanguage}
                  mangaId={id !== undefined ? id : ""}
                  insideReader={false}
                  coverUrl={
                    coverUrl !== undefined ? decodeURIComponent(coverUrl) : ""
                  }
                  accountId={
                    state.accountId === undefined ? null : state.accountId
                  }
                  contentFilter={state.contentFilter}
                />
              </>
            ) : (
              <Typography
                fontSize={18}
                fontFamily="Figtree"
                align="center"
                className="empty-chapters-text"
              >
                Empty...
              </Typography>
            )}
            {mangaFeed.length !== 0 && filteredMangaFeed?.length !== 0 ? (
              mangaFeed.length < 100 ? null : (
                <Button
                  className="show-more-button"
                  onClick={() => {
                    handleShowMore();
                  }}
                >
                  {" "}
                  Show More
                </Button>
              )
            ) : null}
          </div>
          <div className="similar-manga-section">
            <Typography fontSize={22} fontFamily="Figtree" align="center">
              Similar Manga
            </Typography>{" "}
            <div className="similar-manga">
              <SimilarManga
                manga={similarManga}
                accountId={
                  state.accountId === undefined ? null : state.accountId
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualManga;
