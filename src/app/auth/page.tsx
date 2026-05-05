"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

type Mode = "signin" | "signup";

export default function AuthPage() {
	const router = useRouter();
	const { user, loading } = useAuth();

	const [mode, setMode] = useState<Mode>("signin");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [fieldError, setFieldError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!loading && user) {
			router.replace("/");
		}
	}, [user, loading, router]);

	function resetErrors() {
		setError("");
		setFieldError("");
	}

	function switchMode() {
		setMode((m) => (m === "signin" ? "signup" : "signin"));
		resetErrors();
		setConfirmPassword("");
	}

	async function handleEmailSubmit() {
		resetErrors();

		if (mode === "signup" && password !== confirmPassword) {
			setFieldError("Passwords do not match");
			return;
		}

		setSubmitting(true);
		try {
			if (mode === "signup") {
				await createUserWithEmailAndPassword(auth, email, password);
			} else {
				await signInWithEmailAndPassword(auth, email, password);
			}
			router.replace("/");
		} catch (err: unknown) {
			const code = (err as { code?: string }).code ?? "";
			setError(firebaseErrorMessage(code));
		} finally {
			setSubmitting(false);
		}
	}

	async function handleGoogleSignIn() {
		resetErrors();
		setSubmitting(true);
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
			router.replace("/");
		} catch (err: unknown) {
			const code = (err as { code?: string }).code ?? "";
			if (code !== "auth/popup-closed-by-user") {
				setError(firebaseErrorMessage(code));
			}
		} finally {
			setSubmitting(false);
		}
	}

	if (loading || user) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-zinc-950">
				<div className="text-sm text-zinc-500">Loading…</div>
			</div>
		);
	}

	const inputClasses =
		"w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 min-h-[44px]";

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
			<div className="flex w-full max-w-sm flex-col gap-6 rounded-xl border border-zinc-800 bg-zinc-900 p-8">
				<div className="flex flex-col gap-1">
					<h1 className="text-xl font-semibold text-zinc-100">
						{mode === "signin" ? "Sign In" : "Sign Up"}
					</h1>
					<p className="text-sm text-zinc-400">
						{mode === "signin"
							? "Welcome back. Enter your credentials."
							: "Create an account to get started."}
					</p>
				</div>

				{error && (
					<div className="rounded-md border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-400">
						{error}
					</div>
				)}

				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-zinc-400">
							Email
						</label>
						<input
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={inputClasses}
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-zinc-400">
							Password
						</label>
						<input
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={inputClasses}
						/>
					</div>

					{mode === "signup" && (
						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-medium text-zinc-400">
								Confirm Password
							</label>
							<input
								type="password"
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								className={inputClasses}
							/>
							{fieldError && (
								<p className="text-xs text-red-400">
									{fieldError}
								</p>
							)}
						</div>
					)}
				</div>

				<button
					onClick={handleEmailSubmit}
					disabled={submitting}
					className="flex h-11 items-center justify-center rounded-md bg-zinc-100 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40 min-h-11"
				>
					{submitting
						? "Please wait…"
						: mode === "signin"
							? "Sign In"
							: "Sign Up"}
				</button>

				<div className="flex items-center gap-3">
					<div className="h-px flex-1 bg-zinc-800" />
					<span className="text-xs text-zinc-500">or</span>
					<div className="h-px flex-1 bg-zinc-800" />
				</div>

				<button
					onClick={handleGoogleSignIn}
					disabled={submitting}
					className="flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-700 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 min-h-11"
				>
					<svg
						viewBox="0 0 24 24"
						className="h-4 w-4"
						aria-hidden="true"
					>
						<path
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
							fill="#4285F4"
						/>
						<path
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							fill="#34A853"
						/>
						<path
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							fill="#FBBC05"
						/>
						<path
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							fill="#EA4335"
						/>
					</svg>
					Continue with Google
				</button>

				<p className="text-center text-sm text-zinc-400">
					{mode === "signin"
						? "Don't have an account? "
						: "Already have an account? "}
					<button
						onClick={switchMode}
						className="font-medium text-zinc-100 underline underline-offset-4 transition-colors hover:text-zinc-300"
					>
						{mode === "signin" ? "Sign Up" : "Sign In"}
					</button>
				</p>
			</div>
		</div>
	);
}

function firebaseErrorMessage(code: string): string {
	switch (code) {
		case "auth/email-already-in-use":
			return "This email is already in use.";
		case "auth/invalid-email":
			return "Invalid email address.";
		case "auth/weak-password":
			return "Password must be at least 6 characters.";
		case "auth/user-not-found":
		case "auth/wrong-password":
		case "auth/invalid-credential":
			return "Invalid email or password.";
		case "auth/too-many-requests":
			return "Too many attempts. Please try again later.";
		default:
			return "An error occurred. Please try again.";
	}
}
