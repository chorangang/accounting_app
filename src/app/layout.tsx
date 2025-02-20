import type { Metadata } from "next";
import { DotGothic16 } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";
import { Header } from './components/Header';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const dotGothic16 = DotGothic16({
  variable: "--font-dot-gothic-16",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "たのしい会計",
  description: "とってもたのしい",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ja">
      <body
        className={`${dotGothic16.className} antialiased`}
        // className={`${geistSans.variable} ${geistMono.variable} ${dotGothic16.variable} antialiased`}
      >
        <div className="max-w-2xl mx-auto p-2">
          <AuthProvider session={session}>
            <Header />
          </AuthProvider>
          {children}
        </div>
      </body>
    </html>
  );
}
