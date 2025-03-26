export interface CoverFile {
  attributes: {
    fileName: string;
  };
}
export interface Manga {
  id: string;
  attributes: {
    title: { en: string };
    altTitles: object[];
    description: { en: string };
    links: {
      al: string;
      ap: string;
      bw: string;
      kt: string;
      mu: string;
      nu: string;
      amz: string;
      cdj: string;
      ebj: string;
      mal: string;
      raw: string;
      engtl: string;
    };
    originalLanguage: string;
    lastVolume: string;
    lastChapter: string;
    status: string;
    contentRating: string;
    availableTranslatedLanguages: string[];
    tags: { id: string; type: string; attributes: { name: { en: string } } }[];
    createdAt: string;
    updatedAt: string;
    year: number;
    publicationDemographic: string;
  };
  relationships: {
    id: string;
    type: string;
    attributes: { fileName: string; name: string };
  }[];
  status?: string;
  bookmarkId?: number;
  chapterNumber?: number;
  chapterId?: string;
  index?: number;
  bookmarkPageNumber?: number;
  bookmarkContinueReading?: boolean;
  latestChapter?: MangaFeedScanlationGroup[];
}

export interface MangaChapter {
  chapter: { data: string[]; hash: string };
}

export interface MangaFeed {
  id: string;
  attributes: {
    title: string;
    volume: string;
    chapter: string;
    pages: number;
    translatedLanguage: string;
    createdAt: string;
    updatedAt: string;
    publishAt: string;
    readableAt: string;
  };
  relationships: {
    id: string;
    type: string;
  };
}

export interface MangaAggregated {
  volumes: {
    [key: string]: {
      volume: string;
      count: number;
      chapters: {
        chapter: string;
        id: string;
        others: string[];
        count: number;
      }[];
    };
  };
}

interface Tag {
  id: string;
  type: string;
  attributes: {
    name: {
      en: string;
    };
  };
}
export interface MangaInfo {
  name: string;
  description: string;
  altTitles: object[];
  languages: string[];
  contentRating: string;
  rawLink: string;
  tags: Tag[];
  author: string;
  status: string;
  coverUrl: string;
}

export interface MangaFeedScanlationGroup {
  id: string;
  attributes: {
    title: string;
    volume: string;
    chapter: string;
    pages: number;
    translatedLanguage: string;
    createdAt: string;
    updatedAt: string;
    publishAt: string;
    readableAt: string;
    externalUrl: string;
  };
  relationships: {
    id: string;
    type: string;
    attributes: {
      name: string;
      altNames: string[];
      locked: boolean;
      website: string | null;
      ircServer: string | null;
      ircChannel: string | null;
      discord: string | null;
      contactEmail: string | null;
      description: string | null;
      twitter: string | null;
      focusedLanguage: string[] | null;
      official: boolean;
      verified: boolean;
      inactive: boolean;
      publishDelay: string | null;
      created_at: string;
      updated_at: string;
    };
  }[];
}

export interface ChapterDetails {
  id: string;
  attributes: {
    title: string;
    volume: string;
    chapter: string;
    translatedLanguage: string;
    version: number;
    createdAt: string;
    updatedAt: string;
    externalUrl: string;
  };
  relationships: {
    id: string;
    type: string;
    attributes: {
      name: string;
    };
  }[];
}

export interface ScanlationGroup {
  id: string;
  type: string;
  attributes: {
    name: string;
    altNames: string[];
    locked: boolean;
    website: string | null;
    ircServer: string | null;
    ircChannel: string | null;
    discord: string | null;
    contactEmail: string | null;
    description: string | null;
    twitter: string | null;
    focusedLanguage: string[] | null;
    official: boolean;
    verified: boolean;
    inactive: boolean;
    publishDelay: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface Relationship {
  id: string;
  type: string;
}

export interface MangaTagsInterface {
  id: string;
  attributes: { name: { en: string } };
}

export interface TopManga {
  mal_id: string;
  title: string;
  images: { jpg: { image_url: string } };
  rank: string;
  authors: { name: string }[];
}

export interface PageImage {
  url: string;
}
