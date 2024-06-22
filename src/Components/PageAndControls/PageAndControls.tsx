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
  } = props;
  const [loading, setLoading] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

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
    chapters.forEach((current: MangaFeedScanlationGroup, index) => {
      if (
        parseInt(current.attributes.chapter) === parseInt(currentChapter) + 1 &&
        chapters[index].attributes.externalUrl === null
      ) {
        handleClick(
          mangaId,
          chapters[index].id,
          chapters[index].attributes.title,
          chapters[index].attributes.volume,
          chapters[index].attributes.chapter,
          mangaName,
          scanlationGroup,
        );
      } else {
        console.log("redirect");
        return;
      }
    });
  };

  const handlePreviousChapter = () => {
    setCurrentPage(0);
    chapters.forEach((current: MangaFeedScanlationGroup, index) => {
      if (
        parseInt(current.attributes.chapter) === parseInt(currentChapter) - 1 &&
        chapters[index].attributes.externalUrl === null
      ) {
        handleClick(
          mangaId,
          chapters[index].id,
          chapters[index].attributes.title,
          chapters[index].attributes.volume,
          chapters[index].attributes.chapter,
          mangaName,
          scanlationGroup,
        );
      } else {
        console.log("redirect");
        return;
      }
    });
  };

  const handlePreviousPage = () => {
    setLoading(true);
    currentPage === 0
      ? handlePreviousChapter()
      : setCurrentPage(currentPage - 1);
    setLoading(false);
    window.localStorage.setItem("position", window.scrollY.toString());
  };

  const handleNextPage = () => {
    setLoading(true);
    currentPage === pages.length - 1
      ? handleNextChapter()
      : setCurrentPage(currentPage + 1);
    window.localStorage.setItem("position", window.scrollY.toString());
  };

  const handleLoadImage = async (hash: string, page: string): Promise<void> => {
    setLoading(true);
    return fetchPageImageBackend(hash, page)
      .then((blob) => {
        setImageBlob(blob);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error loading image:", error);
        throw error;
      });
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
    if (currentPage >= 0 && currentPage < pages.length) {
      handleLoadImage(hash, pages[currentPage]).catch((error) => {
        console.error("Error loading image:", error);
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
        {loading ? (
          <div className="loading">
            <CircularProgress size={25} sx={{ color: "#ffffff" }} />
          </div>
        ) : (
          <>
            {imageBlob && (
              <img
                className="page"
                src={URL.createObjectURL(imageBlob)}
                alt=""
              />
            )}
            <div className="overlay-buttons">
              <Button
                className="chapter-page-traversal"
                onClick={() => handleNextPage()}
              ></Button>
              <Button
                className="chapter-page-traversal"
                onClick={() => handlePreviousPage()}
              ></Button>
            </div>
          </>
        )}{" "}
      </div>

      <div className="centered">
        <Button
          sx={{ color: "white" }}
          onClick={() => {
            handleNextChapter();
          }}
        >
          <KeyboardDoubleArrowLeftIcon />
        </Button>
        <Button
          sx={{ color: "white" }}
          onClick={() => {
            handleNextPage();
          }}
        >
          <KeyboardArrowLeftIcon />
        </Button>
        <Button
          sx={{ color: "white" }}
          onClick={() => {
            handlePreviousPage();
          }}
        >
          <KeyboardArrowRightIcon />
        </Button>
        <Button
          sx={{ color: "white" }}
          onClick={() => {
            handlePreviousChapter();
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
