export function validateTopic(topic: string): string | undefined {
  if (!topic.trim()) {
    return 'Topic is required';
  }
  if (topic.length < 3) {
    return 'Topic must be at least 3 characters long';
  }
  if (topic.length > 200) {
    return 'Topic is too long (maximum 200 characters)';
  }
  return undefined;
}

export function validateYoutubeUrl(url: string): string | undefined {
  if (!url) return undefined; // URL is optional
  
  const videoIdPatterns = [
    // Standard watch URLs
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})(?:&.*)?$/,
    // Shortened youtu.be URLs
    /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:[?&].*)?$/,
    // Mobile app share URLs
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(?:[?&].*)?$/,
    // Embed URLs
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:[?&].*)?$/,
    // Mobile URLs
    /^(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})(?:&.*)?$/,
    // Playlist URLs with video ID
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})&list=[^&]+(?:&.*)?$/,
    // Just the video ID (11 characters)
    /^[a-zA-Z0-9_-]{11}$/
  ];

  if (!videoIdPatterns.some(pattern => pattern.test(url))) {
    return 'Please enter a valid YouTube video URL (e.g., youtube.com/watch?v=..., youtu.be/...)';
  }

  return undefined;
}