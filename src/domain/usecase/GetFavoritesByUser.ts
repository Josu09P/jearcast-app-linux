// src/domain/usecase/GetFavoritesByUser.ts
import { db } from "../../data/firebase/firebase.config";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import type { FavoriteMusicModel } from "../models/FavoriteMusicModel";

export async function getFavoritesByUser(userId: string): Promise<FavoriteMusicModel[]> {
  const favoritesRef = collection(db, "favorites");
  const q = query(
    favoritesRef,
    where("user_id", "==", userId),
    orderBy("created_at", "desc")
  );

  const snapshot = await getDocs(q);

  const results: FavoriteMusicModel[] = [];
  snapshot.forEach((doc) => {
    results.push({ id: doc.id, ...doc.data() } as FavoriteMusicModel);
  });

  return results;
}
