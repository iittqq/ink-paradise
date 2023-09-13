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

	getMangaCoverById: async function name(id: string) {
		const response = await api.request({
			url: `${baseUrl}/cover`,
			method: "GET",
			params: { mangaOrCoverId: id },
		});

		return response.data;
	},
	getCoverArtList: async function name(input?: string) {
		const response = await api.request({
			url: `${baseUrl}/cover`,
			method: "GET",
			//params: { },
		});
		return response.data;
	},

	getNewUpdates: async function name(currentTime: string) {
		const response = await api.request({
			url: `${baseUrl}/manga`,
			method: "GET",
			params: { updatedAtSince: currentTime },
		});

		return response.data;
	},
	getMangaOrder: async function name(input?: string) {
		const response = await api.request({
			url: `${baseUrl}/manga`,
			method: "GET",
		});

		return response.data;
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
