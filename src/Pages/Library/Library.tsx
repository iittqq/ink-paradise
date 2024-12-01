import { useEffect, useState } from "react";

import { CircularProgress, Typography } from "@mui/material";
import "./Library.css";
import LibraryHeader from "../../Components/LibraryHeader/LibraryHeader";
import LibraryContents from "../../Components/LibraryContents/LibraryContents";
import { Manga } from "../../interfaces/MangaDexInterfaces";
import {
  getReadingByUserId,
  getReadingByMangaName,
  deleteReadingByMangaIdAndUserId,
} from "../../api/Reading";
import { fetchMangaById } from "../../api/MangaDexApi";
import { Reading } from "../../interfaces/ReadingInterfaces";
import { Account } from "../../interfaces/AccountInterfaces";
import { AccountDetails } from "../../interfaces/AccountDetailsInterfaces";
import { fetchAccountData } from "../../api/Account";
import { MangaFolder } from "../../interfaces/MangaFolderInterfaces";
import FolderGrid from "../../Components/FolderGrid/FolderGrid";
import {
  addMangaFolder,
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

interface LibraryProps {
  account: Account | null;
  accountDetails: AccountDetails | null;
}
const Library = ({ account, accountDetails }: LibraryProps) => {
  const [library, setLibrary] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [ascending, setAscending] = useState<boolean>(true);
  const [contentFilter, setContentFilter] =
    useState<string>("Alphabetical Order");
  const [loadLibrary, setLoadLibrary] = useState<boolean>(true);
  const [checked, setChecked] = useState<boolean>(false);
  const [libraryEntriesToDelete, setLibraryEntriesToDelete] = useState<
    string[]
  >([]);
  const [groupedLibrary, setGroupedLibrary] = useState<Manga[][] | null>(null);

  const [accountData, setAccountData] = useState<Account | null>(account);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const [newFolderName, setNewFolderName] = useState<string>("");
  const [newFolderDescription, setNewFolderDescription] = useState<string>("");
  const [folders, setFolders] = useState<MangaFolder[]>([]);
  const [newFolder, setNewFolder] = useState<boolean>(false);
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

  const [selectAllFolderContent, setSelectAllFolderContent] =
    useState<boolean>(false);

  const [folderBackground, setFolderBackground] = useState<string>("");
  const [desktop] = useState(window.innerWidth > 600);

  const searchFavorites = async (searchValue: string) => {
    setLibrary([]);
    if (searchValue === "") {
      setLoadLibrary(!loadLibrary);
      return;
    }
    setLoading(true);
    if (accountData !== null) {
      getReadingByMangaName(accountData.id, searchValue).then(
        (filteredReading: Reading[]) => {
          const promises = filteredReading.map((readingEntry: Reading) => {
            return fetchMangaById(readingEntry.mangaId);
          });
          Promise.all(promises).then((data) => {
            setLibrary(data);
            setLoading(false);
          });
        },
      );
    }
  };

  const handleFetchingLibrary = async (userId: number, ascending: boolean) => {
    setLoading(true);

    try {
      const data: Reading[] = await getReadingByUserId(userId);
      const sortedData = sortLibraryData(data, contentFilter, ascending);

      const mangaPromises = sortedData.map((entry: Reading) =>
        fetchMangaById(entry.mangaId),
      );
      const mangaData: Manga[] = await Promise.all(mangaPromises);

      const sortedMangaData = sortMangaData(
        mangaData,
        contentFilter,
        ascending,
      );
      setLibrary(sortedMangaData);
      setGroupedLibrary(
        groupLibraryData(sortedMangaData, contentFilter, ascending),
      );
    } catch (error) {
      console.error("Error fetching library data:", error);
    } finally {
      setLoading(false);
    }
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
    if (accountData !== null) {
      libraryEntriesToDelete.forEach((id) => {
        deleteReadingByMangaIdAndUserId(id, accountData.id).then(() => {
          setLibraryEntriesToDelete([]);

          handleFetchingLibrary(accountData.id, ascending);
        });
        deleteBookmarkByMangaIdAndUserId(id, accountData.id);
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
    mangaFoldersToDelete.forEach((folderToDelete: number) => {
      deleteMangaFolder(folderToDelete).then(() => {
        setNewFolder(!newFolder);
      });
      deleteMangaFolderEntriesByFolderId(folderToDelete);
    });
    setCheckedFolder(false);
  };

  const handleCreateFolder = async () => {
    (document.getElementById("folderName") as HTMLInputElement).value = "";
    setNewFolderName("");
    setFolderBackground("");
    (document.getElementById("folderDescription") as HTMLInputElement).value =
      "";
    setNewFolderDescription("");
    if (newFolderName !== "") {
      if (accountData !== null) {
        addMangaFolder({
          userId: accountData.id,
          folderName: newFolderName,
          folderDescription: newFolderDescription,
          folderCover: folderBackground,
        });
        setNewFolder(!newFolder);
        handleFolderDialogClose();
      }
    }
  };

  const handleFindingFolderEntriesById = async (folderId: number) => {
    findMangaFolderEntryById(folderId).then((response: MangaFolderEntry[]) => {
      const promises = response.map((entry: MangaFolderEntry) => {
        return fetchMangaById(entry.mangaId);
      });
      Promise.all(promises)
        .then((data) => {
          setFolderMangaData(data);
          setLoadingFolder(false);
        })
        .catch((error) => console.log(error));
    });
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
    setNewFolder(!newFolder);
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

  useEffect(() => {
    if (account !== null) {
      getMangaFolders().then((response) => {
        setFolders(response.filter((folder) => folder.userId === account!.id));
      });
    }
  }, [newFolder]);

  useEffect(() => {
    if (accountData !== null) {
      fetchAccountData(accountData.id).then((data: Account | null) => {
        setAccountData(data);
        if (data !== null) {
          handleFetchingLibrary(accountData.id, ascending);
        }
      });
    }
  }, [loadLibrary, ascending, contentFilter]);

  return (
    <div className="library-page-container">
      <div className="library-contents-header">
        <Typography fontFamily={"Figtree"} fontSize={20}>
          {"Library"}
        </Typography>
        <Typography fontFamily={"Figtree"} fontSize={17}>
          {contentFilter}
        </Typography>
      </div>
      <div className="library-header-and-contents">
        {desktop === true &&
          (selectedFolder === null ? (
            <LibraryHeader
              searchFavorites={searchFavorites}
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
              newFolderName={newFolderName}
              mangaFoldersToDelete={mangaFoldersToDelete}
              toggleMangaEntriesDelete={toggleMangaEntriesDelete}
              handleDeleteMangaFolders={handleDeleteMangaFolders}
              checkedFolder={checkedFolder}
            />
          ) : (
            <FolderActionsBar
              handleClickBack={handleClickBack}
              handleDeleteMangaEntries={handleDeleteMangaEntries}
              handleDeleteMangaFolders={handleDeleteMangaFolders}
              checked={checkedFolder}
              toggleMangaEntriesDelete={toggleMangaEntriesDelete}
              handleClickAddFolderButton={handleClickAddFolderButton}
              handleFolderDialogClose={handleFolderDialogClose}
              handleCreateFolder={handleCreateFolder}
              openAddFolder={openAddFolder}
              selectedFolder={selectedFolder}
              newFolderName={newFolderName}
              handleFolderNameChange={handleFolderNameChange}
              handleFolderDescriptionChange={handleFolderDescriptionChange}
              selectAll={selectAllFolderContent}
              toggleSelectAll={toggleSelectAllFolderContent}
              mangaFoldersToDelete={mangaFoldersToDelete}
              mangaEntriesToDelete={mangaEntriesToDelete}
              handleFolderBackgroundChange={handleFolderBackgroundChange}
            />
          ))}
        {loading === true ? (
          <div className="loading-indicator-container">
            <CircularProgress className="loading-icon" size={25} />
          </div>
        ) : (
          <div className="scrolling-library">
            {selectedFolder === null ? (
              <LibraryContents
                libraryManga={library}
                handleLibraryEntryClick={handleLibraryEntryClick}
                currentMetric={contentFilter}
                checked={checked}
                libraryEntriesToDelete={libraryEntriesToDelete}
                selectAll={selectAll}
                groupedLibraryManga={groupedLibrary}
                accountId={accountData!.id}
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
              </div>
            )}
            <Divider className="library-divider" />
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
              accountId={accountData!.id}
              contentFilter={
                accountDetails === null ? 3 : accountDetails.contentFilter
              }
            />
            {desktop === false &&
              (selectedFolder === null ? (
                <div
                  style={{
                    position: "fixed",
                    width: "100%",
                    bottom: 0,
                    left: 0,
                  }}
                >
                  <LibraryHeader
                    searchFavorites={searchFavorites}
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
                    handleFolderDescriptionChange={
                      handleFolderDescriptionChange
                    }
                    newFolderName={newFolderName}
                    mangaFoldersToDelete={mangaFoldersToDelete}
                    toggleMangaEntriesDelete={toggleMangaEntriesDelete}
                    handleDeleteMangaFolders={handleDeleteMangaFolders}
                    checkedFolder={checkedFolder}
                  />
                </div>
              ) : (
                <div
                  style={{
                    position: "fixed",
                    width: "100%",
                    bottom: 0,
                    left: 0,
                  }}
                >
                  <FolderActionsBar
                    handleClickBack={handleClickBack}
                    handleDeleteMangaEntries={handleDeleteMangaEntries}
                    handleDeleteMangaFolders={handleDeleteMangaFolders}
                    checked={checkedFolder}
                    toggleMangaEntriesDelete={toggleMangaEntriesDelete}
                    handleClickAddFolderButton={handleClickAddFolderButton}
                    handleFolderDialogClose={handleFolderDialogClose}
                    handleCreateFolder={handleCreateFolder}
                    openAddFolder={openAddFolder}
                    selectedFolder={selectedFolder}
                    newFolderName={newFolderName}
                    handleFolderNameChange={handleFolderNameChange}
                    handleFolderDescriptionChange={
                      handleFolderDescriptionChange
                    }
                    selectAll={selectAllFolderContent}
                    toggleSelectAll={toggleSelectAllFolderContent}
                    mangaFoldersToDelete={mangaFoldersToDelete}
                    mangaEntriesToDelete={mangaEntriesToDelete}
                    handleFolderBackgroundChange={handleFolderBackgroundChange}
                  />
                </div>
              ))}
          </div>
        )}{" "}
      </div>
    </div>
  );
};

export default Library;
