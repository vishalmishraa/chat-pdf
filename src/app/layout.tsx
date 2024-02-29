
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import Navigation from "@/components/nevigation";
import { ThemeProvider } from "@/components/global/theme-provider"
import Providers from "@/components/Providers";
import {Toaster} from 'react-hot-toast';
import Script from "next/script";
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat PDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider >
      <Providers>

          <html lang="en">
          <GoogleAnalytics gaId="G-SHYFWSMP2Y"/>
         
            <body className={inter.className}>
            
                  <Navigation/>
                  {children}
                  <Toaster />
              
              </body>
          </html>
         
      </Providers>
    </ClerkProvider>
  );
}
