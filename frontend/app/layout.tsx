import type { Metadata } from "next";
import {Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Roboto } from 'next/font/google'
import {Toaster} from "sonner";

import ApolloProviderWrapper from "@/lib/providers/ApolloProviderWrapper";





const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Your exact weights
  variable: '--font-roboto',     // Creates a CSS variable
  display: 'swap',               // Equivalent to display=swap in your URL
})



export const metadata: Metadata = {
  title: "KCMart",
  description: "E-commerce power house" +
      "Made for designers and developers",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
      <NavBar/>
<ApolloProviderWrapper>
  {children}
</ApolloProviderWrapper>
      <Footer/>
      <Toaster richColors={true}/>
      </body>
    </html>
  );
}
