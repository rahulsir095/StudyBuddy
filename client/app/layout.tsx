"use client";
import "./globals.css";
import { Poppins, Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utils/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { FC, useEffect, useState } from "react";
import Loader from "./components/Loader/Loader";
import { socket } from "./utils/socket";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${josefin.variable} bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black transition duration-300`}
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Mounted>
                <Custom>{children}</Custom>
              </Mounted>
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>

          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

const Custom: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});
  useEffect(() => {
    socket.on("connection", () => { });
  })

  return isLoading ? <Loader /> : <>{children}</>;
};

const Mounted = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className="bg-white dark:bg-black min-h-screen" />;
  }
  return <>{children}</>;
};