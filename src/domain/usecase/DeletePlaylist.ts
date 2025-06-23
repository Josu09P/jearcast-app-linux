import { db } from "../../data/firebase/firebase.config";
import { doc, deleteDoc } from "firebase/firestore";

/**
 * Elimina completamente una playlist, incluyendo su documento en "playlists".
 * No borra las canciones hijas (subcolección).
 */
export async function deletePlaylist(playlistId: string): Promise<void> {
  const playlistRef = doc(db, "playlists", playlistId);
  await deleteDoc(playlistRef);
}
