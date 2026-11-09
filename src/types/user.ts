export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'user';
  creator: string;
  createdAt: string;
  password?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  loginAt: string;
}
