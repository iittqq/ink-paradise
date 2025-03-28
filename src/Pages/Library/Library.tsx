import { useEffect, useState, useRef } from "react";

import { Typography, Button, CircularProgress } from "@mui/material";
import "./Library.css";
import LibraryHeader from "../../Components/LibraryHeader/LibraryHeader";
import LibraryContents from "../../Components/LibraryContents/LibraryContents";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import {
  getReadingByUserId,
  deleteReadingByMangaIdAndUserId,
} from "../../api/Reading";
import { useNavigate } from "react-router-dom";
import {
  fetchMangaById,
  fetchMangaFeed,
  fetchMangaListById,
} from "../../api/MangaDexApi";
import { Reading } from "../../interfaces/ReadingInterfaces";
import { Account } from "../../interfaces/AccountInterfaces";
import { AccountDetails } from "../../interfaces/AccountDetailsInterfaces";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";
import FolderGrid from "../../Components/FolderGrid/FolderGrid";
import {
  addMangaFolder,
  editMangaFolder,
  deleteMangaFolder,
  getMangaFolders,
} from "../../api/MangaFolder";
import {
  findMangaFolderEntryById,
  deleteMangaFolderEntriesByFolderId,
  deleteMangaFolderEntriesByMangaId,
} from "../../api/MangaFolderEntry";
import { MangaFolderEntry } from "../../interfaces/MangaFolderEntriesInterfaces";
import FolderActionsBar from "../../Components/FolderActionsBar/FolderActionsBar";
import Divider from "@mui/material/Divider";
import { deleteBookmarkByMangaIdAndUserId } from "../../api/Bookmarks";
import TuneIcon from "@mui/icons-material/Tune";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

interface LibraryProps {
  account: Account | null;
  accountDetails: AccountDetails | null;
}
const Library = ({ account, accountDetails }: LibraryProps) => {
  const [library, setLibrary] = useState<Manga[]>([]);
  const [ascending, setAscending] = useState<boolean>(true);
  const [contentFilter, setContentFilter] =
    useState<string>("Alphabetical Order");
  const [checked, setChecked] = useState<boolean>(false);
  const [libraryEntriesToDelete, setLibraryEntriesToDelete] = useState<
    string[]
  >([]);
  const [groupedLibrary, setGroupedLibrary] = useState<Manga[][] | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const [newFolderName, setNewFolderName] = useState<string | null>(null);
  const [newFolderDescription, setNewFolderDescription] = useState<
    string | null
  >(null);
  const [folders, setFolders] = useState<MangaFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<MangaFolder | null>(
    null,
  );
  const [checkedFolder, setCheckedFolder] = useState<boolean>(false);
  const [folderMangaData, setFolderMangaData] = useState<Manga[] | null>(null);
  const [loadingFolder, setLoadingFolder] = useState<boolean>(false);
  const [mangaEntriesToDelete, setMangaEntriesToDelete] = useState<string[]>(
    [],
  );
  const [openAddFolder, setOpenAddFolder] = useState<boolean>(false);
  const [mangaFoldersToDelete, setMangaFoldersToDelete] = useState<number[]>(
    [],
  );

  const [openEditFolder, setOpenEditFolder] = useState<boolean>(false);

  const [selectAllFolderContent, setSelectAllFolderContent] =
    useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);

  const [folderBackground, setFolderBackground] = useState<string | null>(null);

  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFetchingLibrary = async (userId: number, ascending: boolean) => {
    setLoading(true);
    const data: Reading[] = await getReadingByUserId(userId);
    const sortedData = sortLibraryData(data, contentFilter, ascending);
    abortControllerRef.current = new AbortController();

    let mangaData: Manga[] = [];
    async function fetchMangaInBatches(sortedData: { mangaId: string }[]) {
      const batchSize = 40;
      const abortSignal = abortControllerRef.current!.signal;

      for (let i = 0; i < sortedData.length; i += batchSize) {
        const batch = sortedData
          .slice(i, i + batchSize)
          .map((obj) => obj.mangaId);

        try {
          const batchResult = await fetchMangaListById(batch, abortSignal);
          mangaData = [...mangaData, ...batchResult];
        } catch (error) {
          console.error("Error fetching batch:", error);
        }
      }
    }

    await fetchMangaInBatches(sortedData);

    console.log(data);
    const mangaWithLatestChapter: Manga[] = mangaData.map((manga, index) => ({
      ...manga,
      chapterNumber: data[index].chapter,
    }));

    const sortedMangaData = sortMangaData(
      mangaWithLatestChapter,
      contentFilter,
      ascending,
    );

    setLibrary(sortedMangaData);
    setGroupedLibrary(
      groupLibraryData(sortedMangaData, contentFilter, ascending),
    );
    setLoading(false);
  };

  const sortLibraryData = (
    data: Reading[],
    filter: string,
    ascending: boolean,
  ): Reading[] => {
    return filter === "Continue Reading"
      ? data.sort((a, b) =>
          ascending
            ? Date.parse(b.timestamp) - Date.parse(a.timestamp)
            : Date.parse(a.timestamp) - Date.parse(b.timestamp),
        )
      : data.sort((a, b) =>
          ascending
            ? a.mangaName.localeCompare(b.mangaName)
            : b.mangaName.localeCompare(a.mangaName),
        );
  };

  const sortMangaData = (
    data: Manga[],
    filter: string,
    ascending: boolean,
  ): Manga[] => {
    switch (filter) {
      case "Recently Updated":
        return data.sort((a, b) =>
          ascending
            ? b.attributes.updatedAt.localeCompare(a.attributes.updatedAt)
            : a.attributes.updatedAt.localeCompare(b.attributes.updatedAt),
        );
      case "Release Date":
        return data.sort((a, b) =>
          ascending
            ? b.attributes.year - a.attributes.year
            : a.attributes.year - b.attributes.year,
        );
      default:
        return data;
    }
  };

  const groupLibraryData = (
    data: Manga[],
    filter: string,
    ascending: boolean,
  ): Manga[][] | null => {
    let groupedData: Manga[][] | null = null;

    if (filter === "Content Rating") {
      groupedData = Object.values(
        data.reduce((acc: { [key: string]: Manga[] }, manga) => {
          const rating = manga.attributes.contentRating;
          (acc[rating] = acc[rating] || []).push(manga);
          return acc;
        }, {}),
      );
    } else if (filter === "Publication Demographic") {
      groupedData = Object.values(
        data.reduce((acc: { [key: string]: Manga[] }, manga) => {
          const demographic = manga.attributes.publicationDemographic;
          (acc[demographic] = acc[demographic] || []).push(manga);
          return acc;
        }, {}),
      );
    }

    return groupedData
      ? ascending
        ? groupedData
        : groupedData.reverse()
      : null;
  };

  const handleAscendingChange = () => {
    setAscending(!ascending);
  };

  const handleContentFilter = (selection: string) => {
    setContentFilter(selection);
    setLibrary([]);
    setGroupedLibrary(null);
  };

  const toggleLibraryEntries = (value: boolean) => {
    setChecked(value);
    setLibraryEntriesToDelete([]);
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setLibraryEntriesToDelete([]);
    } else {
      setLibraryEntriesToDelete(library.map((manga) => manga.id));
    }
  };

  const handleLibraryEntryClick = async (manga: Manga) => {
    if (checked || selectAll) {
      if (libraryEntriesToDelete.includes(manga.id)) {
        setLibraryEntriesToDelete(
          libraryEntriesToDelete.filter((id) => id !== manga.id),
        );
      } else {
        setLibraryEntriesToDelete([...libraryEntriesToDelete, manga.id]);
      }
      if (selectAll) {
        setSelectAll(false);
        setChecked(true);
      }
    }
  };

  const handleDeleteLibraryEntries = async () => {
    setChecked(false);
    setSelectAll(false);
    if (account !== null) {
      libraryEntriesToDelete.forEach((id) => {
        deleteReadingByMangaIdAndUserId(id, account.id).then(() => {
          setLibraryEntriesToDelete([]);

          handleFetchingLibrary(account.id, ascending);
        });
        deleteBookmarkByMangaIdAndUserId(id, account.id);
      });
    }
  };

  const handleDeleteMangaEntries = async () => {
    if (selectedFolder !== null) {
      mangaEntriesToDelete.forEach((mangaToDelete) => {
        if (selectedFolder.folderId !== undefined) {
          deleteMangaFolderEntriesByMangaId(
            mangaToDelete,
            selectedFolder.folderId,
          ).then(() => {
            if (selectedFolder.folderId !== undefined) {
              handleFindingFolderEntriesById(selectedFolder.folderId);
            }
          });
        }
      });
    }
    setCheckedFolder(false);
    setSelectAllFolderContent(false);
  };

  const toggleMangaEntriesDelete = (value: boolean) => {
    setCheckedFolder(value);
    setMangaEntriesToDelete([]);
    setMangaFoldersToDelete([]);
  };

  const handleDeleteMangaFolders = async () => {
    for (const folderToDelete of mangaFoldersToDelete) {
      await deleteMangaFolder(folderToDelete);
      await deleteMangaFolderEntriesByFolderId(folderToDelete);
    }

    const response = await getMangaFolders();
    setFolders(response.filter((folder) => folder.userId === account!.id));
    setCheckedFolder(false);
  };

  const handleCreateFolder = async () => {
    (document.getElementById("folderName") as HTMLInputElement).value = "";
    setNewFolderName("");
    setFolderBackground("");
    (document.getElementById("folderDescription") as HTMLInputElement).value =
      "";
    setNewFolderDescription("");
    if (
      newFolderName !== "" &&
      newFolderName !== null &&
      newFolderDescription !== null &&
      folderBackground !== null
    ) {
      if (account !== null) {
        await addMangaFolder({
          userId: account.id,
          folderName: newFolderName,
          folderDescription: newFolderDescription,
          folderCover: folderBackground,
        });

        const response = await getMangaFolders();
        setFolders(response.filter((folder) => folder.userId === account!.id));
        setOpenAddFolder(false);
      }
    }
  };

  const handleFindingFolderEntriesById = async (folderId: number) => {
    setLoadingFolder(true);
    abortControllerRef.current = new AbortController();
    try {
      // Fetch folder entries by folderId
      const folderEntries: MangaFolderEntry[] =
        await findMangaFolderEntryById(folderId);

      // Fetch user reading data to get chapter numbers
      const readingData: Reading[] = await getReadingByUserId(account!.id);

      // Map folder entries to include the corresponding chapterNumber from readingData
      const enrichedFolderEntries = folderEntries.map((entry) => {
        const readingEntry = readingData.find(
          (reading) => reading.mangaId === entry.mangaId,
        );
        return {
          ...entry,
          chapterNumber: readingEntry?.chapter ?? undefined, // Convert null to undefined
        };
      });

      // Fetch manga details for each folder entry
      const mangaPromises = enrichedFolderEntries.map((entry) =>
        fetchMangaById(entry.mangaId, abortControllerRef.current!.signal),
      );
      const mangaData: Manga[] = await Promise.all(mangaPromises);

      // Fetch the latest chapter for each manga
      const latestChapterPromises = mangaData.map((manga) =>
        fetchMangaFeed(
          manga.id,
          1,
          0,
          "desc",
          "en",
          abortControllerRef.current!.signal,
        ).then((feed) => {
          return feed;
        }),
      );
      const latestChapters = await Promise.all(latestChapterPromises);

      // Combine manga data with latest chapter and chapter number
      const mangaWithLatestChapter = mangaData.map((manga, index) => {
        const folderEntry = enrichedFolderEntries.find(
          (entry) => entry.mangaId === manga.id,
        );
        return {
          ...manga,
          latestChapter: latestChapters[index],
          chapterNumber: folderEntry?.chapterNumber, // Use chapterNumber from enriched folder entries
        };
      });

      setFolderMangaData(mangaWithLatestChapter);
    } catch (error) {
      console.error("Error finding folder entries:", error);
    } finally {
      setLoadingFolder(false);
    }
  };
  const handleFolderClick = async (folder: MangaFolder) => {
    if (checkedFolder && folder.folderId !== undefined) {
      if (mangaFoldersToDelete.includes(folder.folderId)) {
        setMangaFoldersToDelete(
          mangaFoldersToDelete.filter((id) => id !== folder.folderId),
        );
      } else {
        setMangaFoldersToDelete([...mangaFoldersToDelete, folder.folderId]);
      }
    } else {
      setSelectedFolder(folder);
      setLoadingFolder(true);
      if (folder.folderId !== undefined) {
        handleFindingFolderEntriesById(folder.folderId);
      }
    }
  };

  const handleMangaEntryClick = async (manga: Manga) => {
    if (checkedFolder || selectAllFolderContent) {
      if (mangaEntriesToDelete.includes(manga.id)) {
        setMangaEntriesToDelete(
          mangaEntriesToDelete.filter((id) => id !== manga.id),
        );
      } else {
        setMangaEntriesToDelete([...mangaEntriesToDelete, manga.id]);
      }
      if (selectAll) {
        setSelectAllFolderContent(false);
        setCheckedFolder(true);
      }
    }
  };

  const handleClickBack = () => {
    setSelectedFolder(null);
    setMangaEntriesToDelete([]);
    setSelectAllFolderContent(false);
    setChecked(false);
    setCheckedFolder(false);
  };

  const handleFolderDialogClose = () => {
    setOpenAddFolder(false);
  };

  const handleClickAddFolderButton = () => {
    setOpenAddFolder(true);
  };

  const handleFolderNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewFolderName(event.target.value);
  };

  const handleFolderDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewFolderDescription(event.target.value);
  };

  const handleFolderBackgroundChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFolderBackground(event.target.value);
  };

  const toggleSelectAllFolderContent = () => {
    setSelectAllFolderContent(!selectAllFolderContent);
    if (selectAllFolderContent) {
      setMangaEntriesToDelete([]);
    } else {
      if (folderMangaData !== null) {
        setMangaEntriesToDelete(folderMangaData.map((manga) => manga.id));
      }
    }
  };

  const handleClickEditFolderButton = () => {
    setOpenEditFolder(true);
  };

  const handleEditFolder = async () => {
    (document.getElementById("folderName") as HTMLInputElement).value = "";
    setNewFolderName("");
    (document.getElementById("folderBackground") as HTMLInputElement).value =
      "";
    setFolderBackground("");
    (document.getElementById("folderDescription") as HTMLInputElement).value =
      "";
    setNewFolderDescription("");

    if (account !== null) {
      await editMangaFolder({
        folderId: selectedFolder!.folderId!,
        folderName:
          newFolderName !== null ? newFolderName : selectedFolder!.folderName,
        folderDescription:
          newFolderDescription !== null
            ? newFolderDescription
            : selectedFolder!.folderDescription,
        folderCover:
          folderBackground !== null
            ? folderBackground
            : selectedFolder!.folderCover,
      });
      const response = await getMangaFolders();
      setFolders(response.filter((folder) => folder.userId === account!.id));
      setOpenEditFolder(false);
      handleClickBack();
    }
  };

  const handleEditFolderDialogClose = () => {
    setOpenEditFolder(false);
  };

  useEffect(() => {
    if (openEditFolder && selectedFolder) {
      setNewFolderName(selectedFolder.folderName || "");
      setNewFolderDescription(selectedFolder.folderDescription || "");
      setFolderBackground(selectedFolder.folderCover || "");
    }
  }, [
    openEditFolder,
    selectedFolder?.folderName,
    selectedFolder?.folderDescription,
    selectedFolder?.folderCover,
  ]);

  useEffect(() => {
    const fetchFolders = async () => {
      if (account !== null) {
        try {
          const response = await getMangaFolders();
          setFolders(response.filter((folder) => folder.userId === account.id));
        } catch (error) {
          console.error("Error fetching folders:", error);
        }
      }
    };

    fetchFolders();
  }, [account]);

  const showHideControls = () => {
    setShowControls(!showControls);
  };

  useEffect(() => {
    if (account !== null) {
      handleFetchingLibrary(account.id, ascending);
    }
  }, [ascending, contentFilter]);

  return (
    <div
      className="library-page-container"
      style={{ justifyContent: library.length === 0 ? "center" : "flex-start" }}
    >
      <div className="inside-folder-header">
        {selectedFolder !== null ? (
          <Button
            className="exit-library-button"
            onClick={() => {
              handleClickBack();
            }}
          >
            <ArrowBackIcon />
          </Button>
        ) : (
          <div></div>
        )}{" "}
        <Button
          className="open-library-controls-button"
          onClick={() => {
            showHideControls();
          }}
        >
          {!showControls ? <TuneIcon /> : <CloseIcon />}
        </Button>
      </div>
      {loading === true ? (
        <div className="loading-indicator-container">
          <CircularProgress className="loading-icon" size={25} />
        </div>
      ) : library.length === 0 ? (
        <Button
          className="redirect-button-library"
          onClick={() => {
            navigate("/", { state: { accountId: account!.id } });
          }}
        >
          <Typography fontFamily="Figtree">Start Browsing</Typography>
        </Button>
      ) : (
        <div className="library-contents-and-buttons">
          <div style={{ width: "100%" }}>
            {selectedFolder === null ? (
              <LibraryContents
                libraryManga={library}
                handleLibraryEntryClick={handleLibraryEntryClick}
                currentMetric={contentFilter}
                checked={checked}
                libraryEntriesToDelete={libraryEntriesToDelete}
                selectAll={selectAll}
                groupedLibraryManga={groupedLibrary}
                accountId={account!.id}
                contentFilter={
                  accountDetails === null ? 3 : accountDetails.contentFilter
                }
              />
            ) : (
              <div className="personal-folders-library">
                <div className="current-folder-header">
                  {selectedFolder.folderName}
                  <div>
                    {selectedFolder.folderDescription !== null ? (
                      <Typography className="folder-description-library">
                        {selectedFolder.folderDescription}
                      </Typography>
                    ) : null}
                  </div>
                </div>
                <Divider className="library-divider" />
              </div>
            )}
            {folders.length > 0 && selectedFolder === null ? (
              <Divider className="library-divider" />
            ) : null}

            <FolderGrid
              folderClick={handleFolderClick}
              mangaEntryClick={handleMangaEntryClick}
              loading={loadingFolder}
              selectedFolder={selectedFolder}
              checked={checkedFolder}
              folders={folders}
              mangaFoldersToDelete={mangaFoldersToDelete}
              folderMangaData={folderMangaData}
              mangaEntriesToDelete={mangaEntriesToDelete}
              selectAll={selectAllFolderContent}
              accountId={account!.id}
              contentFilter={
                accountDetails === null ? 3 : accountDetails.contentFilter
              }
            />
          </div>
          {selectedFolder === null
            ? showControls === true && (
                <LibraryHeader
                  handleAscendingChange={handleAscendingChange}
                  handleContentFilter={handleContentFilter}
                  checked={checked}
                  toggleLibraryEntries={toggleLibraryEntries}
                  handleDeleteLibraryEntries={handleDeleteLibraryEntries}
                  toggleSelectAll={toggleSelectAll}
                  selectAll={selectAll}
                  libraryEntriesToDelete={libraryEntriesToDelete}
                  handleClickAddFolderButton={handleClickAddFolderButton}
                  openAddFolder={openAddFolder}
                  handleFolderDialogClose={handleFolderDialogClose}
                  handleCreateFolder={handleCreateFolder}
                  handleFolderNameChange={handleFolderNameChange}
                  handleFolderBackgroundChange={handleFolderBackgroundChange}
                  handleFolderDescriptionChange={handleFolderDescriptionChange}
                  mangaFoldersToDelete={mangaFoldersToDelete}
                  toggleMangaEntriesDelete={toggleMangaEntriesDelete}
                  handleDeleteMangaFolders={handleDeleteMangaFolders}
                  checkedFolder={checkedFolder}
                />
              )
            : showControls === true && (
                <FolderActionsBar
                  handleDeleteMangaEntries={handleDeleteMangaEntries}
                  handleDeleteMangaFolders={handleDeleteMangaFolders}
                  checked={checkedFolder}
                  toggleMangaEntriesDelete={toggleMangaEntriesDelete}
                  handleClickAddFolderButton={handleClickAddFolderButton}
                  handleFolderDialogClose={handleFolderDialogClose}
                  handleCreateFolder={handleCreateFolder}
                  openAddFolder={openAddFolder}
                  selectedFolder={selectedFolder}
                  handleFolderNameChange={handleFolderNameChange}
                  handleFolderDescriptionChange={handleFolderDescriptionChange}
                  selectAll={selectAllFolderContent}
                  toggleSelectAll={toggleSelectAllFolderContent}
                  mangaFoldersToDelete={mangaFoldersToDelete}
                  mangaEntriesToDelete={mangaEntriesToDelete}
                  handleFolderBackgroundChange={handleFolderBackgroundChange}
                  handleClickEditFolderButton={handleClickEditFolderButton}
                  openEditFolder={openEditFolder}
                  handleEditFolder={handleEditFolder}
                  handleEditFolderDialogClose={handleEditFolderDialogClose}
                  newFolderName={newFolderName}
                  newFolderDescription={newFolderDescription}
                  folderBackground={folderBackground}
                />
              )}
        </div>
      )}
    </div>
  );
};

export default Library;
