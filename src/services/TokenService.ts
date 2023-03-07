import { sign, verify, SignOptions } from 'jsonwebtoken';

export const generateToken = (
  payload: any,
  options: SignOptions = { expiresIn: '30d' }
): string => {
  return sign(payload, process.env.JWT_SECRET!, options);
};

export const verifyToken = <T>(token: string): T => {
  return verify(token, process.env.JWT_SECRET!) as T;
};
