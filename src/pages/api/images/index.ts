import { cloudStorage } from '@/config/Firebase';
import { createFirebaseStorageUrl, getkeyFromUrl } from '@/services/ImageUrlParser';
import parseMultipartForm from '@/services/ParseMultipartForm';
import { randomUUID } from 'crypto';
import { createReadStream } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != 'POST') return res.status(405).end();
  const { files } = await parseMultipartForm(req);
  const file = files.image as any;
  const bucket = cloudStorage.bucket(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  );
  const fileUpload = bucket.file(
    randomUUID() + '.' + file.mimetype.split('/')[1]
  );
  createReadStream(file.filepath).pipe(fileUpload.createWriteStream());
  const url = createFirebaseStorageUrl(fileUpload.name);
  res.status(200).json({ url });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
