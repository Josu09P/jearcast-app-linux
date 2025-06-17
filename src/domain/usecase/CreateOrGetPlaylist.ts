import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../data/firebase/firebase.config";
import type { PlaylistModel } from "../models/PlayListModel";

export async function createOrGetPlaylist(data: PlaylistModel): Promise<string> {
  const playlistsRef = collection(db, "playlists");

  const q = query(
    playlistsRef,
    where("user_id", "==", data.user_id),
    where("name", "==", data.name)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return snapshot.docs[0].id; // Ya existe
  }

  const newDoc = await addDoc(playlistsRef, {
    user_id: data.user_id,
    name: data.name,
    description: data.description || "",
    created_at: serverTimestamp(),
  });

  return newDoc.id;
}
