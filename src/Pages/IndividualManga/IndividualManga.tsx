import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import MangaBanner from "../../Components/MangaBanner/MangaBanner";
import MangaControls from "../../Components/MangaControls/MangaControls";
import MangaChapterList from "../../Components/MangaChapterList/MangaChapterList";
import { Reading } from "../../interfaces/ReadingInterfaces";
import { AxiosError } from "axios";
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
import {
  updateOrCreateReading,
  getReadingByUserIdAndMangaId,
} from "../../api/Reading";
import { updateOrCreateBookmark } from "../../api/Bookmarks";
import "./IndividualManga.css";
import TrendingMangaCarousel from "../../Components/TrendingMangaCarousel/TrendingMangaCarousel";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface IndividualMangaProps {
  accountId: number | null;
  contentFilter: number | null;
}
const IndividualManga = ({
  accountId,
  contentFilter,
}: IndividualMangaProps) => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [libraryEntryExists, setLibraryEntryExists] = useState(false);
  const [openFeed, setOpenFeed] = useState(false);
  const [uiState, setUIState] = useState({
    open: false,
    mangaExistsError: false,
    showInfoToggled: false,
    showCategoriesToggled: false,
    mangaAddedAlert: false,
  });
  const feedRef = useRef<HTMLDivElement | null>(null);

  const handleOpenFeed = () => {
    setOpenFeed(!openFeed);
    console.log(openFeed);
    if (openFeed === false && feedRef.current) {
      console.log(feedRef.current);
      setTimeout(() => {
        feedRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    } else if (openFeed === true) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const checkLibraryEntry = useCallback(async () => {
    if (accountId && id) {
      try {
        const existingReading = await getReadingByUserIdAndMangaId(
          accountId,
          id,
        );
        if (existingReading) {
          setLibraryEntryExists(true);
        } else {
          setLibraryEntryExists(false);
        }
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          setLibraryEntryExists(false); // No progress found
        } else {
          console.error("Error checking library entry:", error);
        }
      }
    }
  }, [accountId, id]);

  useEffect(() => {
    checkLibraryEntry();
  }, [checkLibraryEntry]);

  const handleAddToLibrary = async () => {
    if (accountId !== null) {
      try {
        let existingReading: Reading | null = null;

        try {
          existingReading = await getReadingByUserIdAndMangaId(
            accountId,
            id ?? "",
          );
        } catch (error) {
          if (isAxiosError(error) && error.response?.status === 404) {
            console.log("No existing reading entry found");
          } else {
            throw error; // Re-throw other errors
          }
        }
        if (!existingReading) {
          updateOrCreateReading({
            userId: accountId,
            mangaId: id ?? "",
            chapter:
              (mangaInfo.tags.some(
                (current: MangaTagsInterface) =>
                  current.attributes.name.en === "Oneshot",
              ) ||
              (mangaInfo.status === "completed" && mangaFeed.length === 1)
                ? true
                : false) === true
                ? 1
                : parseInt(mangaFeed[0].attributes.chapter),
            mangaName: mangaInfo.name.replace(/[^a-zA-Z]/g, " "),
            timestamp: new Date().toISOString(),
          });
          setLibraryEntryExists(true);
        }
        if (mangaFeed.length > 0) {
          if (!existingReading) {
            updateOrCreateBookmark({
              userId: accountId,
              mangaId: id ?? "",
              mangaName: mangaInfo.name.replace(/[^a-zA-Z]/g, " "),
              chapterNumber:
                (mangaInfo.tags.some(
                  (current: MangaTagsInterface) =>
                    current.attributes.name.en === "Oneshot",
                ) ||
                (mangaInfo.status === "completed" && mangaFeed.length === 1)
                  ? true
                  : false) === true
                  ? 1
                  : parseInt(mangaFeed[0].attributes.chapter),
              chapterId: mangaFeed[0].id,
              chapterIndex: Math.trunc(
                (mangaInfo.tags.some(
                  (current: MangaTagsInterface) =>
                    current.attributes.name.en === "Oneshot",
                ) ||
                (mangaInfo.status === "completed" && mangaFeed.length === 1)
                  ? true
                  : false) === true
                  ? 1
                  : parseInt(mangaFeed[0].attributes.chapter),
              ),
              continueReading: true,
            });
          }
        } else {
          console.warn("No chapter data available");
        }
      } catch (error) {
        console.error("Error while handling library entry:", error);
      }
    }
  };

  function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
  }

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
    if (accountId) {
      const response = await getMangaFolders();
      setFolders(response.filter((folder) => folder.userId === accountId));
    }
  }, [accountId]);

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
        const data = await fetchSimilarManga(10, 0, tags, contentFilter ?? 3);
        setSimilarManga(data.filter((manga) => manga.id !== id));
      } catch (error) {
        console.error("Error fetching similar manga:", error);
      }
    },
    [contentFilter],
  );

  useEffect(() => {
    fetchAndSetMangaData();
    fetchFeedData();
    fetchFolders();
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
          accountId: accountId,
        },
      }),
    );
  };

  return (
    <div className="individual-page-container">
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
        oneshot={
          mangaInfo.tags.some(
            (current: MangaTagsInterface) =>
              current.attributes.name.en === "Oneshot",
          ) ||
          (mangaInfo.status === "completed" && mangaFeed.length === 1)
            ? true
            : false
        }
        handleAddToLibrary={handleAddToLibrary}
        libraryEntryExists={libraryEntryExists}
        accountId={accountId ?? null}
        setFolders={setFolders}
      />
      <div
        className="controls-chapters-section"
        style={{
          minHeight: openFeed === true ? "calc(var(--vh, 1vh) * 99)" : "0px",
        }}
      >
        {" "}
        <div
          className="bottom-desktop-container"
          ref={feedRef}
          style={{
            justifyContent: openFeed === true ? "flex-start" : "space-between",
          }}
        >
          <div className="controls-and-feed-container">
            <ListItemButton
              className="individual-page-feed-button"
              sx={{
                width: openFeed === true ? "unset" : "100%",
                maxWidth: openFeed === true ? "140px" : "none",
              }}
              onClick={() => handleOpenFeed()}
            >
              <AutoStoriesIcon sx={{ paddingLeft: "4px" }} />
              <ListItemText
                primary={
                  <Typography
                    className="reader-page-text"
                    sx={{ width: "100%" }}
                    noWrap
                  >
                    Chapters
                  </Typography>
                }
              />
              {openFeed ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            {openFeed && (
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
            )}
          </div>
          <Collapse
            className="individual-page-feed-collapse"
            sx={{ paddingTop: openFeed === true ? "5px" : "0px !important" }}
            in={openFeed}
            timeout="auto"
          >
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
              accountId={accountId ?? null}
              contentFilter={contentFilter === null ? 3 : contentFilter}
              sortOrder={currentOrder}
              oneshot={
                mangaInfo.tags.some(
                  (current: MangaTagsInterface) =>
                    current.attributes.name.en === "Oneshot",
                ) ||
                (mangaInfo.status === "completed" && mangaFeed.length === 1)
                  ? true
                  : false
              }
              offset={currentOffset}
              handleShowMore={handleShowMore}
            />
          </Collapse>

          {!openFeed && similarManga.length > 0 && (
            <div style={{ width: "100%" }}>
              <Typography fontSize={20} fontFamily="Figtree" align="center">
                Similar Manga
              </Typography>{" "}
              <div className="similar-manga-section">
                {" "}
                <TrendingMangaCarousel
                  manga={similarManga}
                  accountId={accountId === null ? null : accountId}
                  contentFilter={contentFilter === null ? 3 : contentFilter}
                  numbered={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualManga;
