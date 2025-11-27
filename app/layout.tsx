import type { Metadata } from "next";
import "./globals.css";
import NavigationMenu from "./components/NavigationMenu";
import { Comfortaa , Nunito } from 'next/font/google'

const comfortaa = Comfortaa({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-comfortaa',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-nunito',
});


export const metadata: Metadata = {
  title: "Flowintoone",
  description: "FlowIntoOne è una piattaforma digitale che riunisce artigiani, piccoli negozi, fornitori e freelance in un unico spazio online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${comfortaa.variable} ${nunito.variable}`}>
        <NavigationMenu />
        {children}
      </body>
    </html>
  );
}
