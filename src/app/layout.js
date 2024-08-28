"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./Components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Inventory Management</title>
      </head>
      <body className={inter.className}>
        <Header />
        <br />
        {children}
      </body>
    </html>
  );
}
