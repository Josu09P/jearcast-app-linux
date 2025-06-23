import { db } from "../../data/firebase/firebase.config";
import {
  doc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  CollectionReference,
  QuerySnapshot,
  QueryDocumentSnapshot,
  type DocumentData
} from "firebase/firestore";

interface FavoriteDocument extends DocumentData {
  user_id: string;
  video_id: string;
  // otros campos si son necesarios
}

export async function removeFavoriteMusic(data: { user_id: string; video_id: string }): Promise<void> {
  const favoriteDocId = await findFavoriteDocId(data.user_id, data.video_id);

  if (!favoriteDocId) {
    throw new Error("Favorite not found");
  }

  const favoriteRef = doc(db, "favorites", favoriteDocId);
  await deleteDoc(favoriteRef);
}

async function findFavoriteDocId(userId: string, videoId: string): Promise<string | null> {
  const favoritesRef: CollectionReference<FavoriteDocument> = collection(db, "favorites") as CollectionReference<FavoriteDocument>;
  const q = query(
    favoritesRef,
    where("user_id", "==", userId),
    where("video_id", "==", videoId)
  );

  const snapshot: QuerySnapshot<FavoriteDocument> = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  let favoriteDocId: string | null = null;
  snapshot.forEach((doc: QueryDocumentSnapshot<FavoriteDocument>) => {
    favoriteDocId = doc.id;
  });

  return favoriteDocId;
}
