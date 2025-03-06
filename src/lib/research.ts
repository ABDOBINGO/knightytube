import axios from 'axios';
import { google } from 'googleapis';
import { YouTubeError } from './errors';

export interface ResearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

interface ResearchProgress {
  source: string;
  status: 'pending' | 'complete' | 'error';
  results?: number;
  error?: string;
}

interface ResearchStatus {
  progress: ResearchProgress[];
  results: ResearchResult[];
  searchQueries: string[];
}

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

export async function conductWebResearch(
  topic: string,
  onProgress?: (status: ResearchStatus) => void
): Promise<ResearchStatus> {
  const progress: ResearchProgress[] = [];
  const results: ResearchResult[] = [];
  const searchQueries: string[] = [];

  const updateProgress = (source: string, status: ResearchProgress['status'], data?: { results?: number; error?: string }) => {
    const index = progress.findIndex(p => p.source === source);
    if (index >= 0) {
      progress[index] = { ...progress[index], status, ...data };
    } else {
      progress.push({ source, status, ...data });
    }
    onProgress?.({ progress, results, searchQueries });
  };

  // Knowledge Graph Search
  try {
    updateProgress('Google Knowledge Graph', 'pending');
    const query = `${topic} overview information guide`;
    searchQueries.push(`Knowledge Graph: "${query}"`);
    
    const response = await axios.get('https://kgsearch.googleapis.com/v1/entities:search', {
      params: {
        key: process.env.GOOGLE_API_KEY,
        limit: 5,
        query,
      }
    });

    if (response.data.itemListElement) {
      response.data.itemListElement.forEach((item: any) => {
        if (item.result) {
          results.push({
            title: item.result.name,
            url: item.result.detailedDescription?.url || '',
            snippet: item.result.detailedDescription?.articleBody || '',
            source: 'Knowledge Graph'
          });
        }
      });
    }
    updateProgress('Google Knowledge Graph', 'complete', { results: results.length });
  } catch (error) {
    console.error('Knowledge Graph error:', error);
    updateProgress('Google Knowledge Graph', 'error', { 
      error: error instanceof Error ? error.message : 'Failed to fetch knowledge graph data'
    });
  }

  // Wikipedia Search
  try {
    updateProgress('Wikipedia', 'pending');
    const query = `${topic} guide tutorial information`;
    searchQueries.push(`Wikipedia: "${query}"`);

    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        format: 'json',
        list: 'search',
        srsearch: query,
        utf8: 1,
        origin: '*'
      }
    });

    if (response.data.query?.search) {
      response.data.query.search.forEach((item: any) => {
        results.push({
          title: item.title,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
          snippet: item.snippet.replace(/<\/?[^>]+(>|$)/g, ''),
          source: 'Wikipedia'
        });
      });
    }
    updateProgress('Wikipedia', 'complete', { results: response.data.query?.search?.length || 0 });
  } catch (error) {
    console.error('Wikipedia error:', error);
    updateProgress('Wikipedia', 'error', {
      error: error instanceof Error ? error.message : 'Failed to fetch Wikipedia data'
    });
  }

  // YouTube Search
  try {
    updateProgress('YouTube', 'pending');
    const query = `${topic} tutorial guide how to`;
    searchQueries.push(`YouTube: "${query}"`);

    const response = await youtube.search.list({
      part: ['snippet'],
      q: query,
      type: ['video'],
      maxResults: 5,
      relevanceLanguage: 'en',
      videoType: 'any',
    });

    if (response.data.items) {
      response.data.items.forEach(item => {
        if (item.snippet) {
          results.push({
            title: item.snippet.title || '',
            url: `https://youtube.com/watch?v=${item.id?.videoId}`,
            snippet: item.snippet.description || '',
            source: 'YouTube'
          });
        }
      });
    }
    updateProgress('YouTube', 'complete', { results: response.data.items?.length || 0 });
  } catch (error) {
    console.error('YouTube search error:', error);
    if (error instanceof Error && error.message.includes('quota')) {
      updateProgress('YouTube', 'error', { error: 'YouTube API quota exceeded' });
    } else {
      updateProgress('YouTube', 'error', {
        error: error instanceof Error ? error.message : 'Failed to fetch YouTube data'
      });
    }
  }

  // Filter out empty results and deduplicate
  const filteredResults = results
    .filter(r => r.snippet.length > 0)
    .reduce((acc: ResearchResult[], curr) => {
      if (!acc.some(r => r.url === curr.url)) {
        acc.push(curr);
      }
      return acc;
    }, []);

  return {
    progress,
    results: filteredResults,
    searchQueries
  };
}