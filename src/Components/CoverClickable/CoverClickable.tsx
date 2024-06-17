import { useEffect, useState } from "react";
import { Card, CardMedia, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
  id: string;
  title: string;
  coverId: string;
  updatedAt?: string;
};

const baseUrl = "https://api.mangadex.org";
const CoverClickable = (props: Props) => {
  const navigate = useNavigate();
  const [coverFile, setCoverFile] = useState("");

  const { id, title, coverId } = props;

  function handleClick() {
    navigate("/individualView", {
      state: { id: id, coverFile: coverFile },
    });
  }

  useEffect(() => {
    fetch(`${baseUrl}/cover/${coverId}`)
      .then((response) => response.json())
      .then((data) => {
        setCoverFile(data.data["attributes"].fileName);
      });
  }, [coverId]);

  return (
    <div>
      <Button
        sx={{
          backgroundColor: "transparent",
          "&.MuiButtonBase-root:hover": {
            bgcolor: "transparent",
          },
          ".MuiTouchRipple-child": {
            backgroundColor: "white",
          },
          width: "100px",
          height: "150px",
        }}
        onClick={() => {
          handleClick();
        }}
      >
        <Card
          sx={{
            borderRadius: "6%",
          }}
        >
          <Box sx={{ position: "absolute" }}>
            <CardMedia
              sx={{
                width: "100px",
                height: "150px",
                borderRadius: "6%",
              }}
              image={
                "https://uploads.mangadex.org/covers/" + id + "/" + coverFile
              }
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                backgroundImage:
                  "linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.05)) ",
                borderRadius: "4%",
                backgroundSize: "100px 150px",
                color: "white",
                padding: "10px",
              }}
            >
              <Typography
                color="white"
                marginTop={14}
                marginRight={0}
                marginLeft={0}
                textTransform="none"
                sx={{
                  fontSize: 10,
                  maxWidth: "100px",
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  position: "static",
                  alignContent: "flex-end",
                }}
              >
                {title}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Button>
    </div>
  );
};

export default CoverClickable;
