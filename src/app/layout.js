import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";
import UserInitializer from "@/context/UserInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Disaster Manager",
  description:
    "Disaster management website - be notified before the disaster happens",

  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth delay-100">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          {/* This component will check and create the user record if necessary */}
          <UserInitializer />
          <main className="flex flex-col min-h-screen">{children}</main>
          <Toaster />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
