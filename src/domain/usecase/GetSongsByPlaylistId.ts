import { collection, getDocs } from "firebase/firestore";
import { db } from "../../data/firebase/firebase.config";
import type { PlaylistSongModel } from "../models/PlayListSongModel";

export async function fetchSongsByPlaylistId(playlistId: string): Promise<PlaylistSongModel[]> {
  const songsRef = collection(db, `playlists/${playlistId}/songs`);
  const snapshot = await getDocs(songsRef);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      video_id: data.video_id,
      video_title: data.video_title,
      video_thumbnail: data.video_thumbnail,
      added_at: data.added_at,
    } as PlaylistSongModel;
  });
}