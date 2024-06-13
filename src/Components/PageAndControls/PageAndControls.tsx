/* eslint-disable no-mixed-spaces-and-tabs */
import { Button, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useNavigate } from "react-router-dom";
import "./PageAndControls.css";

import {
  MangaFeedScanlationGroup,
  PageImage,
} from "../../interfaces/MangaDexInterfaces";

type Props = {
  chapters: MangaFeedScanlationGroup[];
  pages: string[];
  pageBaseUrl: string;
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
    pageBaseUrl,
    hash,
    currentChapter,
    mangaId,
    mangaName,
    scanlationGroup,
  } = props;
  const [loading, setLoading] = useState(false);

  const [pageUrl, setPageUrl] = useState<string>("");

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);

  const handleNextChapter = () => {
    setCurrentPage(0);
    chapters.forEach((current: MangaFeedScanlationGroup, index: number) =>
      current.attributes.chapter === currentChapter
        ? handleClick(
            mangaId,
            chapters[index + 1]?.id,
            chapters[index + 1]?.attributes?.title,
            chapters[index + 1]?.attributes?.volume,
            chapters[index + 1]?.attributes?.chapter,
            mangaName,
            scanlationGroup,
          )
        : null,
    );
  };

  const handlePreviousChapter = () => {
    setCurrentPage(0);
    chapters.forEach((current: MangaFeedScanlationGroup, index) =>
      current.attributes.chapter === currentChapter
        ? handleClick(
            mangaId,
            chapters[index - 1].id,
            chapters[index - 1].attributes.title,
            chapters[index - 1].attributes.volume,
            chapters[index - 1].attributes.chapter,
            mangaName,
            scanlationGroup,
          )
        : null,
    );
  };

  const handlePreviousChapterButton = () => {
    setLoading(true);
    currentPage === 0
      ? handlePreviousChapter()
      : setCurrentPage(currentPage - 1);
    setLoading(false);
  };

  const handleNextChapterButton = () => {
    setLoading(true);
    currentPage === pages.length - 1
      ? handleNextChapter()
      : setCurrentPage(currentPage + 1);
  };

  const handleLoadImage = (image: PageImage): Promise<string> => {
    setLoading(true);

    return loadImage(image);
  };

  const loadImage = (image: PageImage): Promise<string> => {
    return new Promise((resolve, reject) => {
      const loadImg = new Image();
      loadImg.src = image.url;

      loadImg.onload = () => {
        setLoading(false);
        console.log(image.url);
        console.log(image);
        resolve(image.url);

        console.log(image.url);
      };

      loadImg.onerror = (error) => {
        setLoading(false);
        reject(error);
      };
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
    const image = { url: pageBaseUrl + hash + "/" + pages[currentPage] };
    handleLoadImage(image)
      .then((url: string) => {
        setPageUrl(url);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentPage, hash, pageBaseUrl]);

  return (
    <div>
      <div className="page-container">
        {loading ? (
          <div className="loading">
            <CircularProgress size={25} sx={{ color: "#ffffff" }} />
          </div>
        ) : (
          <>
            <img className="page" src={pageUrl} alt="" />
            <div className="overlay-buttons">
              <Button
                className="chapter-page-traversal"
                onClick={() => handleNextChapterButton()}
              ></Button>
              <Button
                className="chapter-page-traversal"
                onClick={() => handlePreviousChapterButton()}
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
            handleNextChapterButton();
          }}
        >
          <KeyboardArrowLeftIcon />
        </Button>
        <Button
          sx={{ color: "white" }}
          onClick={() => {
            handlePreviousChapterButton();
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
