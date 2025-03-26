export interface AccountDetails {
  id?: number;
  accountId: number;
  bio: string | null;
  profilePicture: string | null;
  headerPicture: string | null;
  contentFilter: number;
  readerMode: number;
  theme: number;
}
