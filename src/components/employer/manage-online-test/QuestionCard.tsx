"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FiCheckCircle } from "react-icons/fi";
import { Question } from "./types";

type QuestionCardProps = {
  index: number;
  question: Question;
  onEdit: () => void;
  onRemove: () => void;
};

export default function QuestionCard({ index, question, onEdit, onRemove }: QuestionCardProps) {
  const correctTextAnswers = question.options.filter((item) => item.isCorrect);

  return (
    <Card className="gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
      <CardContent className="space-y-5 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-lg font-semibold text-(--akij-heading)">Question {index + 1}</h4>
          <div className="flex items-center gap-2 text-xs text-(--akij-subtext)">
            <span className="rounded-md border border-(--akij-border) px-2 py-1">{question.type}</span>
            <span className="rounded-md border border-(--akij-border) px-2 py-1">{question.score} pt</span>
          </div>
        </div>

        <div
          className="text-base font-semibold text-(--akij-heading) [&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: question.prompt }}
        />

        {question.type === "Text" ? (
          <div
            className="rounded-lg bg-[#f8fafc] p-3 text-sm text-(--akij-subtext) [&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: correctTextAnswers[0]?.text || "No answer set" }}
          />
        ) : (
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div
                key={option.id}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  option.isCorrect ? "bg-[#eefaf2]" : "bg-[#f8fafc]"
                }`}
              >
                <div className="flex items-start gap-1 text-(--akij-heading)">
                  <span>{String.fromCharCode(65 + optionIndex)}.</span>
                  <div
                    className="[&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc"
                    dangerouslySetInnerHTML={{ __html: option.text || "Untitled option" }}
                  />
                </div>
                {option.isCorrect && <FiCheckCircle className="size-4 text-[#00B159]" />}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-1 text-sm">
          <button
            type="button"
            onClick={onEdit}
            className="font-semibold text-(--akij-btn-start) transition hover:opacity-85"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="font-semibold text-[#ef4444] transition hover:opacity-85"
          >
            Remove From Exam
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
