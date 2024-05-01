export interface AccountDetails {
  id?: number;
  accountId: number;
  username: string;
  bio: string;
  profilePicture?: number[];
  headerPicture?: number[];
  birthday: string;
  contentFilter: number;
}
