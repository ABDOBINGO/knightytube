export interface Script {
  id: string;
  title: string;
  content: string;
  youtubeUrl?: string | null;
  transcript?: string | null;
  enhancedScript?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}