import { Grid, Button, Dialog, DialogTitle } from "@mui/material";
import "./InfoButtonHome.css";

type Props = {
  openInfo: boolean;
  handleInfoDialogClose: () => void;
};

const InfoButtonHome = (props: Props) => {
  const { openInfo, handleInfoDialogClose } = props;

  return (
    <div className="info-home-container">
      <Dialog
        id="open-info-dialog"
        open={openInfo}
        onClose={handleInfoDialogClose}
      >
        <DialogTitle className="open-info-dialog-title">Links</DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Button
              onClick={() => {
                window.location.href = "https://discord.gg/xEs93tEDGC";
              }}
              className="info-button"
            >
              Discord
            </Button>
          </Grid>{" "}
          <Grid item>
            {" "}
            <Button
              onClick={() => {
                window.location.href = "https://www.reddit.com/r/inkparadise/";
              }}
              className="info-button"
            >
              Reddit
            </Button>
          </Grid>{" "}
          <Grid item>
            {" "}
            <Button
              onClick={() => {
                window.location.href = "https://x.com/leafwhistle";
              }}
              className="info-button"
            >
              Twitter
            </Button>
          </Grid>{" "}
          <Grid item>
            {" "}
            <Button
              onClick={() => {
                window.location.href = "https://www.patreon.com/inkparadise";
              }}
              className="info-button"
            >
              Patreon
            </Button>
          </Grid>{" "}
          <Grid item>
            {" "}
            <Button
              onClick={() => {
                window.location.href =
                  "https://www.instagram.com/inkparadise.manga/";
              }}
              className="info-button"
            >
              Instagram
            </Button>{" "}
          </Grid>{" "}
        </Grid>
      </Dialog>
    </div>
  );
};
export default InfoButtonHome;
