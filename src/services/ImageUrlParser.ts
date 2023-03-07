export const createFirebaseStorageUrl = (name: string) => {
  return `https://firebasestorage.googleapis.com/v0/b/${
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  }/o/${encodeURIComponent(name)}?alt=media`;
};

export const getkeyFromUrl = (url: string) => {
  const key = url.split('/').pop();
  if (!key) throw new Error('Invalid url');
  return key.split('?').shift();
};
