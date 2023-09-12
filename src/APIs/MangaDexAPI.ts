import { api } from "./configs/axiosConfigs";
import { defineCancelApiObject } from "./configs/axiosUtils";

const baseUrl = "https://api.mangadex.org";

export const MangaDexAPI = {
	getMangaByName: async function (title: string) {
		const response = await api.request({
			url: `${baseUrl}/manga`,
			method: "GET",
			params: { title: title },
		});

		// returning the product returned by the API
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
