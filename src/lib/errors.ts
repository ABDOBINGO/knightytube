import { Prisma } from '@prisma/client';

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

  return {
    message: 'An unexpected error occurred.',
    status: 500
  };
}