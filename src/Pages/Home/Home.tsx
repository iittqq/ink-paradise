import { useState, useEffect } from "react";

import Header from "../../Components/Header/Header";
import "./Home.css";
import { fetchMangaCover, fetchPopularManga } from "../../api/MangaDexApi";

import TrendingMangaCarousel from "../../Components/TrendingMangaCarousel/TrendingMangaCarousel";

import {
  Manga,
  Relationship,
  CoverFile,
} from "../../interfaces/MangaDexInterfaces";

const Home = () => {
  const [popularManga, setPopularManga] = useState<Manga[]>([]);
  const [coverFiles, setCoverFiles] = useState<string[]>([]);

  useEffect(() => {
    fetchPopularManga(10).then((data: Manga[]) => {
      setPopularManga(data);

      data.map((current: Manga) => {
        const coverId = current.relationships.find(
          (i: Relationship) => i.type === "cover_art",
        )?.id;
        if (coverId !== undefined) {
          fetchMangaCover(coverId).then((data: CoverFile) => {
            setCoverFiles((prev) => [
              ...prev,
              "https://uploads.mangadex.org/covers/" +
                current.id +
                "/" +
                data.attributes.fileName,
            ]);
            console.log(data);
          });
        }
      });
    });
  }, []);

  return (
    <div className="home-page-container">
      <Header />

      <TrendingMangaCarousel manga={popularManga} coverFiles={coverFiles} />
    </div>
  );
};

export default Home;
