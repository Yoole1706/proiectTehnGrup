"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";

/* ── Note type ─────────────────────────────────────────────── */

export type Note = {
  id: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

/* ── Actions ───────────────────────────────────────────────── */

type NotesAction = { type: "ADD_NOTE"; payload: Note };

/* ── Reducer ───────────────────────────────────────────────── */

function notesReducer(state: Note[], action: NotesAction): Note[] {
  switch (action.type) {
    case "ADD_NOTE":
      return [action.payload, ...state];
    default:
      return state;
  }
}

/* ── Mock seed data ────────────────────────────────────────── */

const SEED_NOTES: Note[] = [
  {
    id: "seed-1",
    title: "Weekly Grocery List",
    body: "Milk, eggs, bread, chicken breast, spinach, rice, olive oil, garlic, onions, tomatoes, cheese, yogurt. Remember to check for discounts on organic produce. Also pick up paper towels and dish soap from the household aisle.",
    category: "Personal",
    tags: ["shopping", "weekly"],
    createdAt: "2026-04-28T10:15:00.000Z",
    updatedAt: "2026-04-28T10:15:00.000Z",
  },
  {
    id: "seed-2",
    title: "React Performance Tips",
    body: "1. Memoize expensive calculations with useMemo.\n2. Use React.memo for pure components that re-render too often.\n3. Virtualize long lists with react-window or tanstack-virtual.\n4. Avoid creating new objects/arrays in render — extract them to refs or state.\n5. Profile with React DevTools Profiler before optimizing blindly.",
    category: "Development",
    tags: ["react", "performance", "frontend"],
    createdAt: "2026-05-01T14:30:00.000Z",
    updatedAt: "2026-05-02T09:00:00.000Z",
  },
  {
    id: "seed-3",
    title: "Book Recommendations",
    body: "Currently reading: 'Designing Data-Intensive Applications' by Martin Kleppmann. Up next: 'The Pragmatic Programmer' by Hunt & Thomas. Also want to revisit 'Clean Code' for the chapter on error handling. Ask David about his favorite systems-design book.",
    category: "Reading",
    tags: ["books", "learning"],
    createdAt: "2026-05-03T18:45:00.000Z",
    updatedAt: "2026-05-03T18:45:00.000Z",
  },
];

/* ── Context ───────────────────────────────────────────────── */

const NotesContext = createContext<Note[]>([]);
const NotesDispatchContext = createContext<Dispatch<NotesAction>>(() => {});

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, dispatch] = useReducer(notesReducer, SEED_NOTES);

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
