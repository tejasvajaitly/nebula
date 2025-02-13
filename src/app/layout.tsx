import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  OrganizationSwitcher,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

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
  description: "Generate changelogs with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "hsl(0, 0%, 9%)",
          colorText: "hsl(60, 100%, 96.7%)",
          colorTextOnPrimaryBackground: "hsl(60, 100%, 96.7%)",
          colorTextSecondary: "hsl(60, 100%, 96.7%)",
          colorInputText: "hsl(0, 0%, 9%)",
          colorNeutral: "hsl(60, 100%, 96.7%)",
          colorBackground: "hsl(0, 0%, 27%)",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className="flex justify-between items-center p-4 gap-4 h-16 border-b-2">
            <div>
              <SignedIn>
                <OrganizationSwitcher hidePersonal={true} />
              </SignedIn>
            </div>
            <div className="flex gap-4">
              <SignedOut>
                <SignInButton>
                  <Button variant="secondary">Sign In</Button>
                </SignInButton>
                <SignUpButton>
                  <Button>Sign Up</Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
