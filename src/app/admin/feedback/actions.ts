"use server";

import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserId } from "@/lib/supabase/server";

export async function setResolved(formData: FormData) {
  const { email } = await getUserId();
  if (!isAdmin(email)) return;

  const id = formData.get("id");
  const resolved = formData.get("resolved") === "true";
  if (typeof id !== "string") return;

  const admin = createAdminClient();
  await admin.from("feedback").update({ resolved }).eq("id", id);
  revalidatePath("/admin/feedback");
}
