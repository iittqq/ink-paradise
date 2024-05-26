export interface MalFavorites {
  mal_id: number;
  type: string;
  images: { jpg: { large_image_url: string } };
  title: string;
}
[];

export interface UserMangaLogistics {
  [0]: string;
  [1]: number;
}

export interface MalUpdates {
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

export interface MalAccount {
  id: number;
  username: string;
  url: string;
  images: { jpg: { image_url: string } };
  last_online: string;
  gender: string;
  birthday: string;
  location: string;
  joined: string;
  statistics: {
    manga: {
      days_read: number;
      mean_score: number;
      reading: number;
      completed: number;
      on_hold: number;
      dropped: number;
      plan_to_read: number;
      total_entries: number;
      reread: number;
      chapters_read: number;
      volumes_read: number;
    };
  };
  favorites: { manga: MalFavorites[] };
  updates: { manga: MalUpdates[] };
  about: string;
}
