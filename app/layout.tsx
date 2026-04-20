import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inform6 Web Player",
  description: "Play classic text adventures in your browser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
