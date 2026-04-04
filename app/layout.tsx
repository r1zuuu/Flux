import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/app/components/providers/session-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});


export const metadata: Metadata = {
  title: "Flux - Your Finance Dashboard",
  description: "Manage your finances effortlessly with Flux.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full bg-zinc-950 text-zinc-100 font-sans">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}

