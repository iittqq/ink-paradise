import { useState, useEffect } from "react";
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
import { ScanlationGroup } from "../../interfaces/MangaDexInterfaces";

type Props = {
  mangaLanguages: string[];
  currentOrder: string;
  selectedLanguage: string;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
  setCurrentOffset: React.Dispatch<React.SetStateAction<number>>;
  setCurrentOrder: React.Dispatch<React.SetStateAction<string>>;
  mangaTranslators: ScanlationGroup[];
  setTranslator: React.Dispatch<React.SetStateAction<ScanlationGroup[]>>;
  handleSwitchOrder: () => void;
  handleFilterScanlationGroups: (translator: ScanlationGroup) => void;
};

const MangaControls = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [openTranslators, setOpenTranslators] = useState(false);
  const [translators, setTranslators] = useState<string[]>();
  const [selectedTranslator, setSelectedTranslator] =
    useState<ScanlationGroup>();

  const {
    mangaLanguages,
    currentOrder,
    setSelectedLanguage,
    setCurrentOffset,
    setCurrentOrder,
    mangaTranslators,
    handleSwitchOrder,
    handleFilterScanlationGroups,
  } = props;
  const handleOpenLanguages = () => {
    setOpen(!open);
  };
  const handleOpenTranslators = () => {
    setOpenTranslators(!openTranslators);
  };

  const clickedTranslator = (translator: string) => {
    const translatorObject: ScanlationGroup | undefined = mangaTranslators.find(
      (current) => current.attributes.name === translator,
    );
    if (translatorObject !== undefined) {
      setSelectedTranslator(translatorObject);
      handleFilterScanlationGroups(translatorObject);
    }

    console.log(translatorObject);
  };
  useEffect(() => {
    setTranslators([
      ...new Set(mangaTranslators.map((current) => current.attributes.name)),
    ]);
  }, [mangaTranslators]);
  return (
    <div className="controls-container">
      <div className="controls">
        <List className="list-container">
          <ListItemButton
            className="list-button"
            onClick={() => {
              handleOpenTranslators();
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
        </Button>{" "}
        <List className="list-container">
          <ListItemButton
            className="list-button"
            onClick={() => handleOpenLanguages()}
          >
            <Typography sx={{ color: "#555555", fontFamily: "Figtree" }}>
              Languages
            </Typography>{" "}
            {open ? (
              <ExpandLess sx={{ color: "#333333" }} />
            ) : (
              <ExpandMore sx={{ color: "#333333" }} />
            )}
          </ListItemButton>
        </List>
      </div>
      <Collapse unmountOnExit in={openTranslators} timeout="auto">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ paddingBottom: open ? "10px" : "0px" }}
          spacing={1}
        >
          {translators?.map((current: string) => (
            <Grid item>
              <Button
                className="scanlation-button"
                onClick={() => {
                  clickedTranslator(current);
                  setCurrentOffset(0);
                }}
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
