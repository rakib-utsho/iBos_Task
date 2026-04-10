export type Step = 1 | 2;

export type QuestionType = "Checkbox" | "Radio" | "Text";
export type BasicQuestionType = "MCQ" | "Checkbox" | "Text";

export type BasicInfo = {
  title: string;
  candidates: string;
  slots: string;
  questionSet: string;
  questionType: BasicQuestionType;
  startTime: string;
  endTime: string;
  duration: string;
};

export type QuestionOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  prompt: string;
  type: QuestionType;
  score: number;
  options: QuestionOption[];
};

export type QuestionDraft = {
  prompt: string;
  type: QuestionType;
  score: number;
  options: QuestionOption[];
};
