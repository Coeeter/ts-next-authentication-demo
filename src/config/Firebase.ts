import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../../firebase.json';

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
} catch (error) {
  if (error instanceof Error) {
    if (!/already exists/u.test(error.message)) {
      console.error('Firebase admin initialization error', error.stack);
    }
  }
}

export const firestore = admin.firestore();
export const cloudStorage = admin.storage();
