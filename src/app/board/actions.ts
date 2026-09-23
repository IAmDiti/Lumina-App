"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getUserId } from "@/lib/supabase/server";

const Input = z.object({
  id: z.uuid(),
  status: z.enum(["active", "resolved"]),
});

export async function setPatternStatus(formData: FormData) {
  const parsed = Input.safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) return;

  const { supabase, userId } = await getUserId();
  if (!userId) return;

  await supabase.from("patterns").update({ status: parsed.data.status }).eq("id", parsed.data.id);
  revalidatePath("/board");
  revalidatePath("/journal");
}
