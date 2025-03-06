export interface ResearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface ResearchProgress {
  source: string;
  status: 'pending' | 'complete' | 'error';
  results?: number;
  error?: string;
}

export interface ResearchStatus {
  progress: ResearchProgress[];
  results: ResearchResult[];
  searchQueries: string[];
}

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
  hash?: string;
  researchData?: {
    sources: ResearchResult[];
    searchQueries: string[];
  };
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

