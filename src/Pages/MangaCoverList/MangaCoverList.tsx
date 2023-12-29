import { useState, useEffect } from "react";
import { Grid, Typography, Button } from "@mui/material";
import Header from "../../Components/Header";
import CoverClickable from "../../Components/CoverClickable";
import { useLocation } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./MangaCoverList.css";

import {
	fetchRecentlyAdded,
	fetchMangaByName,
	fetchMangaByAuthor,
	fetchMangaByTag,
	fetchRecentlyUpdated,
} from "../../api/MangaDexApi";

const MangaCoverList = () => {
	const { state } = useLocation();
	const [offset, setOffset] = useState<number>(0);
	console.log(state.title);
	console.log(state.tagId !== undefined);
	console.log(state.listType);
	const [mangaDetails, setmangaDetails] = useState<Object[]>([]);

	/**
  const fetchMangaByRecentlyAdded = async () => {
    //pageTitle = "Recently Added";
    fetch(
      `${baseUrl}/manga?limit=60&offset=${offset}&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BcreatedAt%5D=desc`
    )
      .then((response) => response.json())
      .then((data) => {
        setmangaDetails(data.data);

        console.log(data.data);
      });
  };

  const fetchMangaByTitle = async () => {
    fetch(
      `${baseUrl}/manga?limit=60&offset=${offset}&title=${
        state.title === undefined ? "" : state.title
      }&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`
    )
      .then((response) => response.json())
      .then((data) => {
        setmangaDetails(data.data);

        console.log(data.data);
      });
  };

  const fetchMangaByAuthor = async () => {
    fetch(
      `${baseUrl}/manga?limit=60&offset=0&authors%5B%5D=${state.authorId}&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`
    )
      .then((response) => response.json())
      .then((data) => {
        setmangaDetails(data.data);

        console.log(data.data);
      });
  };

  const fetchMangaByTag = async () => {
    fetch(
      `${baseUrl}/manga?limit=60&offset=0&includedTags%5B%5D=${state.tagId}&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`
    )
      .then((response) => response.json())
      .then((data) => {
        setmangaDetails(data.data);

        console.log(data.data);
      });
  };

  const fetchMangaByRecentlyUpdated = async () => {
    fetch(
      `${baseUrl}/manga?limit=60&offset=${offset}&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`
    )
      .then((response) => response.json())
      .then((data) => {
        setmangaDetails(data.data);

        console.log(data.data);
      });
  };

  const fetchMangaByName = async () => {
    fetch(
      `${baseUrl}/manga?limit=100&title=${state.id}&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5Brelevance%5D=desc`
    )
      .then((response) => response.json())
      .then((mangaBySearch) => {
        setmangaDetails(mangaBySearch.data);
        console.log(mangaBySearch.data);
      });
  };

  const fetchMangaCoverList = async () => {
    console.log(state.listType);
    state.listType === "RecentlyAdded"
      ? fetchMangaByRecentlyAdded()
      : state.listType === "SearchResults"
      ? fetchMangaByName()
      : //Add New Page Logic Here
      state.listType === "RecentlyUpdated"
      ? state.title !== undefined
        ? fetchMangaByTitle()
        : state.authorId !== undefined
        ? fetchMangaByAuthor()
        : state.tagId !== undefined
        ? fetchMangaByTag()
        : fetchMangaByRecentlyUpdated()
      : fetchMangaByRecentlyAdded();
  }; */

	const fetchMangaCoverList = async () => {
		console.log(state.listType);
		state.listType === "RecentlyAdded"
			? fetchRecentlyAdded(75, offset).then((data: Object[]) => {
					setmangaDetails(data);
			  })
			: state.listType === "SearchResults"
			? fetchMangaByName(state.title === undefined ? "" : state.title).then(
					(data: Object[]) => {
						setmangaDetails(data);
					}
			  )
			: //Add New Page Logic Here
			state.listType === "RecentlyUpdated"
			? state.title !== undefined
				? fetchMangaByName(state.title).then((data: Object[]) => {
						setmangaDetails(data);
				  })
				: state.authorId !== undefined
				? fetchMangaByAuthor(state.authorId, 75, offset).then(
						(data: Object[]) => {
							setmangaDetails(data);
						}
				  )
				: state.tagId !== undefined
				? fetchMangaByTag(state.tagId, 75, offset).then((data: Object[]) => {
						setmangaDetails(data);
				  })
				: fetchRecentlyUpdated(75, offset).then((data: Object[]) => {
						setmangaDetails(data);
				  })
			: fetchRecentlyAdded(75, offset).then((data: Object[]) => {
					setmangaDetails(data);
			  });
	};

	useEffect(() => {
		fetchMangaCoverList();
	}, [offset, state]);
	return (
		<>
			<div className='header'>
				<Header />
			</div>
			<Typography className='title'>{state.listType}</Typography>
			<div>
				<Grid
					container
					direction='row'
					justifyContent='center'
					alignItems='center'
					wrap='wrap'
					spacing={1}
				>
					{mangaDetails.map((element: any) => (
						<Grid item>
							<CoverClickable
								id={element["id"]}
								title={element["attributes"].title["en"]}
								coverId={
									element["relationships"].find(
										(i: any) => i.type === "cover_art"
									).id
								}
							/>
						</Grid>
					))}
				</Grid>
			</div>
			<div className='nav-buttons'>
				<Button
					className='nav-button-styling'
					onClick={() => (offset - 75 >= 0 ? setOffset(offset - 75) : null)}
				>
					<ArrowBackIosNewIcon />
				</Button>
				<Button
					className='nav-button-styling'
					onClick={() => {
						setOffset(offset + 75);
					}}
				>
					<ArrowForwardIosIcon />
				</Button>
			</div>
		</>
	);
};
export default MangaCoverList;
