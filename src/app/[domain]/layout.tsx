import { getSiteDate } from "@/lib/get-site-data";
import { redirect } from "next/navigation";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ domain: string }>;
  children: React.ReactNode;
}) {
  const domain = (await params).domain;
  const decodedDomain = decodeURIComponent(domain);
  const siteData = await getSiteDate(decodedDomain);

  if (!siteData) {
    redirect("/not-found");
  }

  return (
    <div>
      <p>{siteData.subdomain}</p>
      {children}
    </div>
  );
}
