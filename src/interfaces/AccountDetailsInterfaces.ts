export interface AccountDetails {
  id?: number;
  accountId: number;
  bio: string | null;
  profilePicture?: File | string | null;
  headerPicture?: File | string | null;
  birthday: string | null;
  contentFilter: number;
}
