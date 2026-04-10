import { getServerAuthContext } from "@/lib/auth/server-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createTestPayloadSchema } from "@/lib/validation/exam";
import { CreateTestPayload } from "@/types/exam";
import { NextResponse } from "next/server";

export async function GET() {
  const { user, role, unauthorizedResponse } = await getServerAuthContext();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  if (role !== "employee") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("online_tests")
    .select(
      "id,title,total_candidates,total_question_set,total_slots,created_at,online_test_questions(count)",
    )
    .eq("created_by", user!.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const mapped = (data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    candidates: item.total_candidates,
    questionSet: item.total_question_set,
    examSlots: item.total_slots,
    questionCount: item.online_test_questions?.[0]?.count ?? 0,
  }));

  return NextResponse.json({ tests: mapped });
}

export async function POST(request: Request) {
  const { user, role, unauthorizedResponse } = await getServerAuthContext();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  if (role !== "employee") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const rawPayload = await request.json();
  const parsed = createTestPayloadSchema.safeParse(rawPayload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid payload.",
        issues: parsed.error.issues.map((issue) => issue.message),
      },
      { status: 400 },
    );
  }

  const payload = parsed.data as CreateTestPayload;

  const { data: createdTest, error: testInsertError } = await supabaseAdmin
    .from("online_tests")
    .insert({
      title: payload.title.trim(),
      total_candidates: payload.totalCandidates,
      total_slots: payload.totalSlots,
      total_question_set: payload.totalQuestionSet,
      question_type: payload.questionType,
      start_time: payload.startTime,
      end_time: payload.endTime,
      duration_minutes: payload.durationMinutes,
      negative_marking: payload.negativeMarking ?? "-0.25/wrong",
      created_by: user!.id,
      is_published: true,
    })
    .select("id")
    .single();

  if (testInsertError || !createdTest) {
    return NextResponse.json(
      { message: testInsertError?.message ?? "Failed to create test." },
      { status: 500 },
    );
  }

  for (let questionIndex = 0; questionIndex < payload.questions.length; questionIndex += 1) {
    const question = payload.questions[questionIndex];

    const { data: insertedQuestion, error: questionInsertError } = await supabaseAdmin
      .from("online_test_questions")
      .insert({
        test_id: createdTest.id,
        prompt_html: question.prompt,
        question_type: question.type,
        score: question.score,
        position: questionIndex + 1,
      })
      .select("id")
      .single();

    if (questionInsertError || !insertedQuestion) {
      return NextResponse.json(
        { message: questionInsertError?.message ?? "Failed to insert question." },
        { status: 500 },
      );
    }

    const optionRows = question.options.map((option, optionIndex) => ({
      question_id: insertedQuestion.id,
      option_text_html: option.text,
      is_correct: option.isCorrect,
      position: optionIndex + 1,
    }));

    if (optionRows.length > 0) {
      const { error: optionsInsertError } = await supabaseAdmin
        .from("online_test_question_options")
        .insert(optionRows);

      if (optionsInsertError) {
        return NextResponse.json({ message: optionsInsertError.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ testId: createdTest.id, success: true });
}
