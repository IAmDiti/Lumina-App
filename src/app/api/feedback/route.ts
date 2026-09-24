import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserId } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BodySchema = z.object({
  type: z.enum(["idea", "bug"]),
  message: z.string().trim().min(3, "Say a little more.").max(2000, "Keep it under 2,000 characters."),
  pageUrl: z.string().trim().max(500).optional(),
});

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

// Open to signed-out visitors as well as signed-in users, so no auth check
// here — user_id is just attached when we have one.
export async function POST(request: Request) {
  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return error(parsed.error.issues[0]?.message ?? "Invalid feedback.", 400);

  const { userId } = await getUserId();

  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    console.error("[lumina] feedback: admin client unavailable", err);
    return error("Feedback isn't available right now. Please try again later.", 503);
  }

  const { error: dbError } = await admin.from("feedback").insert({
    user_id: userId,
    type: parsed.data.type,
    message: parsed.data.message,
    page_url: parsed.data.pageUrl ?? null,
  });

  if (dbError) {
    console.error("[lumina] failed to save feedback", dbError);
    return error("Couldn't send that. Please try again.", 500);
  }

  return NextResponse.json({ ok: true });
}
