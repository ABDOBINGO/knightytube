export interface Script {
  id: string;
  title: string;
  content: string;
  enhancedScript?: string | null;
  youtubeUrl?: string | null;
  transcript?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateScriptRequest {
  topic: string;
  youtubeUrl?: string;
}

export interface GenerateScriptResponse {
  script: Script;
}

export interface EnhanceScriptRequest {
  scriptId: string;
}

export interface EnhanceScriptResponse {
  script: Script;
}

export interface ApiError {
  error: string;
  status?: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}