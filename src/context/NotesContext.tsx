"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { getNotes, addNote, updateNote as firestoreUpdateNote, deleteNote as firestoreDeleteNote } from "@/lib/firestore";



export type Note = {
  id: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};



type NotesAction =
  | { type: "ADD_NOTE"; payload: Note }
  | { type: "UPDATE_NOTE"; payload: { id: string; changes: Partial<Omit<Note, "id" | "createdAt">> } }
  | { type: "DELETE_NOTE"; payload: { id: string } };



const NotesContext = createContext<Note[]>([]);
const NotesDispatchContext = createContext<(action: NotesAction) => void>(
  () => {}
);

export function NotesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);

  
  const loadNotes = useCallback(async (uid: string) => {
    try {
      const fetched = await getNotes(uid);
      setNotes(fetched);
    } catch (error) {
      console.error("[NotesContext] loadNotes failed:", error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadNotes(user.uid);
    } else {
      setNotes([]);
    }
  }, [user, loadNotes]);

  
  const dispatch = useCallback(
    async (action: NotesAction) => {
      if (!user) return;

      switch (action.type) {
        case "ADD_NOTE": {
          const { id: _id, ...noteWithoutId } = action.payload;
          
          setNotes((prev) => [action.payload, ...prev]);
          try {
            
            await addNote(user.uid, noteWithoutId);
            
            await loadNotes(user.uid);
          } catch (error) {
            console.error("[NotesContext] addNote failed:", error);
          }
          break;
        }
        case "UPDATE_NOTE": {
          const { id, changes } = action.payload;
          
          setNotes((prev) =>
            prev.map((note) =>
              note.id === id
                ? { ...note, ...changes, updatedAt: new Date().toISOString() }
                : note
            )
          );
          try {
            
            await firestoreUpdateNote(user.uid, id, changes);
            
            await loadNotes(user.uid);
          } catch (error) {
            console.error("[NotesContext] updateNote failed:", error);
          }
          break;
        }
        case "DELETE_NOTE": {
          const { id } = action.payload;
          setNotes((prev) => prev.filter((note) => note.id !== id));
          try {
            await firestoreDeleteNote(user.uid, id);
          } catch (error) {
            console.error("[NotesContext] deleteNote failed:", error);
            await loadNotes(user.uid);
          }
          break;
        }
      }
    },
    [user, loadNotes]
  );

  return (
    <NotesContext.Provider value={notes}>
      <NotesDispatchContext.Provider value={dispatch}>
        {children}
      </NotesDispatchContext.Provider>
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}

export function useNotesDispatch() {
  return useContext(NotesDispatchContext);
}
