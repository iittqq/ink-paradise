import { useEffect, useState } from "react";

import Header from "../../Components/Header/Header";
import { MalAccount } from "../../interfaces/MalInterfaces";
import { CircularProgress } from "@mui/material";
import "./Library.css";
import LibraryHeader from "../../Components/LibraryHeader/LibraryHeader";
import LibraryContents from "../../Components/LibraryContents/LibraryContents";
import { fetchAccountData, generateLibrary } from "../../api/MalApi";
import { Manga } from "../../interfaces/MangaDexInterfaces";

const Library = () => {
  const [library, setLibrary] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<object>({
    metric: "title",
    direction: "asc",
  });

  const handleLibraryOrderChange = (order: object) => {
    setOrder(order);
  };

  useEffect(() => {
    const accountName = localStorage.getItem("malAccount");
    if (accountName !== null) {
      fetchAccountData(accountName).then((data: MalAccount) => {
        generateLibrary(data.favorites.manga).then((library: Manga[]) => {
          setLibrary(library);
          setLoading(false);
        });
      });
    }
  }, [order]);

  return (
    <div>
      <div>
        <Header />
      </div>
      <LibraryHeader handleLibraryOrderChange={handleLibraryOrderChange} />
      {loading === true ? (
        <div className="loading-indicator-container">
          <CircularProgress size={25} sx={{ color: "#ffffff" }} />
        </div>
      ) : (
        <LibraryContents libraryManga={library} />
      )}
    </div>
  );
};

export default Library;
