import { db } from "../../data/firebase/firebase.config";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type CollectionReference,
} from "firebase/firestore";

interface PlaylistSongDocument extends DocumentData {
  video_id: string;
}

/**
 * Elimina una canción específica dentro de una playlist (subcolección).
 */
export async function deleteSongFromPlaylist(playlistId: string, videoId: string): Promise<void> {
  const songsRef: CollectionReference<PlaylistSongDocument> = collection(
    db,
    `playlists/${playlistId}/songs`
  ) as CollectionReference<PlaylistSongDocument>;

  const q = query(songsRef, where("video_id", "==", videoId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Canción no encontrada en la playlist");
  }

  const docToDelete: QueryDocumentSnapshot<PlaylistSongDocument> = snapshot.docs[0];
  await deleteDoc(docToDelete.ref);
}
