import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../data/firebase/firebase.config";
import type { UserRegisterModel, UserDetailModel } from "../models/UserModel";

export async function registerUser(data: UserRegisterModel): Promise<UserDetailModel> {
  const { name, email, password, confirmPassword } = data;

  if (password !== confirmPassword) {
    throw new Error("Las contraseñas no coinciden.");
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const userId = userCredential.user.uid;

  const userDoc = {
    name,
    email,
    create_at: new Date(),
    apikeyYoutube: data.apikeyYoutube,
  };

  const userRef = doc(collection(db, "users"), userId);
  await setDoc(userRef, userDoc);

  return {
    id: userId,
    ...userDoc,
  } as UserDetailModel;
}
