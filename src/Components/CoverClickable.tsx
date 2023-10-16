import React, { useEffect, useState } from "react";

import axios from "axios";
import { Card, CardMedia, Button, Typography, Grid, Box} from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
	id: string;
	title: string;
	coverId: string;
	updatedAt?: string;
	homePage?: boolean;
};

const baseUrl = "https://api.mangadex.org";
const CoverClickable = (props: Props) => {
	let navigate = useNavigate();
	const [coverFile, setCoverFile] = useState("");

	const { id, title, coverId, homePage } = props;

	const fetchCoverFile = async () => {
		fetch(`${baseUrl}/cover/${coverId}`)
			.then((response) => response.json())
			.then((data) => {
				setCoverFile(data.data["attributes"].fileName);
			});
	};

	function handleClick() {
		navigate("/individualView", {
			state: { id: id, coverFile: coverFile },
		});
	}

	useEffect(() => {
		fetchCoverFile();
	}, [props]);

	return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Button
        sx={{
          backgroundColor: "transparent",
          "&.MuiButtonBase-root:hover": {
            bgcolor: "transparent",
          },
          ".MuiTouchRipple-child": {
            backgroundColor: "white",
          },
          width: "100%",
        }}
        onClick={() => {
          handleClick();
        }}
      >
        <Grid
          container
          direction="column"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Grid item>
            <Card
              sx={{
                width: "100px",
                height: "150px",
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
                    "https://uploads.mangadex.org/covers/" +
                    id +
                    "/" +
                    coverFile
                  }
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "-1px",
                    left: 0,
                    width: "80%",
                    height: "130px",
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
                      fontSize: { xs: 10, sm: 10, lg: 10 },
                      maxWidth: "100px",
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: homePage === true ? 1 : 2,
                      position: "static",
                      alignContent: "flex-end",
                    }}
                  >
                    {title}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Button>
    </div>
  );
};

export default CoverClickable;
