import { firestore } from '@/config/Firebase';
import { verifyPassword } from '@/services/HashingService';
import { generateToken } from '@/services/TokenService';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != 'POST') return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).end();
  const snapshot = await firestore
    .collection('users')
    .where('email', '==', email)
    .get();
  if (snapshot.empty)
    return res.status(404).json({
      message: 'User not found',
    });
  const user = snapshot.docs[0].data();
  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword)
    return res.status(401).json({
      message: 'Invalid password',
    });
  const token = generateToken({
    id: snapshot.docs[0].id,
    username: user.username,
  });
  res.status(200).json({ token });
}
