import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * À appeler en haut de chaque page/action protégée.
 * Remplace le middleware : plus explicite, et insensible au
 * renommage middleware.ts -> proxy.ts de Next 16.
 */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  return user;
}

/** Version non bloquante, pour la nav et la landing page. */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
