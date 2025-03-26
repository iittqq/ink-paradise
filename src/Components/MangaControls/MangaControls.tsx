import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import GroupIcon from "@mui/icons-material/Group";
import "./MangaControls.css";
import { ScanlationGroup } from "../../interfaces/MangaDexInterfaces";
import TranslateIcon from "@mui/icons-material/Translate";
type Props = {
  mangaLanguages: string[];
  selectedLanguage: string;
  handleClickedLanguageButton: (language: string) => void;
  mangaTranslators: ScanlationGroup[];
  setTranslator: React.Dispatch<React.SetStateAction<ScanlationGroup[]>>;
  handleSwitchOrder: () => void;
  handleFilterScanlationGroups: (
    translator: ScanlationGroup | undefined,
  ) => void;
  selectedScanlationGroup: ScanlationGroup | undefined;
};

const MangaControls = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [openTranslators, setOpenTranslators] = useState(false);
  const [translators, setTranslators] = useState<string[]>();

  const {
    mangaLanguages,
    handleClickedLanguageButton,
    selectedLanguage,
    mangaTranslators,
    handleSwitchOrder,
    handleFilterScanlationGroups,
    selectedScanlationGroup,
  } = props;
  const handleOpenLanguages = () => {
    setOpen(true);
  };
  const handleOpenTranslators = () => {
    setOpenTranslators(true);
  };

  const handleCloseTranslators = () => {
    setOpenTranslators(false);
  };

  const handleCloseLanguages = () => {
    setOpen(false);
  };

  const clickedTranslator = (translator: string | undefined) => {
    const translatorObject: ScanlationGroup | undefined = mangaTranslators.find(
      (current) => current.attributes.name === translator,
    );
    handleFilterScanlationGroups(translatorObject);
  };
  useEffect(() => {
    setTranslators([
      ...new Set(mangaTranslators.map((current) => current.attributes.name)),
    ]);
  }, [mangaTranslators]);
  return (
    <div className="controls-container">
      <div className="controls">
        <Button
          className="list-button"
          onClick={() => {
            handleOpenTranslators();
          }}
        >
          <GroupIcon className="controls-icon" />
        </Button>
        <Button
          className="asc-desc-button"
          sx={{ ":hover": { backgroundColor: "transparent" } }}
          onClick={() => {
            handleSwitchOrder();
          }}
        >
          <SwapVertIcon className="controls-icon" />
        </Button>{" "}
        <Button className="list-button" onClick={() => handleOpenLanguages()}>
          <TranslateIcon className="controls-icon" />
        </Button>
      </div>
      <Dialog
        open={openTranslators}
        onClose={handleCloseTranslators}
        className="controls-dialog"
      >
        <DialogTitle className="controls-dialog-title">
          Scanlation Groups
        </DialogTitle>

        <DialogActions className="controls-dialog-option-list">
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ paddingBottom: open ? "10px" : "0px" }}
            spacing={1}
          >
            <Grid item>
              {" "}
              <Button
                className="scanlation-button"
                onClick={() => {
                  clickedTranslator(undefined);
                }}
              >
                <Typography
                  className="scanlation-text"
                  sx={{
                    fontSize: { xs: 10, sm: 10, lg: 12 },
                    opacity: selectedScanlationGroup === undefined ? 0.5 : 1,
                  }}
                >
                  All
                </Typography>
              </Button>
            </Grid>

            {translators?.map((current: string) => (
              <Grid item>
                <Button
                  className="scanlation-button"
                  sx={{
                    opacity:
                      current === selectedScanlationGroup?.attributes.name
                        ? 0.5
                        : 1,
                  }}
                  onClick={() => {
                    clickedTranslator(current);
                  }}
                >
                  <Typography
                    className="scanlation-text"
                    sx={{ fontSize: { xs: 10, sm: 10, lg: 12 } }}
                  >
                    {current}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open}
        onClose={handleCloseLanguages}
        className="controls-dialog"
      >
        <DialogTitle className="controls-dialog-title">Languages</DialogTitle>
        <DialogActions className="controls-dialog-option-list">
          {" "}
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
                    handleClickedLanguageButton(current);
                  }}
                  sx={{
                    ":hover": { backgroundColor: "transparent" },
                    opacity: current === selectedLanguage ? 0.5 : 1,
                  }}
                >
                  <Typography
                    sx={{ fontSize: { xs: 10, sm: 10, lg: 12 } }}
                    className="language-text"
                  >
                    {current}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MangaControls;
