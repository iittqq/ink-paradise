import { Button, Dialog, DialogTitle, Grid } from "@mui/material";
import "./ThemeButton.css";

type Props = {
  openThemes: boolean;
  handleThemeDialogClose: () => void;
  handleThemeChange: (theme: number) => void;
};

const ThemeButton = (props: Props) => {
  const { openThemes, handleThemeDialogClose, handleThemeChange } = props;

  return (
    <div className="theme-container">
      <Dialog
        id="open-theme-dialog"
        open={openThemes}
        onClose={handleThemeDialogClose}
      >
        <DialogTitle className="open-theme-dialog-title">Themes</DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Button
              onClick={() => {
                handleThemeChange(0);
              }}
              className="theme-button"
            >
              Dark Mode
            </Button>
          </Grid>{" "}
          <Grid item>
            <Button
              onClick={() => {
                handleThemeChange(1);
              }}
              className="theme-button"
            >
              Light Mode
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                handleThemeChange(2);
              }}
              className="theme-button"
            >
              Light Pastel
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                handleThemeChange(3);
              }}
              className="theme-button"
            >
              Dark Pastel
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                handleThemeChange(4);
              }}
              className="theme-button"
            >
              Dev Theme
            </Button>{" "}
          </Grid>{" "}
        </Grid>
      </Dialog>
    </div>
  );
};
export default ThemeButton;
