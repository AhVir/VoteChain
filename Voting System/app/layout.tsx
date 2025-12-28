"use client";
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { VotingProvider } from '@/context/voter';
import NavBar from '@/components/navbar/navbar';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: "VoteChain",
//   description: "Secure, transparent, and decentralized voting platform built on blockchain technology",
//   icons: {
//     icon: "/vote.png",
//   },
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>VoteChain</title>
        <meta name="description" content="Secure, transparent, and decentralized voting platform built on blockchain technology" />
        <link rel="icon" href="/vote.png" type="image/x-icon" />

      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <VotingProvider>
            <div className="min-h-screen bg-background">
              <NavBar />
              <main>{children}</main>
            </div>
          </VotingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}