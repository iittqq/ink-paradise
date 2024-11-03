export interface Account {
  id: number;
  email: string;
  password: string;
  username: string;
  verificationCode: string;
  verified: boolean;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface UsernameChange {
  id: number;
  username: string;
}

export interface PasswordChange {
  id: number;
  oldPassword: string;
  newPassword: string;
}
