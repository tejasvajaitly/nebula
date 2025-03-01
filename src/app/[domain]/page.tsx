"use client";

import { getSiteDate } from "@/lib/get-site-data";
import { use, useEffect } from "react";
export default function Page({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = use(params);
  const decodedDomain = decodeURIComponent(domain);

  console.log("decodedDomain", decodedDomain);

  useEffect(() => {
    const fetchSiteData = async () => {
      const siteData = await getSiteDate(decodedDomain);
      console.log("siteData", siteData);
    };
    fetchSiteData();
  }, [decodedDomain]);

  return (
    <div>
      <p>Hello Inside the changelog page</p>
      <p>{decodedDomain}</p>
    </div>
  );
}
