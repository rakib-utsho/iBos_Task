import { getServerAuthContext } from "@/lib/auth/server-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { role, unauthorizedResponse } = await getServerAuthContext();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  if (role !== "candidate") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("online_tests")
    .select("id,title,duration_minutes,negative_marking,online_test_questions(count)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const tests = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    durationMinutes: row.duration_minutes,
    questionCount: row.online_test_questions?.[0]?.count ?? 0,
    negativeMarking: row.negative_marking,
  }));

  return NextResponse.json({ tests });
}
