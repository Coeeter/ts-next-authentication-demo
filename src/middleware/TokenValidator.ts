import { firestore } from '@/config/Firebase';
import User from '@/models/User';
import { verifyToken } from '@/services/TokenService';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function TokenValidator(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).end();
    return;
  }
  const token = authorization.replace('Bearer ', '');
  if (!token) {
    res.status(401).end();
    return;
  }
  const payload: { id: string } = verifyToken(token);
  if (!payload) {
    res.status(401).end();
    return;
  }
  const userDoc = await firestore.collection('users').doc(payload.id).get();
  if (!userDoc.exists) {
    res.status(401).end();
    return;
  }
  const user: User = {
    id: userDoc.id,
    username: userDoc.data()?.username,
    email: userDoc.data()?.email,
    image: userDoc.data()?.image,
    password: userDoc.data()?.password,
  };
  return user;
}
