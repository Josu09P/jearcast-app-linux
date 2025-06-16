import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../data/firebase/firebase.config";
import type { FavoriteMusicModel } from "../models/FavoriteMusicModel";

export async function addFavoriteMusic(data: FavoriteMusicModel): Promise<"added" | "exists"> {
  const favoritesRef = collection(db, "favorites");
  const q = query(
    favoritesRef,
    where("user_id", "==", data.user_id),
    where("video_id", "==", data.video_id)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return "exists";
  }

  await addDoc(favoritesRef, {
    ...data,
    created_at: serverTimestamp(),
  });

  return "added";
}
