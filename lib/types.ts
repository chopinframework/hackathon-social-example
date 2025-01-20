export interface Tweet {
  id: number;
  content: string;
  userId: string;
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
} 