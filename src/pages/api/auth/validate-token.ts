import tokenValidator from '@/middleware/TokenValidator';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != 'GET') return res.status(405).end();
  const user = await tokenValidator(req, res);
  if (!user) return;
  user.password = undefined;
  res.status(200).json({ ...user });
}
