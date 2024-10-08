import type { Metadata } from "next";
import { Montserrat, Shrikhand } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-paragraph",
  subsets: ["latin"],
});
const shrikhand = Shrikhand({
  weight: "400",
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Community Cares Admin",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${shrikhand.variable}`}>
        {children}
      </body>
    </html>
  );
}
