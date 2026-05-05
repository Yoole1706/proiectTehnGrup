import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Note } from "@/context/NotesContext";


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


export async function updateNote(
  uid: string,
  noteId: string,
  data: Partial<Omit<Note, "id" | "createdAt">>
): Promise<void> {
  try {
    const noteRef = doc(db, "users", uid, "notes", noteId);
    await updateDoc(noteRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[firestore] updateNote failed:", error);
  }
}


export async function deleteNote(uid: string, noteId: string): Promise<void> {
  try {
    const noteRef = doc(db, "users", uid, "notes", noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error("[firestore] deleteNote failed:", error);
  }
}
