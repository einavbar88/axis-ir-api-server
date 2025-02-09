import type { Request, Response, NextFunction } from 'express';
import type { User } from '@/entities/User';
import { getRepository } from '@/common/models/repository';
import { TokenWhitelist } from '@/entities/TokenWhitelist';

export const authMiddleware = async (
  req: Request & { user?: Partial<User> },
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }
  const tokensRepo = await getRepository(TokenWhitelist);
  const fromDb: { user_id: number; username: string } | undefined =
    await tokensRepo
      .createQueryBuilder('token')
      .leftJoinAndSelect('token.user', 'user')
      .select(['user.user_id', 'username'])
      .where('token.token = :token', { token })
      .getRawOne();

  if (!fromDb) {
    return res.status(401).json({ message: 'Invalid token.' });
  }

  req.user = { userId: fromDb.user_id, username: fromDb.username };

  next();
};
