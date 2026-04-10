export type QuestionType = "Radio" | "Checkbox" | "Text";

export type TestSummary = {
  id: string;
  title: string;
  durationMinutes: number;
  questionCount: number;
  negativeMarking: string;
};

export type QuestionPayload = {
  prompt: string;
  type: QuestionType;
  score: number;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
};

export type CreateTestPayload = {
  title: string;
  totalCandidates: number;
  totalSlots: number;
  totalQuestionSet: number;
  questionType: "MCQ" | "Checkbox" | "Text";
  startTime: string;
  endTime: string;
  durationMinutes: number;
  negativeMarking?: string;
  questions: QuestionPayload[];
};

export type CandidateQuestion = {
  id: string;
  type: QuestionType;
  prompt: string;
  score: number;
  options: {
    id: string;
    text: string;
  }[];
};

export type CandidateTestDetail = {
  id: string;
  title: string;
  durationMinutes: number;
  questions: CandidateQuestion[];
};

export type CandidateAnswerPayload = Record<
  string,
  {
    radio?: string;
    checkbox?: string[];
    text?: string;
  }
>;
