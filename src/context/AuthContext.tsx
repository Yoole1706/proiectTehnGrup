"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import {
	onAuthStateChanged,
	signOut as firebaseSignOut,
	type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthContextValue = {
	user: User | null;
	loading: boolean;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
	user: null,
	loading: true,
	signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			setUser(firebaseUser);
			setLoading(false);

			if (firebaseUser) {
				document.cookie =
					"__session=1; path=/; max-age=31536000; SameSite=Lax";
			} else {
				document.cookie = "__session=; path=/; max-age=0; SameSite=Lax";
			}
		});

		return () => unsubscribe();
	}, []);

	async function handleSignOut() {
		await firebaseSignOut(auth);
	}

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-zinc-950">
				<div className="text-sm text-zinc-500">Loading…</div>
			</div>
		);
	}

	return (
		<AuthContext.Provider value={{ user, loading, signOut: handleSignOut }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
