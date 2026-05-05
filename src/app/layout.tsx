import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { NotesProvider } from "@/context/NotesContext";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
	title: "Notes App",
	description: "A simple place to capture your thoughts.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full antialiased">
			<body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
				<AuthProvider>
					<Header />
					<NotesProvider>
						<main className="flex flex-1 flex-col pt-14">
							{children}
						</main>
					</NotesProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
