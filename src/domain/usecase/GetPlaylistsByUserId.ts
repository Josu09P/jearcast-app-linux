import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../data/firebase/firebase.config";
import type { PlaylistModel } from "../models/PlayListModel";

export async function fetchPlaylistsByUserId(user_id: string): Promise<PlaylistModel[]> {
  const playlistsRef = collection(db, "playlists");
  const q = query(playlistsRef, where("user_id", "==", user_id));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description || "",
      created_at: data.created_at,
    } as PlaylistModel;
  });
}
