import type { Metadata } from "next";
import "./globals.css";

// Using system fonts as fallback instead of Google Fonts to avoid build issues
const outfitClasses = "font-display";
const interClasses = "font-body";

export const metadata: Metadata = {
  title: "Micra Jobs - Find Campus Opportunities",
  description:
    "The open platform for students to find jobs, events, and community opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`antialiased bg-background-light dark:bg-background-dark text-[#111418] dark:text-white overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
