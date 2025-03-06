import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientOptions = {
  log: ['error', 'warn'],
  errorFormat: 'pretty',
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
prisma.$use(async (params: Prisma.MiddlewareParams, next: Prisma.Middleware) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  return result;
});

export default prisma;