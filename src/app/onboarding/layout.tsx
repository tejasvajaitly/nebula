import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await auth()).sessionClaims?.metadata?.onboardingComplete === true) {
    redirect("/");
  }

  return (
    <div className="p-4 md:p-8 flex flex-col justify-start items-center">
      {children}
    </div>
  );
}
