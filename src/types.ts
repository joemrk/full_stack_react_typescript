import { Redis } from 'ioredis';
import { Request, Response } from 'express'
import { createUserLoader } from './utils/createUserLoader';
import { createUpdootLoader } from './utils/creatuUpdootLoader';

export type MyContext = {
  req: Request & { session: Express.Session };
  res: Response;
  redis: Redis
  userLoader: ReturnType<typeof createUserLoader>
  updootLoader: ReturnType<typeof createUpdootLoader>
}