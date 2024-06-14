/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useState } from "react";

import { Card, CardMedia, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import "./MangaClickable.css";
import { fetchMangaCover } from "../../api/MangaDexApi";

type Props = {
  id?: string;
  title: string;
  coverId?: string;
  updatedAt?: string;
  rank?: string;
  disabled?: boolean;
};

const MangaClickable = (props: Props) => {
  const navigate = useNavigate();
  const [coverFile, setCoverFile] = useState("");
  //const [showDetails, setShowDetails] = useState(false);

  const { id, title, coverId, updatedAt, rank, disabled } = props;

  function handleClick() {
    navigate("/individualView", {
      state: { id: id, coverFile: coverFile },
    });
  }

  useEffect(() => {
    if (coverId !== undefined) {
      fetchMangaCover(coverId).then((data) => {
        setCoverFile(data.attributes.fileName);
      });
    }
  }, [coverId]);

  return (
    <>
      <Button
        className="manga-button"
        disabled={disabled && disabled != undefined ? true : false}
        onClick={() => {
          handleClick();
        }}
      >
        <Card
          sx={{
            width: { xs: "100px", sm: "130px", md: "130px", lg: "130px" },
            height: { xs: "150px", sm: "200px", md: "200px", lg: "200px" },
            position: "relative",
          }}
        >
          <CardMedia
            sx={{
              width: "100%",
              height: "100%",
            }}
            image={
              "https://uploads.mangadex.org/covers/" + id + "/" + coverFile
            }
          />
        </Card>

        <div className="overlay">
          <Typography
            textTransform="none"
            color="white"
            noWrap
            className="overlay-title"
          >
            {title}
          </Typography>
          <Typography color="white" className="overlay-date">
            {updatedAt === undefined
              ? null
              : dayjs(updatedAt).format("DD/MM/YYYY / HH:MM")}
          </Typography>
          {rank === undefined ? null : (
            <Typography
              textTransform="none"
              color="white"
              sx={{
                fontSize: 10,
              }}
            >
              Rank: {rank}
            </Typography>
          )}
        </div>
      </Button>
    </>
  );
};

export default MangaClickable;
