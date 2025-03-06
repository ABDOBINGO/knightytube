import { google } from 'googleapis';
import axios from 'axios';

const youtube = google.youtube('v3');

export async function getVideoTranscript(videoUrl: string) {
  try {
    // Extract video ID from URL
    const videoId = videoUrl.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)?.[1];
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Get captions for the video
    const response = await youtube.captions.list({
      key: process.env.YOUTUBE_API_KEY,
      part: ['snippet'],
      videoId,
    });

    if (!response.data.items?.length) {
      throw new Error('No captions found for this video');
    }

    // Get the first available caption track (usually the auto-generated one)
    const captionId = response.data.items[0].id;

    // Download the transcript
    const transcriptResponse = await youtube.captions.download({
      key: process.env.YOUTUBE_API_KEY,
      id: captionId!,
    });

    return transcriptResponse.data;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw error;
  }
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