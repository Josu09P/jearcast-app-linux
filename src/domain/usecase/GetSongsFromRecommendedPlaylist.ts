import { db } from "../../data/firebase/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import type { RecommendedPlaylistSongModel } from "../models/RecommendedPlaylistSongModel";

export async function fetchSongsFromRecommendedPlaylist(
  playlistId: string
): Promise<RecommendedPlaylistSongModel[]> {
  const songsRef = collection(db, `recommended_playlists/${playlistId}/songs`);
  const snapshot = await getDocs(songsRef);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      video_id: data.video_id,
      video_title: data.video_title,
      video_thumbnail: data.video_thumbnail,
      added_at: data.added_at,
    };
  });
}
