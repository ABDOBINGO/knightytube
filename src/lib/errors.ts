import { Prisma } from '@prisma/client';

export class YouTubeError extends Error {
  constructor(
    message: string,
    public readonly code: 'INVALID_URL' | 'NO_TRANSCRIPT' | 'TIMEOUT' | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN',
    public readonly retry?: boolean
  ) {
    super(message);
    this.name = 'YouTubeError';
  }

  static invalidUrl(message = 'Invalid YouTube URL'): YouTubeError {
    return new YouTubeError(message, 'INVALID_URL', false);
  }

  static noTranscript(message = 'No transcripts available'): YouTubeError {
    return new YouTubeError(message, 'NO_TRANSCRIPT', false);
  }

  static timeout(message = 'Request timed out'): YouTubeError {
    return new YouTubeError(message, 'TIMEOUT', true);
  }

  static rateLimit(message = 'Too many requests'): YouTubeError {
    return new YouTubeError(message, 'RATE_LIMIT', true);
  }

  static network(message = 'Network error'): YouTubeError {
    return new YouTubeError(message, 'NETWORK', true);
  }

  static unknown(message = 'Unknown error'): YouTubeError {
    return new YouTubeError(message, 'UNKNOWN', false);
  }
}

export function handlePrismaError(error: unknown): { message: string; status: number } {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return {
          message: 'A record with this value already exists.',
          status: 409
        };
      case 'P2003':
        return {
          message: 'The operation failed because a required relation is missing.',
          status: 400
        };
      case 'P2025':
        return {
          message: 'Record not found.',
          status: 404
        };
      default:
        return {
          message: 'Database operation failed.',
          status: 500
        };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      message: 'Invalid data provided.',
      status: 400
    };
  }

  if (error instanceof YouTubeError) {
    switch (error.code) {
      case 'INVALID_URL':
        return {
          message: error.message,
          status: 400,
        };
      case 'NO_TRANSCRIPT':
        return {
          message: error.message,
          status: 404,
        };
      case 'RATE_LIMIT':
        return {
          message: error.message,
          status: 429,
        };
      default:
        return {
          message: error.message,
          status: 500,
        };
    }
  }

  return {
    message: 'An unexpected error occurred.',
    status: 500
  };
}