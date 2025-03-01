"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

async function createClerkSupabaseClientSsr() {
  const { getToken, userId } = await auth();

  console.log("userId", userId);

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await getToken({
            template: "supabase",
          });

          console.log("clerkToken", clerkToken);

          const headers = new Headers(options?.headers);
          headers.set("Authorization", `Bearer ${clerkToken}`);

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );
}

export async function getSiteDate(subdomain: string) {
  console.log("subdomain", subdomain);

  if (!subdomain) {
    return null;
  }

  const client = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await client
    .from("changelog_sites")
    .select("*")
    .eq("subdomain", subdomain)
    .single();

  console.log("data", data, error);

  if (error?.code === "PGRST116") {
    return null;
  }

  return data;
}

export async function createSite(domain: string) {
  const client = await createClerkSupabaseClientSsr();

  const { data, error } = await client
    .from("changelog_sites")
    .insert({ subdomain: domain });

  console.log("data", data, error);
}
