import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../data/firebase/firebase.config";
import type { PlaylistSongModel } from "../models/PlayListSongModel";

export async function addSongToPlaylist(playlistId: string, song: PlaylistSongModel): Promise<void> {
  const songsRef = collection(db, `playlists/${playlistId}/songs`);
  await addDoc(songsRef, {
    ...song,
    added_at: serverTimestamp(),
  });
}
