export interface Account {
  id: number;
  email: string;
  password: string;
  username: string;
  verificationCode: string;
  verified: boolean;
}
