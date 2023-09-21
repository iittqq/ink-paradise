const baseUrl = "https://api.mangadex.org/";

export const CoverById = (coverArt: any) => `${baseUrl}cover/${coverArt}`;
export const FeedById = (id: any) =>
	`${baseUrl}manga/${id}/feed?limit=100&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&includeFutureUpdates=1&order%5Bchapter%5D=desc`;
export const DetailsById = (id: any) => `${baseUrl}manga/${id}`;
export const RecentlyUpdated = () =>
	`${baseUrl}manga?limit=10&offset=0&includedTagsMode=AND&excludedTagsMode=OR&publicationDemographic%5B%5D=none&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&contentRating%5B%5D=pornographic&order%5BlatestUploadedChapter%5D=desc`;

export const RecentlyAddedAPI = () =>
	`${baseUrl}manga?limit=10&offset=0&includedTagsMode=AND&excludedTagsMode=OR&publicationDemographic%5B%5D=none&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&contentRating%5B%5D=pornographic&order%5BcreatedAt%5D=desc`;

export const MangaTags = () => `${baseUrl}/manga/tag`;
