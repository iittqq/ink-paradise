import { Card, CardMedia, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import "./MangaClickable.css";

type Props = {
  id?: string;
  title: string;
  coverUrl?: string;
  updatedAt?: string;
  disabled?: boolean;
};

const MangaClickable = (props: Props) => {
  const navigate = useNavigate();
  //const [showDetails, setShowDetails] = useState(false);

  const { id, title, coverUrl, updatedAt, disabled } = props;

  function handleClick() {
    const encodedCoverUrl = encodeURIComponent(coverUrl!);
    navigate(`/individualView/${id}/${encodedCoverUrl}`);
  }

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
            image={coverUrl}
          />
        </Card>

        <div className="overlay">
          <Typography
            textTransform="none"
            color="white"
            className="overlay-title"
          >
            {title}
          </Typography>
          <Typography color="white" className="overlay-date">
            {updatedAt === undefined
              ? null
              : dayjs(updatedAt).format("DD/MM/YYYY ")}
          </Typography>
        </div>
      </Button>
    </>
  );
};

export default MangaClickable;
