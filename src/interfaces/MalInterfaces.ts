export interface MalFavorites {
	images: { jpg: { large_image_url: string } };
	title: string;
}
[];

export interface UserMangaLogistics {
	[0]: string;
	[1]: number;
}

export interface MalUpdates {
	title: string;
	status: string;
	entry: { title: string; images: { jpg: { large_image_url: string } } };
}

export interface MangaStatus {
	status: string;
}

export interface TopManga {
	mal_id: string;
	title: string;
	images: { jpg: { image_url: string } };
	rank: string;
	authors: { name: string }[];
}
