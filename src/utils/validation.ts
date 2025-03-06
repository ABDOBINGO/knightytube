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
  
  const patterns = [
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}$/,
    /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/[a-zA-Z0-9_-]{11}$/
  ];

  if (!patterns.some(pattern => pattern.test(url))) {
    return 'Please enter a valid YouTube video URL';
  }

  return undefined;
}