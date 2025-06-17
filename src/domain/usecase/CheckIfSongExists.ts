import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../data/firebase/firebase.config";

export async function checkIfSongExists(playlistId: string, video_id: string): Promise<boolean> {
  const songsRef = collection(db, `playlists/${playlistId}/songs`);
  const q = query(songsRef, where("video_id", "==", video_id));
  const snapshot = await getDocs(q);

  return !snapshot.empty;
}