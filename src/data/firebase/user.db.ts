import { getDatabase, ref, set } from "firebase/database";
const db = getDatabase();

export const saveUserProfile = (
  uid: string,
  data: { name: string; lastName: string; email: string; phone: string, apiKeyYoutube?: string }
) => {
  return set(ref(db, `users/${uid}`), data);
};
