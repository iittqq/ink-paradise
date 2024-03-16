import { useEffect, useState } from "react";

import Header from "../../Components/Header/Header";
import { MalAccount } from "../../interfaces/MalInterfaces";

import "./Library.css";

import LibraryHeader from "../../Components/LibraryHeader/LibraryHeader";
import LibraryContents from "../../Components/LibraryContents/LibraryContents";
import { fetchAccountData } from "../../api/MalApi";

const Library = () => {
  const [malUserProfile, setMalUserProfile] = useState<MalAccount | null>(null);
  useEffect(() => {
    const accountName = localStorage.getItem("malAccount");
    if (accountName !== null) {
      fetchAccountData(accountName).then((data: MalAccount) => {
        setMalUserProfile(data);
      });
    }
  }, []);

  return (
    <div>
      <div>
        <Header />
      </div>
      <LibraryHeader />

      {malUserProfile !== null ? (
        <LibraryContents libraryManga={malUserProfile.favorites.manga} />
      ) : null}
    </div>
  );
};

export default Library;
