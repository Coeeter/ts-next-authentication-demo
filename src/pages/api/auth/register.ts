import { firestore } from '@/config/Firebase';
import User from '@/models/User';
import { hashPassword } from '@/services/HashingService';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != 'POST') return res.status(405).end();
  const { email, username, password, imageUrl } = req.body;
  if (!email || !password || !username) return res.status(400).end();
  const snapshot = await firestore
    .collection('users')
    .where('email', '==', email)
    .get();
  if (!snapshot.empty)
    return res.status(409).json({
      message: 'Email already in use!',
    });
  const user: User = {
    email,
    username,
    password: await hashPassword(password),
  };
  if (imageUrl) user.image = imageUrl;
  const docRef = await firestore.collection('users').add(user);
  res.status(201).json({ id: docRef.id });
}
