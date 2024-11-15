import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import Header from "../../Components/Header/Header";
import MangaBanner from "../../Components/MangaBanner/MangaBanner";
import MangaControls from "../../Components/MangaControls/MangaControls";
import MangaChapterList from "../../Components/MangaChapterList/MangaChapterList";
import SimilarManga from "../../Components/SimilarManga/SimilarManga";
import {
  Manga,
  MangaTagsInterface,
  ScanlationGroup,
  MangaFeedScanlationGroup,
  MangaInfo,
} from "../../interfaces/MangaDexInterfaces";
import {
  fetchMangaFeed,
  fetchMangaById,
  fetchSimilarManga,
  fetchMangaCoverBackend,
} from "../../api/MangaDexApi";
import {
  addMangaFolderEntry,
  getMangaFolderEntries,
} from "../../api/MangaFolderEntry";
import { MangaFolderEntry } from "../../interfaces/MangaFolderEntriesInterfaces";
import { getMangaFolders } from "../../api/MangaFolder";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";

import "./IndividualManga.css";

const IndividualManga = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  // Consolidate related states
  const [mangaInfo, setMangaInfo] = useState<MangaInfo>({
    name: "",
    description: "",
    altTitles: [],
    languages: [],
    contentRating: "",
    rawLink: "",
    tags: [],
    author: "",
    status: "",
    coverUrl: "",
  });

  const [mangaFeed, setMangaFeed] = useState<MangaFeedScanlationGroup[]>([]);
  const [filteredMangaFeed, setFilteredMangaFeed] = useState<
    MangaFeedScanlationGroup[] | undefined
  >(undefined);
  const [folders, setFolders] = useState<MangaFolder[]>([]);
  const [similarManga, setSimilarManga] = useState<Manga[]>([]);
  const [scanlationGroups, setScanlationGroups] = useState<ScanlationGroup[]>(
    [],
  );

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [currentOffset, setCurrentOffset] = useState(0);
  const [currentOrder, setCurrentOrder] = useState("asc");
  const [selectedScanlationGroup, setSelectedScanlationGroup] = useState<
    ScanlationGroup | undefined
  >();

  // State for UI feedback
  const [uiState, setUIState] = useState({
    open: false,
    mangaExistsError: false,
    showInfoToggled: false,
    showCategoriesToggled: false,
    mangaAddedAlert: false,
  });

  // Consolidate repetitive state update logic for manga information
  const fetchAndSetMangaData = useCallback(async () => {
    if (!id) return;

    const mangaData = await fetchMangaById(id);
    const coverArt = mangaData.relationships.find(
      (element) => element.type === "cover_art",
    )?.attributes.fileName;

    const coverUrl = coverArt
      ? URL.createObjectURL(await fetchMangaCoverBackend(id, coverArt))
      : "";

    setMangaInfo({
      name: mangaData.attributes.title.en || "",
      description: mangaData.attributes.description.en || "",
      altTitles: mangaData.attributes.altTitles || [],
      languages: mangaData.attributes.availableTranslatedLanguages || [],
      contentRating: mangaData.attributes.contentRating || "",
      rawLink: mangaData.attributes.links?.raw || "",
      tags: mangaData.attributes.tags || [],
      author:
        mangaData.relationships.find((element) => element.type === "author")
          ?.attributes.name || "",
      status: mangaData.attributes.status || "",
      coverUrl,
    });
  }, [id]);

  const fetchFolders = useCallback(async () => {
    if (state.accountId) {
      const response = await getMangaFolders();
      setFolders(
        response.filter((folder) => folder.userId === state.accountId),
      );
    }
  }, [state.accountId]);

  const fetchFeedData = useCallback(async () => {
    if (id) {
      const data = await fetchMangaFeed(
        id,
        100,
        currentOffset,
        currentOrder,
        selectedLanguage,
      );
      if (currentOffset === 0) {
        setMangaFeed(data);
      } else {
        setMangaFeed((previousFeed) => [...previousFeed, ...data]);
      }
      setScanlationGroups([
        ...new Set(
          data.flatMap((item) =>
            item.relationships.filter((rel) => rel.type === "scanlation_group"),
          ),
        ),
      ]);
    }
  }, [id, currentOrder, selectedLanguage, currentOffset]);

  const fetchSimilarMangaByTags = useCallback(
    async (tags: string[]) => {
      if (tags.length === 0) return; // Exit if tags are empty

      try {
        const data = await fetchSimilarManga(
          10,
          0,
          tags,
          state.contentFilter ?? 3,
        );
        setSimilarManga(data);
      } catch (error) {
        console.error("Error fetching similar manga:", error);
      }
    },
    [state.contentFilter],
  );

  // useEffect for initial fetch on mount
  useEffect(() => {
    fetchAndSetMangaData();
    fetchFolders();
    fetchFeedData();
  }, [fetchAndSetMangaData, fetchFolders, fetchFeedData]);

  useEffect(() => {
    if (mangaInfo.tags && mangaInfo.tags.length > 0) {
      const tagIds = mangaInfo.tags.map((tag) => tag.id);
      fetchSimilarMangaByTags(tagIds); // Call only when tags are available
    }
  }, [mangaInfo.tags, fetchSimilarMangaByTags]);

  useEffect(() => {
    let filteredData = mangaFeed;

    if (selectedLanguage) {
      filteredData = filteredData.filter(
        (item) => item.attributes.translatedLanguage === selectedLanguage,
      );
    }

    if (selectedScanlationGroup) {
      filteredData = filteredData.filter((item) => {
        const hasScanlationGroup = item.relationships.some((rel) => {
          const isMatch =
            rel.type === "scanlation_group" &&
            rel.id === selectedScanlationGroup.id;
          return isMatch;
        });
        return hasScanlationGroup;
      });
    }

    setFilteredMangaFeed(filteredData);
  }, [mangaFeed, selectedLanguage, selectedScanlationGroup]);

  const handleAddToFolder = (folderId: number) => {
    if (!folderId || !id) return;
    getMangaFolderEntries().then((response) => {
      const exists = response.some(
        (entry: MangaFolderEntry) =>
          entry.folderId === folderId && entry.mangaId === id,
      );
      if (!exists) {
        addMangaFolderEntry({ folderId, mangaId: id });
        setUIState((prev) => ({ ...prev, mangaAddedAlert: true }));
        setTimeout(
          () => setUIState((prev) => ({ ...prev, mangaAddedAlert: false })),
          3000,
        );
      } else {
        setUIState((prev) => ({ ...prev, mangaExistsError: true }));
        setTimeout(
          () => setUIState((prev) => ({ ...prev, mangaExistsError: false })),
          3000,
        );
      }
    });
  };

  const handleShowMore = () => {
    setSelectedScanlationGroup(undefined);
    setCurrentOffset(currentOffset + 100);
    console.log(currentOffset);
  };

  const handleFilterScanlationGroups = (
    scanlationGroup: ScanlationGroup | undefined,
  ) => {
    setSelectedScanlationGroup(scanlationGroup || undefined);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCurrentOffset(0);
    setSelectedScanlationGroup(undefined);
  };

  const handleMangaCategoryClicked = (category: MangaTagsInterface) => {
    fetchSimilarMangaByTags([category.id]).then((data) =>
      navigate("/mangaCoverList", {
        state: {
          listType: category.attributes.name.en,
          manga: data,
          accountId: state.accountId,
        },
      }),
    );
  };

  return (
    <div className="individual-page-container">
      <Header
        accountId={state.accountId ?? null}
        contentFilter={state.contentFilter ?? 3}
      />

      <MangaBanner
        coverUrl={mangaInfo.coverUrl}
        mangaDescription={mangaInfo.description}
        mangaName={mangaInfo.name}
        author={mangaInfo.author}
        contentRating={mangaInfo.contentRating}
        status={mangaInfo.status}
        mangaRaw={mangaInfo.rawLink}
        folders={folders}
        mangaAltTitles={mangaInfo.altTitles}
        mangaTags={mangaInfo.tags}
        id={id ?? ""}
        handleAddToFolder={handleAddToFolder}
        handleClickOpen={() => setUIState((prev) => ({ ...prev, open: true }))}
        handleCloseCategories={() =>
          setUIState((prev) => ({ ...prev, showCategoriesToggled: false }))
        }
        handleCloseInfo={() =>
          setUIState((prev) => ({ ...prev, showInfoToggled: false }))
        }
        handleOpenCategories={() =>
          setUIState((prev) => ({ ...prev, showCategoriesToggled: true }))
        }
        handleOpenInfo={() =>
          setUIState((prev) => ({ ...prev, showInfoToggled: true }))
        }
        open={uiState.open}
        showInfoToggled={uiState.showInfoToggled}
        showCategoriesToggled={uiState.showCategoriesToggled}
        mangaExistsError={uiState.mangaExistsError}
        handleClose={() =>
          setUIState((prev) => ({
            ...prev,
            open: false,
            mangaExistsError: false,
          }))
        }
        mangaContentRating={mangaInfo.contentRating}
        mangaAddedAlert={uiState.mangaAddedAlert}
        handleMangaCategoryClicked={handleMangaCategoryClicked}
      />

      <div className="controls-chapters-section">
        <Typography fontSize={20} fontFamily="Figtree" align="center">
          Filters
        </Typography>
        <MangaControls
          mangaLanguages={mangaInfo.languages}
          selectedLanguage={selectedLanguage}
          handleClickedLanguageButton={handleLanguageChange}
          mangaTranslators={scanlationGroups}
          setTranslator={setScanlationGroups}
          handleSwitchOrder={() =>
            setCurrentOrder((order) => (order === "asc" ? "desc" : "asc"))
          }
          handleFilterScanlationGroups={handleFilterScanlationGroups}
          selectedScanlationGroup={selectedScanlationGroup}
        />
        <div className="bottom-desktop-container">
          <Typography fontSize={20} fontFamily="Figtree" align="center">
            Chapters
          </Typography>
          <div className="manga-chapter-list">
            {mangaFeed.length > 0 && (
              <>
                <MangaChapterList
                  mangaFeed={
                    selectedScanlationGroup && filteredMangaFeed
                      ? filteredMangaFeed
                      : mangaFeed
                  }
                  mangaName={mangaInfo.name}
                  selectedLanguage={selectedLanguage}
                  mangaId={id ?? ""}
                  insideReader={false}
                  coverUrl={decodeURIComponent(mangaInfo.coverUrl)}
                  accountId={state.accountId ?? null}
                  contentFilter={state.contentFilter}
                  sortOrder={currentOrder}
                />
              </>
            )}
            {mangaFeed.length >= currentOffset + 100 && (
              <Button className="show-more-button" onClick={handleShowMore}>
                Show More
              </Button>
            )}
            <Typography fontSize={20} fontFamily="Figtree" align="center">
              Similar Manga
            </Typography>{" "}
            <div className="similar-manga-section">
              <SimilarManga
                manga={similarManga}
                accountId={state.accountId ?? null}
                contentFilter={state.contentFilter}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualManga;
