import { BasicInfo, BasicQuestionType, QuestionDraft, QuestionOption, QuestionType } from "./types";

export const questionTypeOptions: QuestionType[] = ["Checkbox", "Radio", "Text"];

export const questionTypeBasicOptions: BasicQuestionType[] = ["MCQ", "Checkbox", "Text"];

export const createDefaultOptions = (): QuestionOption[] => [
  { id: crypto.randomUUID(), text: "", isCorrect: false },
  { id: crypto.randomUUID(), text: "", isCorrect: false },
  { id: crypto.randomUUID(), text: "", isCorrect: false },
];

export const emptyBasicInfo: BasicInfo = {
  title: "",
  candidates: "",
  slots: "",
  questionSet: "",
  questionType: "MCQ",
  startTime: "",
  endTime: "",
  duration: "",
};

export const createEmptyDraft = (): QuestionDraft => ({
  prompt: "",
  type: "Checkbox",
  score: 1,
  options: createDefaultOptions(),
});
