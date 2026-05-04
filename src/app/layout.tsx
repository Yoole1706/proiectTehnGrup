import type { Metadata } from "next";
import { NotesProvider } from "@/context/NotesContext";
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
        <NotesProvider>{children}</NotesProvider>
      </body>
    </html>
  );
}
