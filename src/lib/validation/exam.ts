import { z } from "zod";

const questionTypeSchema = z.enum(["Radio", "Checkbox", "Text"]);
const basicQuestionTypeSchema = z.enum(["MCQ", "Checkbox", "Text"]);

export const createTestPayloadSchema = z.object({
  title: z.string().min(3),
  totalCandidates: z.number().int().positive(),
  totalSlots: z.number().int().positive(),
  totalQuestionSet: z.number().int().positive(),
  questionType: basicQuestionTypeSchema,
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  negativeMarking: z.string().optional(),
  questions: z
    .array(
      z.object({
        prompt: z.string().min(1),
        type: questionTypeSchema,
        score: z.number().int().positive(),
        options: z.array(
          z.object({
            text: z.string().min(1),
            isCorrect: z.boolean(),
          }),
        ),
      }),
    )
    .min(1),
});

export const candidateSubmitPayloadSchema = z.object({
  answers: z.record(
    z.string(),
    z.object({
      radio: z.string().optional(),
      checkbox: z.array(z.string()).optional(),
      text: z.string().optional(),
    }),
  ),
  timedOut: z.boolean().optional(),
});
