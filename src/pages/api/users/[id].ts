import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/config/Firebase';
import User from '@/models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | { message: string }>
) {
  if (req.method != 'GET') return res.status(405).end();
  const id = req.query.id as string;
  const snapshot = await firestore.collection('users').doc(id).get();
  const data = snapshot.data();
  if (!data) return res.status(404).json({ message: 'User not found' });
  res.status(200).json({
    id: snapshot.id,
    username: data.username,
    email: data.email,
    image: data.image,
  });
}
