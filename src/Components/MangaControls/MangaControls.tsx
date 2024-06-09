import { useState } from "react";
import {
  List,
  ListItemButton,
  Collapse,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import SwapVertIcon from "@mui/icons-material/SwapVert";

import "./MangaControls.css";

type Props = {
  mangaLanguages: string[];
  currentOrder: string;
  selectedLanguage: string;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
  setCurrentOffset: React.Dispatch<React.SetStateAction<number>>;
  setCurrentOrder: React.Dispatch<React.SetStateAction<string>>;
  mangaTranslators: object[];
  setTranslator: React.Dispatch<React.SetStateAction<object[]>>;
  handleSwitchOrder: () => void;
};

const MangaControls = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [openTranslators, setOpenTranslators] = useState(false);
  const [uniqueTranslators, setUniqueTranslators] = useState<object[]>([]);
  const [doneSettingTranslators, setDoneSettingTranslators] = useState(false);

  const {
    mangaLanguages,
    currentOrder,
    setSelectedLanguage,
    setCurrentOffset,
    setCurrentOrder,
    mangaTranslators,
    handleSwitchOrder,
  } = props;
  const handleOpenLanguages = () => {
    setOpen(!open);
  };
  const handleOpenTranslators = () => {
    setOpenTranslators(!openTranslators);
  };

  const distinguishUniqueTranslators = () => {
    if (doneSettingTranslators === false) {
      const uniqueTranslatorsArray: object[] = [];

      for (const current of mangaTranslators) {
        if (!uniqueTranslatorsArray.includes(current)) {
          uniqueTranslatorsArray.push(current);
        }
      }
      console.log(uniqueTranslatorsArray);
      setUniqueTranslators(uniqueTranslatorsArray);
    }
    setDoneSettingTranslators(true);
  };

  return (
    <div className="controls-container">
      <div className="controls">
        <List className="list-container">
          <ListItemButton
            className="list-button"
            onClick={() => {
              handleOpenTranslators();
              distinguishUniqueTranslators();
            }}
          >
            <Typography sx={{ color: "#555555", fontFamily: "Figtree" }}>
              Translators
            </Typography>
            {openTranslators ? (
              <ExpandLess sx={{ color: "#333333" }} />
            ) : (
              <ExpandMore sx={{ color: "#333333" }} />
            )}
          </ListItemButton>
        </List>
        <List className="list-container">
          <ListItemButton
            className="list-button"
            onClick={() => handleOpenLanguages()}
          >
            <Typography sx={{ color: "#555555", fontFamily: "Figtree" }}>
              Translators
            </Typography>{" "}
            {open ? (
              <ExpandLess sx={{ color: "#333333" }} />
            ) : (
              <ExpandMore sx={{ color: "#333333" }} />
            )}
          </ListItemButton>
        </List>
        <Button
          className="asc-desc-button"
          sx={{ ":hover": { backgroundColor: "transparent" } }}
          onClick={() => {
            console.log(currentOrder);
            handleSwitchOrder();
            if (currentOrder === "desc") {
              setCurrentOrder("asc");
            } else {
              setCurrentOrder("desc");
            }
          }}
        >
          <SwapVertIcon />
        </Button>
      </div>
      <Collapse unmountOnExit in={openTranslators} timeout="auto">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{}}
          spacing={1}
        >
          {uniqueTranslators.map((current: object) => (
            <Grid item>
              <Button
                className="translator-button"
                onClick={() => {
                  //setTranslator(current);
                  setCurrentOffset(0);
                }}
              >
                <Typography
                  sx={{ fontSize: { xs: 10, sm: 10, lg: 12 } }}
                  color="#333333"
                  fontFamily="Figtree"
                >
                  {current.toString()}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Collapse>
      <Collapse unmountOnExit in={open} timeout="auto">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{}}
          spacing={1}
        >
          {mangaLanguages.map((current) => (
            <Grid item>
              <Button
                className="language-button"
                onClick={() => {
                  setSelectedLanguage(current);
                  setCurrentOffset(0);
                }}
                sx={{ ":hover": { backgroundColor: "transparent" } }}
              >
                <Typography
                  sx={{ fontSize: { xs: 10, sm: 10, lg: 12 } }}
                  color="#333333"
                  fontFamily="Figtree"
                >
                  {current}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </div>
  );
};

export default MangaControls;
