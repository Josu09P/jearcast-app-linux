import { db } from "../../data/firebase/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import type { RecommendedPlaylistModel } from "../models/RecommendedPlaylistModel";

export async function fetchRecommendedPlaylists(): Promise<RecommendedPlaylistModel[]> {
  const ref = collection(db, "recommended_playlists");
  const snapshot = await getDocs(ref);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || doc.id,
    };
  });
}
