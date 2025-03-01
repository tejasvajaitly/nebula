import { UserButton } from "@clerk/nextjs";

import { SignUpButton } from "@clerk/nextjs";

import { SignInButton } from "@clerk/nextjs";

import { SignedOut } from "@clerk/nextjs";

import { SignedIn } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      {children}
    </>
  );
}
