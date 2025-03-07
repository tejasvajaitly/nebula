"use client";

import { use } from "react";
export default function Page({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = use(params);
  const decodedSubdomain = decodeURIComponent(subdomain);

  return (
    <div>
      <p>Hi {decodedSubdomain},</p>
      <p>This will be your changelog page.</p>
    </div>
  );
}
