export interface AccountDetails {
  id?: number;
  accountId: number;
  bio: string | null;
  profilePicture: string | null;
  headerPicture: string | null;
  birthday: string | null;
  contentFilter: number;
}
