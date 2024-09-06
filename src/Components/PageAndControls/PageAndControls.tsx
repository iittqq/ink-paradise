import { Button, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useNavigate } from "react-router-dom";
import "./PageAndControls.css";

import { MangaFeedScanlationGroup } from "../../interfaces/MangaDexInterfaces";
import { fetchPageImageBackend, fetchMangaFeed } from "../../api/MangaDexApi";

type Props = {
  pages: string[];
  hash: string;
  currentChapter: string;
  mangaId: string;
  mangaName: string;
  scanlationGroup: string;
  readerMode: number;
  accountId: number;
  order: string;
  selectedLanguage: string;
  chapterIndex: number;
  setMangaFeedState: React.Dispatch<
    React.SetStateAction<MangaFeedScanlationGroup[]>
  >;
  mangaFeedState: MangaFeedScanlationGroup[];
  handleChangePageNumber: (pageNumber: number) => void;
  startPage: number;
};

const PageAndControls = (props: Props) => {
  const {
    pages,
    hash,
    currentChapter,
    mangaId,
    mangaName,
    scanlationGroup,
    readerMode,
    accountId,
    order,
    selectedLanguage,
    chapterIndex,
    setMangaFeedState,
    mangaFeedState,
    handleChangePageNumber,
    startPage,
  } = props;
  const [imageBlob, setImageBlob] = useState<{ [key: string]: Blob }>({});
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(pages.length).fill(false),
  );

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(startPage);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 250;

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) =>
    setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handlePreviousPage();
    } else if (isRightSwipe) {
      handleNextPage();
    }
    // add your conditional logic here
  };
  const handleNextChapter = () => {
    setCurrentPage(0);
    handleChangePageNumber(0);

    let chapterFound = false;

    for (let index = 0; index < mangaFeedState.length; index++) {
      const current = mangaFeedState[index];
      if (
        parseFloat(current.attributes.chapter) > parseFloat(currentChapter) &&
        mangaFeedState[index].attributes.externalUrl === null
      ) {
        chapterFound = true;
        handleClick(
          mangaId,
          mangaFeedState[index].id,
          mangaFeedState[index].attributes.title,
          mangaFeedState[index].attributes.volume,
          mangaFeedState[index].attributes.chapter,
          mangaName,
          scanlationGroup,
          chapterIndex + 1,
        );
        break;
      }
    }
    if (!chapterFound) {
      fetchMangaFeed(
        mangaId,
        100,
        chapterIndex - 1,
        order,
        selectedLanguage,
      ).then((data: MangaFeedScanlationGroup[]) => {
        setMangaFeedState([...mangaFeedState, ...data]);
      });
    }
  };

  const handlePreviousChapter = () => {
    setCurrentPage(0);
    handleChangePageNumber(0);
    let chapterFound = false;

    for (let index = mangaFeedState.length - 1; index >= 0; index--) {
      const current = mangaFeedState[index];
      if (
        parseFloat(current.attributes.chapter) < parseFloat(currentChapter) &&
        mangaFeedState[index].attributes.externalUrl === null
      ) {
        chapterFound = true;
        handleClick(
          mangaId,
          mangaFeedState[index].id,
          mangaFeedState[index].attributes.title,
          mangaFeedState[index].attributes.volume,
          mangaFeedState[index].attributes.chapter,
          mangaName,
          scanlationGroup,
          chapterIndex - 1,
        );
        break;
      }
    }
    if (!chapterFound) {
      fetchMangaFeed(
        mangaId,
        100,
        chapterIndex - 1,
        order,
        selectedLanguage,
      ).then((data: MangaFeedScanlationGroup[]) => {
        console.log(data);
        console.log([...data, ...mangaFeedState]);
        setMangaFeedState(data);
      });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage === 0 || readerMode === 3) {
      handlePreviousChapter();
    } else {
      setCurrentPage(currentPage - 1);
      handleChangePageNumber(currentPage - 1);
    }
    window.localStorage.setItem("position", window.scrollY.toString());
  };

  const handleNextPage = () => {
    console.log(currentPage);
    if (currentPage === pages.length - 1 || readerMode === 3) {
      handleNextChapter();
    } else {
      setCurrentPage(currentPage + 1);
      handleChangePageNumber(currentPage + 1);
    }
    window.localStorage.setItem("position", window.scrollY.toString());
  };

  const handleLoadImage = async (
    hash: string,
    pages: string[],
  ): Promise<void> => {
    const promises = pages.map(async (page, index) => {
      setLoadingStates((prev) => {
        const newLoadingStates = [...prev];
        newLoadingStates[index] = true;
        return newLoadingStates;
      });

      return fetchPageImageBackend(hash, page)
        .then((blob) => {
          // Assuming setImageBlob is modified to handle multiple blobs
          setImageBlob((prevBlobs) => ({
            ...prevBlobs,
            [page]: blob,
          }));

          setLoadingStates((prev) => {
            const newLoadingStates = [...prev];
            newLoadingStates[index] = false;
            return newLoadingStates;
          });
        })
        .catch((error) => {
          setLoadingStates((prev) => {
            const newLoadingStates = [...prev];
            newLoadingStates[index] = false;
            return newLoadingStates;
          });
          console.error("Error loading image:", error);
          throw error;
        });
    });

    await Promise.all(promises);
  };
  const handleClick = (
    mangaId: string,
    chapterId: string,
    title: string,
    volume: string,
    chapterNumber: string,
    mangaName: string,
    scanlationGroup: string,
    chapterIndex: number,
  ) => {
    navigate("/reader", {
      state: {
        mangaId: mangaId,
        chapterId: chapterId,
        title: title,
        volume: volume,
        chapterNumber: chapterNumber,
        mangaName: mangaName,
        scanlationGroup: scanlationGroup,
        accountId: accountId,
        mangaFeed: mangaFeedState,
        chapterIndex: chapterIndex,
        pageNumber: null,
      },
    });
  };

  useEffect(() => {
    setImageBlob({});
    handleLoadImage(hash, pages).catch((error) => {
      throw error;
    });
  }, [hash, pages]);
  return (
    <div>
      <div
        className="page-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {loadingStates[currentPage] ? (
          <div className="loading">
            <CircularProgress size={25} className="loading-icon" />
          </div>
        ) : (
          <>
            {readerMode === 3
              ? pages.map((page, index) =>
                  imageBlob[page] ? (
                    <img
                      key={index}
                      className="page"
                      src={URL.createObjectURL(imageBlob[page])}
                    />
                  ) : null,
                )
              : imageBlob[pages[currentPage]] && (
                  <img
                    className="page"
                    src={URL.createObjectURL(imageBlob[pages[currentPage]])}
                    alt=""
                  />
                )}
            <div className="overlay-buttons">
              <Button
                className="chapter-page-traversal"
                onClick={() => {
                  if (readerMode === 1 || readerMode === 3) {
                    handleNextPage();
                  } else if (readerMode === 2) {
                    handlePreviousPage();
                  }
                }}
              ></Button>
              <Button
                className="chapter-page-traversal"
                onClick={() => {
                  if (readerMode === 1 || readerMode === 3) {
                    handlePreviousPage();
                  } else if (readerMode === 2) {
                    handleNextPage();
                  }
                }}
              ></Button>
            </div>
          </>
        )}{" "}
      </div>

      <div className="centered">
        <Button
          className="chapter-page-traversal-buttons"
          onClick={() => {
            if (readerMode === 1 || readerMode === 3) {
              handleNextChapter();
            } else if (readerMode === 2) {
              handlePreviousChapter();
            }
          }}
        >
          <KeyboardDoubleArrowLeftIcon />
        </Button>
        <Button
          className="chapter-page-traversal-buttons"
          onClick={() => {
            if (readerMode === 1 || readerMode === 3) {
              handleNextPage();
            } else if (readerMode === 2) {
              handlePreviousPage();
            }
          }}
        >
          <KeyboardArrowLeftIcon />
        </Button>
        <Button
          className="chapter-page-traversal-buttons"
          onClick={() => {
            if (readerMode === 1 || readerMode === 3) {
              handlePreviousPage();
            } else if (readerMode === 2) {
              handleNextPage();
            }
          }}
        >
          <KeyboardArrowRightIcon />
        </Button>
        <Button
          className="chapter-page-traversal-buttons"
          onClick={() => {
            if (readerMode === 1 || readerMode === 3) {
              handlePreviousChapter();
            } else if (readerMode === 2) {
              handleNextChapter();
            }
          }}
        >
          <KeyboardDoubleArrowRightIcon />
        </Button>
      </div>
      {readerMode === 3 ? (
        <Typography fontFamily="Figtree" align="center">
          {pages.length} pages
        </Typography>
      ) : (
        <Typography fontFamily="Figtree" align="center">
          {currentPage + 1} / {pages.length}
        </Typography>
      )}
    </div>
  );
};

export default PageAndControls;
