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
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const token = authorization.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const payload: { id: string } = verifyToken(token);
  if (!payload) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const userDoc = await firestore.collection('users').doc(payload.id).get();
  if (!userDoc.exists) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const user: User = {
    id: userDoc.id,
    username: userDoc.data()?.username,
    email: userDoc.data()?.email,
    password: userDoc.data()?.password,
  };
  if (userDoc.data()?.image) user.image = userDoc.data()?.image;
  return user;
}
