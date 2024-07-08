import { Button, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useNavigate } from "react-router-dom";
import "./PageAndControls.css";

import { MangaFeedScanlationGroup } from "../../interfaces/MangaDexInterfaces";
import { fetchPageImageBackend } from "../../api/MangaDexApi";

type Props = {
  chapters: MangaFeedScanlationGroup[];
  pages: string[];
  hash: string;
  currentChapter: string;
  mangaId: string;
  mangaName: string;
  scanlationGroup: string;
  readerMode: number;
};

const PageAndControls = (props: Props) => {
  const {
    chapters,
    pages,
    hash,
    currentChapter,
    mangaId,
    mangaName,
    scanlationGroup,
    readerMode,
  } = props;
  const [imageBlob, setImageBlob] = useState<Blob[]>([]);
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(pages.length).fill(false),
  );
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
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
    for (let index = 0; index < chapters.length; index++) {
      const current = chapters[index];
      if (
        parseFloat(current.attributes.chapter) === parseFloat(currentChapter) &&
        chapters[index].attributes.externalUrl === null
      ) {
        handleClick(
          mangaId,
          chapters[index + 1].id,
          chapters[index + 1].attributes.title,
          chapters[index + 1].attributes.volume,
          chapters[index + 1].attributes.chapter,
          mangaName,
          scanlationGroup,
        );
      }
    }
  };

  const handlePreviousChapter = () => {
    setCurrentPage(0);
    for (let index = 0; index < chapters.length; index++) {
      const current = chapters[index];
      if (
        parseFloat(current.attributes.chapter) === parseFloat(currentChapter) &&
        chapters[index].attributes.externalUrl === null
      ) {
        handleClick(
          mangaId,
          chapters[index - 1].id,
          chapters[index - 1].attributes.title,
          chapters[index - 1].attributes.volume,
          chapters[index - 1].attributes.chapter,
          mangaName,
          scanlationGroup,
        );
      }
    }
  };

  const handlePreviousPage = () => {
    currentPage === 0
      ? handlePreviousChapter()
      : setCurrentPage(currentPage - 1);
    window.localStorage.setItem("position", window.scrollY.toString());
  };

  const handleNextPage = () => {
    currentPage === pages.length - 1
      ? handleNextChapter()
      : setCurrentPage(currentPage + 1);
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
          setImageBlob((prevBlobs) => [...prevBlobs, blob]);

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
    chapter: string,
    mangaName: string,
    scanlationGroup: string,
  ) => {
    navigate("/reader", {
      state: {
        mangaId: mangaId,
        chapterId: chapterId,
        title: title,
        volume: volume,
        chapter: chapter,
        mangaName: mangaName,
        scanlationGroup: scanlationGroup,
      },
    });
  };

  useEffect(() => {
    setImageBlob([]);
    if (currentPage >= 0 && currentPage < pages.length) {
      handleLoadImage(hash, pages).catch((error) => {
        console.error("Error loading image:", error);
        throw error;
      });
    }
  }, [currentPage, hash, pages]);
  return (
    <div className="page-and-controls-container">
      <div
        className="page-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {loadingStates[currentPage] ? (
          <div className="loading">
            <CircularProgress size={25} sx={{ color: "#ffffff" }} />
          </div>
        ) : (
          <>
            {imageBlob[currentPage] && (
              <img
                className="page"
                src={URL.createObjectURL(imageBlob[currentPage])}
                alt=""
              />
            )}
            <div className="overlay-buttons">
              <Button
                className="chapter-page-traversal"
                onClick={() => {
                  if (readerMode === 1) {
                    handleNextPage();
                  } else if (readerMode === 2) {
                    handlePreviousPage();
                  }
                }}
              ></Button>
              <Button
                className="chapter-page-traversal"
                onClick={() => {
                  if (readerMode === 1) {
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
          sx={{ color: "white" }}
          onClick={() => {
            if (readerMode === 1) {
              handleNextChapter();
            } else if (readerMode === 2) {
              handlePreviousChapter();
            }
          }}
        >
          <KeyboardDoubleArrowLeftIcon />
        </Button>
        <Button
          sx={{ color: "white" }}
          onClick={() => {
            if (readerMode === 1) {
              handleNextPage();
            } else if (readerMode === 2) {
              handlePreviousPage();
            }
          }}
        >
          <KeyboardArrowLeftIcon />
        </Button>
        <Button
          sx={{ color: "white" }}
          onClick={() => {
            if (readerMode === 1) {
              handlePreviousPage();
            } else if (readerMode === 2) {
              handleNextPage();
            }
          }}
        >
          <KeyboardArrowRightIcon />
        </Button>
        <Button
          sx={{ color: "white" }}
          onClick={() => {
            if (readerMode === 1) {
              handlePreviousChapter();
            } else if (readerMode === 2) {
              handleNextChapter();
            }
          }}
        >
          <KeyboardDoubleArrowRightIcon />
        </Button>
      </div>

      <Typography color="white" fontFamily="Figtree" align="center">
        {currentPage + 1} / {pages.length}
      </Typography>
    </div>
  );
};

export default PageAndControls;
