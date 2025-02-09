import jwt from 'jsonwebtoken';
import { env } from '@/common/utils/envConfig';

const secret = env.JWT_SECRET;

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
