import { ListItemTypeMap } from "@mui/material";
import { api } from "./configs/axiosConfigs";
import { defineCancelApiObject } from "./configs/axiosUtils";

const baseUrl = "https://api.mangadex.org";

export const MangaDexAPI = {
	getMangaByName: async function name(title: string) {
		const response = await api.request({
			url: `${baseUrl}/manga`,
			method: "GET",
			params: { title: title },
		});

		// returning the product returned by the API
		return response.data.data;
	},

	getNewMangaCovers: async function name(ids: string[]) {
		const response = await api.request({
			url: `${baseUrl}/cover`,
			method: "GET",
			params: { manga: ids },
		});

		return response.data;
	},
	getMangaCoverById: async function name(id: string) {
		const response = await api.request({
			url: `${baseUrl}/cover/` + id,
			method: "GET",
		});

		return response.data;
	},

	getNewUpdatedManga: async function name(
		limit: number,
		offset: number,
		includedTagsMode: string,
		excludedTagsMode: string,
		publicationDemographic: string[],
		contentRating: string[],
		includedTags?: string[],
		excludedTags?: string[],
		availableTranslatedLanguage?: string[],
		updatedAtSince?: string
	) {
		const response = await api.request({
			url: `${baseUrl}/manga`,
			method: "GET",
			params: {
				limit: limit,
				offset: offset,
				publicationDemographic: publicationDemographic,
				contentRating: contentRating,
				includedTags: includedTags,
				includedTagsMode: includedTagsMode,
				excludedTags: excludedTags,
				excludedTagsMode: excludedTagsMode,
				availableTranslatedLanguage: availableTranslatedLanguage,
				updatedAtSince: updatedAtSince,
			},
		});

		return response.data.data;
	},

	getAll: async function () {
		const response = await api.request({
			url: "/products/",
			method: "GET",
		});

		return response.data.products;
	},
	search: async function (name: string) {
		const response = await api.request({
			url: "/products/search",
			method: "GET",
			params: {
				name: name,
			},
		});

		return response.data.products;
	},
	create: async function (product: string) {
		await api.request({
			url: `/products`,
			method: "POST",
			data: product,
		});
	},
};

// defining the cancel API object for MangaDexAPI
const cancelApiObject = defineCancelApiObject(MangaDexAPI);
