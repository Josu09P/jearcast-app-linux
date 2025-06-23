import { db } from "../../data/firebase/firebase.config";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { RecommendedPlaylistSongModel } from "../models/RecommendedPlaylistSongModel";

export async function addSongToRecommendedPlaylist(
  playlistId: string,
  song: RecommendedPlaylistSongModel,
  playlistName?: string // opcional, solo se usa si es nueva
): Promise<void> {
  const playlistRef = doc(db, `recommended_playlists/${playlistId}`);

  const snapshot = await getDoc(playlistRef);
  if (!snapshot.exists()) {
    await setDoc(playlistRef, {
      name: playlistName || playlistId,
      created_at: serverTimestamp(),
    });
  }

  // ✅ Aquí sí usamos subcolección de songs como en playlists personales
  const songsRef = collection(db, `recommended_playlists/${playlistId}/songs`);
  await addDoc(songsRef, {
    ...song,
    added_at: serverTimestamp(),
  });
}
