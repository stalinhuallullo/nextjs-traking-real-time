import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import NavVertical from "@/components/nav-vertical/nav";
import { UIProvider } from "@/context/ui";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
 
    return (
        <UIProvider>
            <html lang="en">
                <body className={inter.className}>
                    <NavVertical />
                    {children}
                </body>
            </html>
        </UIProvider>
    );
}
