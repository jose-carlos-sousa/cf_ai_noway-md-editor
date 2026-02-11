export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}