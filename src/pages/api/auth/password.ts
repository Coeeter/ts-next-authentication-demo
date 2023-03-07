import { NextApiRequest, NextApiResponse } from 'next';
import tokenValidator from '@/middleware/TokenValidator';
import { verifyPassword, hashPassword } from '@/services/HashingService';
import { firestore } from '@/config/Firebase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != 'PUT') return res.status(405).end();
  const user = await tokenValidator(req, res);
  if (!user) return;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).end();
  const isOldPasswordValid = await verifyPassword(oldPassword, user.password!);
  if (!isOldPasswordValid)
    return res.status(401).json({ message: 'Invalid old password' });
  if (oldPassword == newPassword)
    return res
      .status(400)
      .json({ message: 'New password cannot be the same as the old password' });
  user.password = await hashPassword(newPassword);
  await firestore
    .collection('users')
    .doc(user.id!)
    .update({ ...user });
  res.status(200).end();
}
