import { getServerAuthContext } from "@/lib/auth/server-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { candidateSubmitPayloadSchema } from "@/lib/validation/exam";
import { CandidateAnswerPayload } from "@/types/exam";
import { NextResponse } from "next/server";

const normalizeHtmlToText = (html: string) => {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
};

export async function POST(
  request: Request,
  context: { params: Promise<{ testId: string }> },
) {
  const { user, role, unauthorizedResponse } = await getServerAuthContext();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  if (role !== "candidate") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { testId } = await context.params;

  const rawBody = await request.json();
  const parsedBody = candidateSubmitPayloadSchema.safeParse(rawBody);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message: "Invalid submission payload.",
        issues: parsedBody.error.issues.map((issue) => issue.message),
      },
      { status: 400 },
    );
  }

  const answers = (parsedBody.data.answers ?? {}) as CandidateAnswerPayload;
  const timedOut = Boolean(parsedBody.data.timedOut);

  const { data: questions, error: questionError } = await supabaseAdmin
    .from("online_test_questions")
    .select("id,question_type,score")
    .eq("test_id", testId);

  if (questionError) {
    return NextResponse.json({ message: questionError.message }, { status: 500 });
  }

  const questionIds = (questions ?? []).map((q) => q.id);

  const { data: options, error: optionError } = questionIds.length
    ? await supabaseAdmin
        .from("online_test_question_options")
        .select("id,question_id,option_text_html,is_correct")
        .in("question_id", questionIds)
    : { data: [], error: null };

  if (optionError) {
    return NextResponse.json({ message: optionError.message }, { status: 500 });
  }

  const optionMap = new Map<string, { id: string; text: string; isCorrect: boolean }[]>();
  for (const row of options ?? []) {
    const list = optionMap.get(row.question_id) ?? [];
    list.push({ id: row.id, text: row.option_text_html, isCorrect: row.is_correct });
    optionMap.set(row.question_id, list);
  }

  let obtainedScore = 0;
  const answerRows: {
    question_id: string;
    answer_payload: CandidateAnswerPayload[string];
    awarded_score: number;
  }[] = [];

  for (const question of questions ?? []) {
    const answer = answers[question.id] ?? {};
    const correctOptions = (optionMap.get(question.id) ?? []).filter((option) => option.isCorrect);
    const score = Number(question.score ?? 0);

    let awarded = 0;

    if (question.question_type === "Radio") {
      const selected = answer.radio;
      const correctId = correctOptions[0]?.id;
      if (selected && correctId && selected === correctId) {
        awarded = score;
      }
    }

    if (question.question_type === "Checkbox") {
      const selected = new Set(answer.checkbox ?? []);
      const correct = new Set(correctOptions.map((item) => item.id));
      if (selected.size === correct.size && [...selected].every((item) => correct.has(item))) {
        awarded = score;
      }
    }

    if (question.question_type === "Text") {
      const expected = correctOptions[0]?.text ?? "";
      const candidate = answer.text ?? "";
      if (normalizeHtmlToText(candidate) === normalizeHtmlToText(expected)) {
        awarded = score;
      }
    }

    obtainedScore += awarded;
    answerRows.push({
      question_id: question.id,
      answer_payload: answer,
      awarded_score: awarded,
    });
  }

  const { data: attempt, error: attemptError } = await supabaseAdmin
    .from("online_test_attempts")
    .insert({
      test_id: testId,
      candidate_id: user!.id,
      status: timedOut ? "timed_out" : "completed",
      completed_at: new Date().toISOString(),
      obtained_score: obtainedScore,
    })
    .select("id")
    .single();

  if (attemptError || !attempt) {
    return NextResponse.json(
      { message: attemptError?.message ?? "Failed to create attempt." },
      { status: 500 },
    );
  }

  if (answerRows.length > 0) {
    const { error: answerError } = await supabaseAdmin
      .from("online_test_answers")
      .insert(
        answerRows.map((row) => ({
          attempt_id: attempt.id,
          question_id: row.question_id,
          answer_payload: row.answer_payload,
          awarded_score: row.awarded_score,
        })),
      );

    if (answerError) {
      return NextResponse.json({ message: answerError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, attemptId: attempt.id, obtainedScore });
}
