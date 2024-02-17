/* eslint-disable no-mixed-spaces-and-tabs */
import React, { ReactElement, ReactNode } from "react";
import { useEffect, useState } from "react";

import { TopManga } from "../../interfaces/MangaDexInterfaces";

import { Card, CardMedia, Grid, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import { useNavigate } from "react-router-dom";

import { fetchTopManga } from "../../api/MalApi";
import { Translate } from "@mui/icons-material";
import "./HotMangaCarousel.css";

type Props = {
  children: ReactNode;
};

const baseUrl = "https://api.mangadex.org/";

interface CarouselItemProps {
  id: string;
  image: string;
  rank: string;
  title: string;
  author: string;
}

export const CarouselItem = (props: CarouselItemProps) => {
  const navigate = useNavigate();
  const [coverFile, setCoverFile] = useState("");

  function handleClick(
    coverUrl: string,
    id: string,
    title: string,
    author: string
  ) {
    navigate("/individualView", {
      state:
        coverUrl === undefined
          ? { id: id, coverFile: coverFile }
          : { title: title, author: author },
    });
  }
  return (
    <div
      className="carousel-item"
      onClick={() => {
        handleClick(props.image, props.id, props.title, props.author);
      }}
    >
      <div className="carousel-text">
        <div className="title-text">
          {props.title.length > 28
            ? `${props.title.substring(0, 28)}...`
            : props.title}
        </div>
        <Typography
          color="#ebe814"
          fontWeight="600"
          variant="h6"
          className="rank-Text"
        >
          {props.rank != "10" ? `0${props.rank}` : props.rank}
        </Typography>
      </div>
      <img className="carousel-image" src={props.image}></img>
    </div>
  );
};

const HotMangaCarousel = (props: Props) => {
  const navigate = useNavigate();
  //const [index, setIndex] = useState(0);
  const [coverFile, setCoverFile] = useState("");
  const [topMangaData, setTopMangaData] = useState<TopManga[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  function updateIndex(newIndex: number): void {
    if (newIndex < 0) {
      newIndex = 5;
    } else if (newIndex + 4 >= React.Children.count(props.children)) {
      newIndex = 0;
    }
    setActiveIndex(newIndex);
  }

  useEffect(() => {
    fetchTopManga().then((data: TopManga[]) => {
      setTopMangaData(data);
    });
  }, []);

  return (
    <div className="carousel">
      <div className="indicators">
        <KeyboardArrowLeftIcon
          sx={{
            color: "white",
            width: "50px",
            height: "50px",
            marginRight: "50px",
          }}
          onClick={() => {
            updateIndex(activeIndex - 1);
          }}
        ></KeyboardArrowLeftIcon>
      </div>
      <div className="carousel-selector">
        <div
          className="inner"
          style={{ transform: `translateX(-${activeIndex * 20}%)` }}
        >
          {React.Children.map(props.children, (child: any, index: number) => {
            return React.cloneElement(child);
          })}
        </div>
      </div>
      <div className="indicators">
        <KeyboardArrowRightIcon
          sx={{
            color: "white",
            width: "50px",
            height: "50px",
            marginLeft: "50px",
          }}
          onClick={() => {
            updateIndex(activeIndex + 1);
          }}
        ></KeyboardArrowRightIcon>
      </div>
    </div>
  );
};

export default HotMangaCarousel;
