import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/config/Firebase';
import User from '@/models/User';
import tokenValidator from '@/middleware/TokenValidator';

async function getAllUsers(req: NextApiRequest, res: NextApiResponse<User[]>) {
  const snapshot = await firestore.collection('users').get();
  const users = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      username: data.username,
      email: data.email,
      image: data.image,
    };
  });
  res.status(200).json(users);
}

async function updateAccount(req: NextApiRequest, res: NextApiResponse) {
  const { email, username, imageUrl } = req.body;
  if (!email && !username && !imageUrl) return res.status(400).end();
  const user = await tokenValidator(req, res);
  if (!user) return;
  const updatedUser: User = {
    email: email ?? user.email,
    username: username ?? user.username,
  };
  if (imageUrl) updatedUser.image = imageUrl;
  await firestore
    .collection('users')
    .doc(user.id!)
    .update({ ...updatedUser });
  res.status(200).json(updatedUser);
}

async function deleteAccount(req: NextApiRequest, res: NextApiResponse) {
  const user = await tokenValidator(req, res);
  if (!user) return;
  await firestore.collection('users').doc(user.id!).delete();
  res.status(200).end();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[]>
) {
  switch (req.method) {
    case 'GET':
      await getAllUsers(req, res);
      break;
    case 'PUT':
      await updateAccount(req, res);
      break;
    case 'DELETE':
      await deleteAccount(req, res);
      break;
    default:
      res.status(405).end();
      break;
  }
}
