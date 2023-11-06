const baseUrl = "https://api.mangadex.org";

export const fetchRecentlyUpdatedManga = async () => {
	const queryParams = new URLSearchParams();
	queryParams.set("limit", "10");
	//queryParams.set("contentRating", ["safe", "suggestive", "erotica"].join(","));
	queryParams.set("order[latestUploadedChapter]", "desc");
	const url = `${baseUrl}/manga?${queryParams.toString()}`;
	const params = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	};
	try {
		const response = await fetch(url, params);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
};
