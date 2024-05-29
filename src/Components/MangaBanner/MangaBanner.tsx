/* eslint-disable no-mixed-spaces-and-tabs */
import { Typography, Button } from "@mui/material";
import { useState } from "react";
import "./MangaBanner.css";

type Props = {
  id: string;
  coverFile: string;
  mangaDescription: string;
  mangaName: string;
};

const MangaBanner = (props: Props) => {
  const [showMoreToggled, setShowMoreToggled] = useState(false);
  const { id, coverFile, mangaDescription, mangaName } = props;
  const handleShowMore = () => {
    setShowMoreToggled(!showMoreToggled);
  };
  return (
    <div className="banner-container">
      <div className="cover-image">
        <img
          style={{ width: "100%", height: "100%" }}
          src={"https://uploads.mangadex.org/covers/" + id + "/" + coverFile}
          alt=""
        />
      </div>
      <div className="manga-details">
        <Typography
          className="manga-name"
          sx={{
            fontSize: { xs: 20, sm: 25, lg: 30 },
          }}
        >
          {mangaName}
        </Typography>

        <Typography
          className="manga-description"
          sx={{
            WebkitLineClamp: showMoreToggled === true ? 5 : 1,
            fontSize: { xs: 15, sm: 15, lg: 20 },
          }}
        >
          {mangaDescription}
        </Typography>

        <Button
          variant="text"
          className="show-button"
          sx={{
            height: { xs: "20px", sm: "25px", lg: "30px" },
          }}
          onClick={handleShowMore}
        >
          {showMoreToggled === true ? (
            <Typography
              color="#333333"
              fontFamily="Figtree"
              sx={{ fontSize: { xs: 10, sm: 10, lg: 12 } }}
            >
              Show less
            </Typography>
          ) : (
            <Typography
              color="#333333"
              fontFamily="Figtree"
              sx={{ fontSize: { xs: 10, sm: 10, lg: 12 } }}
            >
              Show more
            </Typography>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MangaBanner;
