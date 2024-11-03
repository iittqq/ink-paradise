import { Typography } from "@mui/material";
import "./MangaBanner.css";

type Props = {
  coverUrl: string;
  mangaDescription: string;
  mangaName: string;
  author: string | undefined;
  contentRating: string;
  status: string | undefined;
};

const MangaBanner = (props: Props) => {
  const {
    coverUrl,
    mangaDescription,
    mangaName,
    author,
    contentRating,
    status,
  } = props;

  return (
    <div className="banner-container">
      <div className="cover-name-container">
        <img className="cover-image" src={coverUrl} alt="" />
        <div className="header-details-stack">
          <Typography
            className="manga-name"
            sx={{
              fontSize: { xs: 20, sm: 25, lg: 30 },
            }}
          >
            {mangaName}
          </Typography>
          {author !== undefined ? (
            <Typography
              className="manga-author"
              sx={{
                fontSize: { xs: 15, sm: 20, lg: 25 },
              }}
            >
              Author: <span className="manga-details-color-text">{author}</span>
            </Typography>
          ) : null}
          <Typography
            className="manga-author"
            sx={{
              fontSize: { xs: 15, sm: 20, lg: 25 },
            }}
          >
            Content Rating:{" "}
            <span className="manga-details-color-text">{contentRating}</span>
          </Typography>
          <Typography
            className="manga-author"
            sx={{
              fontSize: { xs: 15, sm: 20, lg: 25 },
            }}
          >
            Status: <span className="manga-details-color-text"> {status}</span>
          </Typography>
        </div>
      </div>
      <div className="manga-details">
        <Typography
          className="manga-description"
          sx={{
            WebkitLineClamp: 5,
            fontSize: { xs: 15, sm: 15, lg: 18 },
          }}
        >
          {mangaDescription}
        </Typography>
      </div>
    </div>
  );
};

export default MangaBanner;
