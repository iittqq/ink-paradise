import { Typography, Button } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ListIcon from "@mui/icons-material/List";

import "./LibraryHeader.css";

type Props = {};

const LibraryHeader = (props: Props) => {
  const {} = props;

  const handleInput = (event: any) => {};
  return (
    <div className="library-header">
      <Typography padding={1} fontSize={20}>
        Library
      </Typography>
      <div className="library-header-options">
        <input
          type="search"
          placeholder="Search Library"
          className="library-search-bar"
          onChange={(event) => {
            handleInput(event);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
            }
          }}
        />

        <Button className="library-header-button">
          <SearchIcon />
        </Button>
        <Button className="library-header-button">
          <FilterListIcon />
        </Button>
        <Button className="library-header-button">
          <ListIcon />
        </Button>
      </div>
    </div>
  );
};

export default LibraryHeader;
