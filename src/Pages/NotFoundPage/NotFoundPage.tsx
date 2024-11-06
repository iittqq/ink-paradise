import "./NotFoundPage.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found-container">
      <h1>404 Not Found</h1>
      <p>
        Sorry, the page you are looking for does not exist or is not working.
      </p>
      <Button
        className="return-button"
        onClick={() => {
          navigate("/");
        }}
      >
        Return
      </Button>
    </div>
  );
};

export default NotFoundPage;
