import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryClientProvider } from "@/providers/QueryClientProvider";
import { CustomProvider } from "@/providers/CustomClerkProvider";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nebula",
  description:
    "Nebula is a platform for creating and managing changelogs for your projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ReactQueryClientProvider>
        <CustomProvider>
          <html lang="en" suppressHydrationWarning>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster richColors closeButton />
              </ThemeProvider>
            </body>
          </html>
        </CustomProvider>
      </ReactQueryClientProvider>
    </ClerkProvider>
  );
}
