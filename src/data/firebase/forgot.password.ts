import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase.config";

export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};
