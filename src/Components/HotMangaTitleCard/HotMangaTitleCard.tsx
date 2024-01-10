/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useState } from "react";

import { Card, CardMedia, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import "./HotMangaTitleCard.css";

type Props = {
  id?: string;
  title: string;
  coverId?: string;
  updatedAt?: string;
  rank?: string;
  coverUrl?: string;
  author?: string;
};

const baseUrl = "https://api.mangadex.org/";
const HotMangaTitleCard = (props: Props) => {
  const navigate = useNavigate();
  const [coverFile, setCoverFile] = useState("");
  //const [showDetails, setShowDetails] = useState(false);

  const { id, title, coverId, updatedAt, rank, coverUrl, author } = props;

  function handleClick() {
    navigate("/individualView", {
      state:
        coverUrl === undefined
          ? { id: id, coverFile: coverFile }
          : { title: title, author: author },
    });
  }

  useEffect(() => {
    if (coverUrl === undefined) {
      fetch(`${baseUrl}/cover/${coverId}`)
        .then((response) => response.json())
        .then((data) => {
          setCoverFile(data.data["attributes"].fileName);
        });
    }
  }, [coverUrl, coverId]);

  return (
    <>
      <Button
        className="button"
        onClick={() => {
          handleClick();
        }}
      >
        <Card
          sx={{
            width: "300px",
            height: "400px",
            position: "relative",
            backgroundColor: "#121212",
          }}
        >
          <CardMedia
            sx={{
              width: "100%",
              height: "80%",
            }}
            image={
              coverUrl === undefined
                ? "https://uploads.mangadex.org/covers/" + id + "/" + coverFile
                : coverUrl
            }
          />
          <div className="overlay"></div>
          <div className="infoBar">
            <Typography
              textTransform="none"
              color="white"
              noWrap
              sx={{
                fontSize: 10,
                maxWidth: "200px",
                overflow: "hidden",
                top: 0,
              }}
            >
              {title}
            </Typography>
            <Typography
              color="white"
              sx={{
                fontSize: 10,
              }}
            >
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
        </Card>
      </Button>
    </>
  );
};

export default HotMangaTitleCard;
