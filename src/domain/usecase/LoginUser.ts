import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../data/firebase/firebase.config";
import type { UserDetailModel, UserLoginModel } from "../models/UserModel";

export async function loginUser(data: UserLoginModel): Promise<UserDetailModel> {
  const { email, password } = data;

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const userId = userCredential.user.uid;

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("Usuario no encontrado en la base de datos.");
  }

  return {
    id: userId,
    ...userSnap.data(),
  } as UserDetailModel;
}
