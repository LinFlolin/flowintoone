import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { InitialPageLoader } from "@/components/ui/InitialPageLoader";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flowintoone | Discover independent makers",
  description:
    "Scopri creator indipendenti, creazioni artigianali, mercati creativi ed eventi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <InitialPageLoader />
        {children}
      </body>
    </html>
  );
}
