"use client";
import { createSite } from "@/lib/get-site-data";

export default function Page() {
  return (
    <div>
      Hello inside the app or future dashboard
      <button onClick={() => createSite("jojo")}>Create Site</button>
    </div>
  );
}
