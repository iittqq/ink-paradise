export interface Bookmark {
  id?: number;
  userId: number;
  mangaId: string;
  mangaName: string;
  chapterNumber: number;
  chapterId: string;
  chapterIndex: number;
  continueReading: boolean;
  pageNumber?: number;
}
