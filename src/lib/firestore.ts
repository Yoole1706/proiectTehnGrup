import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Note } from "@/context/NotesContext";

/**
 * Fetch all notes for a given user, ordered by createdAt descending.
 */
export async function getNotes(uid: string): Promise<Note[]> {
  try {
    const notesRef = collection(db, "users", uid, "notes");
    const q = query(notesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title as string,
      body: doc.data().body as string,
      category: doc.data().category as string,
      tags: doc.data().tags as string[],
      createdAt: doc.data().createdAt as string,
      updatedAt: doc.data().updatedAt as string,
    }));
  } catch (error) {
    console.error("[firestore] getNotes failed:", error);
    return [];
  }
}

/**
 * Add a new note for a given user. Firestore auto-generates the document ID.
 */
export async function addNote(
  uid: string,
  note: Omit<Note, "id">
): Promise<void> {
  try {
    const notesRef = collection(db, "users", uid, "notes");
    await addDoc(notesRef, note);
  } catch (error) {
    console.error("[firestore] addNote failed:", error);
  }
}
