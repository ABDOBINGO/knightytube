import { Prisma } from '@prisma/client';

export class YouTubeError extends Error {
  retry: boolean;
  code: any;
  
  private constructor(message: string, retry: boolean = false) {
    super(message);
    this.name = 'YouTubeError';
    this.retry = retry;
  }

  static invalidUrl(message: string): YouTubeError {
    return new YouTubeError(message, false);
  }

  static noTranscript(message: string): YouTubeError {
    return new YouTubeError(message, false);
  }

  static timeout(message: string): YouTubeError {
    return new YouTubeError(message, true);
  }

  static rateLimit(message: string): YouTubeError {
    return new YouTubeError(message, true);
  }

  static network(message: string): YouTubeError {
    return new YouTubeError(message, true);
  }

  static unknown(message: string): YouTubeError {
    return new YouTubeError(message, false);
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