import { Database } from 'firebase-firestore-lite';
import Auth from 'firebase-auth-lite';

export const getDBRef = (context: {
  request: Request;
  next: () => Promise<Response>;
  env: { FB_API_KEY?: string, FB_PROJECT_ID?: string };
}) => {

  const auth = new Auth({
    apiKey: context.env.FB_API_KEY
  });

  const db = new Database({ projectId: context.env.FB_PROJECT_ID, auth });

  return db.ref("");
}
