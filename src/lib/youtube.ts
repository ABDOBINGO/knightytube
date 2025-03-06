import { YoutubeTranscript } from 'youtube-transcript-api';
import { google } from 'googleapis';
import { retry } from '@/utils/retry';
import { YouTubeError } from '@/lib/errors';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

const TRANSCRIPT_TIMEOUT = 30000; // 30 seconds timeout
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

export async function getVideoTranscript(videoUrl: string, onProgress?: (status: string) => void): Promise<string> {
  try {
    onProgress?.('Extracting video ID...');
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw YouTubeError.invalidUrl('Please enter a valid YouTube video URL.');
    }

    onProgress?.('Fetching video transcript...');
    
    const fetchWithTimeout = async () => {
      const transcriptPromise = YoutubeTranscript.fetchTranscript(videoId);
      const timeoutPromise = new Promise((_, reject) => {
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

    const transcripts = await retry(fetchWithTimeout, {
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
    }) as any[];

    if (!transcripts || transcripts.length === 0) {
      throw YouTubeError.noTranscript('No transcripts found for this video');
    }

    onProgress?.('Processing transcript...');
    const transcript = transcripts
      .map(part => part.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    onProgress?.('Transcript ready!');
    return transcript;
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
  const patterns = [
    // Standard watch URLs
    /youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})(?:&.*)?$/,
    // Shortened youtu.be URLs
    /youtu\.be\/([a-zA-Z0-9_-]{11})(?:[?&].*)?$/,
    // Mobile app share URLs
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(?:[?&].*)?$/,
    // Embed URLs
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:[?&].*)?$/,
    // Mobile URLs
    /m\.youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})(?:&.*)?$/,
    // Pure video ID
    /^([a-zA-Z0-9_-]{11})$/
  ];

  // Normalize the URL by removing protocol and www
  const normalizedUrl = url.replace(/^(?:https?:\/\/)?(?:www\.)?/, '');

  for (const pattern of patterns) {
    const match = normalizedUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

function cleanTranscript(transcript: string): string {
  // Remove timestamps and other formatting
  return transcript
    .replace(/\[\w+\]|\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}/g, '')
    .split('\n')
    .filter(line => line.trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function getVideoDetails(videoUrl: string) {
  try {
    const videoId = videoUrl.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)?.[1];
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    const response = await youtube.videos.list({
      key: process.env.YOUTUBE_API_KEY,
      part: ['snippet'],
      id: [videoId],
    });

    return response.data.items?.[0]?.snippet;
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
}

