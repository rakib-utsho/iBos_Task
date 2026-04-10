import { getServerAuthContext } from "@/lib/auth/server-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ testId: string }> },
) {
  const { role, unauthorizedResponse } = await getServerAuthContext();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  if (role !== "candidate") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { testId } = await context.params;

  const { data: test, error: testError } = await supabaseAdmin
    .from("online_tests")
    .select("id,title,duration_minutes")
    .eq("id", testId)
    .eq("is_published", true)
    .single();

  if (testError || !test) {
    return NextResponse.json({ message: "Test not found." }, { status: 404 });
  }

  const { data: questions, error: questionError } = await supabaseAdmin
    .from("online_test_questions")
    .select("id,prompt_html,question_type,score,position")
    .eq("test_id", testId)
    .order("position", { ascending: true });

  if (questionError) {
    return NextResponse.json({ message: questionError.message }, { status: 500 });
  }

  const questionIds = (questions ?? []).map((q) => q.id);

  const { data: options, error: optionError } = questionIds.length
    ? await supabaseAdmin
        .from("online_test_question_options")
        .select("id,question_id,option_text_html,position")
        .in("question_id", questionIds)
        .order("position", { ascending: true })
    : { data: [], error: null };

  if (optionError) {
    return NextResponse.json({ message: optionError.message }, { status: 500 });
  }

  const optionMap = new Map<string, { id: string; text: string }[]>();
  for (const item of options ?? []) {
    const existing = optionMap.get(item.question_id) ?? [];
    existing.push({ id: item.id, text: item.option_text_html });
    optionMap.set(item.question_id, existing);
  }

  const payload = {
    id: test.id,
    title: test.title,
    durationMinutes: test.duration_minutes,
    questions: (questions ?? []).map((question) => ({
      id: question.id,
      type: question.question_type,
      prompt: question.prompt_html,
      score: question.score,
      options: optionMap.get(question.id) ?? [],
    })),
  };

  return NextResponse.json({ test: payload });
}
