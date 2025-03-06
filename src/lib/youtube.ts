import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

export async function getVideoTranscript(videoUrl: string): Promise<string> {
  try {
    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Get video captions
    const captionsResponse = await youtube.captions.list({
      part: ['snippet'],
      videoId: videoId
    });

    const captions = captionsResponse.data.items;
    if (!captions || captions.length === 0) {
      throw new Error('No captions found for this video');
    }

    // Get the first available caption track (usually auto-generated)
    const captionId = captions[0].id;
    
    // Download caption track
    const transcriptResponse = await youtube.captions.download({
      id: captionId!
    });

    // Process and clean up the transcript
    let transcript = transcriptResponse.data as string;
    transcript = cleanTranscript(transcript);

    return transcript;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw new Error('Failed to fetch video transcript');
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    /^[a-zA-Z0-9_-]{11}$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
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