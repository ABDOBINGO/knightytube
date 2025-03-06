import { google } from 'googleapis';
import { retry } from '@/utils/retry';
import { YouTubeError } from '@/lib/errors';
import he from 'he';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

const TRANSCRIPT_TIMEOUT = 30000; // 30 seconds timeout
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

interface TranscriptResponse {
  text: string;
  duration: number;
  offset: number;
}

async function parseXMLTranscript(xmlText: string): Promise<TranscriptResponse[]> {
  // Simple XML parsing without dependencies
  const texts: TranscriptResponse[] = [];
  const matches = xmlText.matchAll(/<text start="([^"]+)" dur="([^"]+)"[^>]*>([^<]+)<\/text>/g);
  
  for (const match of matches) {
    texts.push({
      offset: parseFloat(match[1]),
      duration: parseFloat(match[2]),
      text: he.decode(match[3].trim()) // Decode HTML entities
    });
  }
  
  return texts;
}

async function fetchTranscript(videoId: string): Promise<TranscriptResponse[]> {
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
  const html = await response.text();
  
  // Extract transcript data from YouTube's page
  const captionMatch = html.match(/"captions":\s*({[^}]+})/);
  if (!captionMatch) {
    throw new Error('Could not find any transcripts');
  }

  const captionData = JSON.parse(captionMatch[1].replace(/\\"/g, '"'));
  if (!captionData?.playerCaptionsTracklistRenderer?.captionTracks?.length) {
    throw new Error('No transcripts available');
  }

  const track = captionData.playerCaptionsTracklistRenderer.captionTracks[0];
  const transcriptResponse = await fetch(track.baseUrl);
  const transcriptXml = await transcriptResponse.text();

  return parseXMLTranscript(transcriptXml);
}

export async function getVideoTranscript(videoUrl: string, onProgress?: (status: string) => void): Promise<string> {
  try {
    onProgress?.('Extracting video ID...');
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw YouTubeError.invalidUrl('Please enter a valid YouTube video URL.');
    }

    onProgress?.('Fetching video transcript...');
    
    const fetchWithTimeout = async (): Promise<TranscriptResponse[]> => {
      const transcriptPromise = fetchTranscript(videoId);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(YouTubeError.timeout('Transcript fetch timed out. Please try again.'));
        }, TRANSCRIPT_TIMEOUT);
      });

      try {
        return await Promise.race([transcriptPromise, timeoutPromise]);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('Could not find any transcripts')) {
            throw YouTubeError.noTranscript('No transcripts available for this video. The creator may need to enable captions.');
          }
          if (error.message.includes('Status code: 429')) {
            throw YouTubeError.rateLimit('Too many requests. Please wait a moment and try again.');
          }
          if (error.message.includes('Network Error')) {
            throw YouTubeError.network('Network error occurred while fetching transcript. Please check your connection.');
          }
        }
        throw error;
      }
    };

    const transcripts = await retry<TranscriptResponse[]>(fetchWithTimeout, {
      maxAttempts: MAX_RETRIES,
      delayMs: INITIAL_RETRY_DELAY,
      backoff: true,
      onRetry: (attempt, error) => {
        if (error instanceof YouTubeError && error.retry) {
          onProgress?.(`Retry attempt ${attempt}/${MAX_RETRIES} - ${error.message}`);
        } else {
          throw error; // Don't retry if error is not retryable
        }
      }
    });

    if (!transcripts || transcripts.length === 0) {
      throw YouTubeError.noTranscript('No transcripts found for this video');
    }

    onProgress?.('Processing transcript...');
    const transcript = transcripts
      .map(part => part.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    onProgress?.('Cleaning transcript...');
    return cleanTranscript(transcript);
  } catch (error) {
    console.error('Error fetching transcript:', error);
    
    if (error instanceof YouTubeError) {
      throw error; // Re-throw YouTubeError instances as is
    }

    // Convert unknown errors to YouTubeError
    if (error instanceof Error) {
      if (error.message.includes('timed out')) {
        throw YouTubeError.timeout('The transcript request timed out after multiple retries. Please try again later.');
      }
    }
    
    throw YouTubeError.unknown('Failed to fetch video transcript. Please try again later.');
  }
}

function extractVideoId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    // Standard watch URLs
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i,
    // Just the video ID
    /^[a-zA-Z0-9_-]{11}$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

function cleanTranscript(transcript: string): string {
  return transcript
    // Remove timestamps and special characters
    .replace(/\[\d+:\d+\]/g, '')
    .replace(/\(\d+:\d+\)/g, '')
    .replace(/♪|�|&#\d+;/g, '') // Remove music notes, invalid chars, and any remaining HTML entities
    // Fix common transcript issues
    .replace(/(\w)'(\w)/g, "$1'$2") // Fix apostrophes
    .replace(/\b(\w+)\s*\1\b/g, '$1') // Remove repeated words
    .replace(/\s*([.,!?])\s*/g, '$1 ') // Fix punctuation spacing
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/([.!?])\s*(?=[A-Z])/g, '$1\n\n') // Add paragraph breaks
    .replace(/^\s+|\s+$/gm, '') // Trim each line
    .trim();
}

export async function getVideoDetails(videoUrl: string) {
  try {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw YouTubeError.invalidUrl('Please enter a valid YouTube video URL.');
    }

    const response = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      id: [videoId]
    });

    const video = response.data.items?.[0];
    if (!video) {
      throw YouTubeError.invalidUrl('Video not found. It might be private or deleted.');
    }

    return {
      id: video.id,
      title: video.snippet?.title,
      description: video.snippet?.description,
      channelTitle: video.snippet?.channelTitle,
      publishedAt: video.snippet?.publishedAt,
      duration: video.contentDetails?.duration,
      viewCount: video.statistics?.viewCount,
      thumbnails: video.snippet?.thumbnails
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    if (error instanceof YouTubeError) {
      throw error;
    }
    throw YouTubeError.unknown('Failed to fetch video details. Please try again later.');
  }
}

