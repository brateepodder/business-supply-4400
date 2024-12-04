"use client";

import "@/styles/globals.css";
import clsx from "clsx";

import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { fontSans } from "@/config/fonts";
import { ConfigProvider } from './ConfigContext';  // Import ConfigProvider

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {/* Wrap the content with ConfigProvider */}
        <ConfigProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex flex-col h-screen">
              {/* Navbar */}
              <Navbar />

              {/* Page Content */}
              <main className="container mx-auto max-w-7xl m-8 px-6 flex-grow">
                {children}
              </main>

              {/* Custom Footer */}
              <footer className="w-full bg-slate-800 text-white py-6 mt-10">
                <div className="text-center">
                  <p>
                    This project was created by <strong>Bratee Podder</strong> and{" "}
                    <strong>Yueru Zhou</strong> for the class{" "}
                    <strong>CS4400 (Introduction to Databases)</strong> at{" "}
                    <strong>Georgia Institute of Technology</strong>.
                  </p>
                </div>
              </footer>
            </div>
          </Providers>
        </ConfigProvider>
      </body>
    </html>
  );
}
