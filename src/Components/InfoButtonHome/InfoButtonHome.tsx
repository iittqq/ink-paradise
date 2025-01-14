import { Grid, Button, Dialog, DialogTitle } from "@mui/material";
import "./InfoButtonHome.css";
import { SocialIcon } from "react-social-icons";

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
        <DialogTitle className="open-info-dialog-title">
          Welcome to<br></br> ink-paradise
        </DialogTitle>
        <div className="info-dialog-text-content">
          <p>Developer:</p>
          <p>iittqq - i'm in the discord</p>
          <p>Objective:</p>
          <p>
            Provide an enjoyable manga reading experience for anyone interested
            :)
          </p>
          <h2>Links:</h2>
        </div>
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
              <SocialIcon network="discord" style={{ height: 30, width: 30 }} />
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                window.location.href = "https://www.reddit.com/r/inkparadise/";
              }}
              className="info-button"
            >
              <SocialIcon network="reddit" style={{ height: 30, width: 30 }} />{" "}
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                window.location.href = "https://x.com/iittqqq";
              }}
              className="info-button"
            >
              <SocialIcon network="twitter" style={{ height: 30, width: 30 }} />
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                window.location.href = "https://www.patreon.com/inkparadise";
              }}
              className="info-button"
            >
              <SocialIcon network="patreon" style={{ height: 30, width: 30 }} />
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                window.location.href =
                  "https://www.instagram.com/inkparadise.manga/";
              }}
              className="info-button"
            >
              <SocialIcon
                network="instagram"
                style={{ height: 30, width: 30 }}
              />
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};
export default InfoButtonHome;
