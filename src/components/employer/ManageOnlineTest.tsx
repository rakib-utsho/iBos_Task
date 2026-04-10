"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    FiCheck,
    FiCheckCircle,
    FiChevronDown,
    FiClock,
    FiEdit2,
    FiPlus,
    FiTrash2,
    FiX,
} from "react-icons/fi";
import { toast } from "sonner";

type Step = 1 | 2;
type QuestionType = "Checkbox" | "Radio" | "Text";
type BasicQuestionType = "MCQ" | "Checkbox" | "Text";

type BasicInfo = {
  title: string;
  candidates: string;
  slots: string;
  questionSet: string;
  questionType: BasicQuestionType;
  startTime: string;
  endTime: string;
  duration: string;
};

type QuestionOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  prompt: string;
  type: QuestionType;
  score: number;
  options: QuestionOption[];
};

type QuestionDraft = {
  prompt: string;
  type: QuestionType;
  score: number;
  options: QuestionOption[];
};

const questionTypeOptions: QuestionType[] = ["Checkbox", "Radio", "Text"];

const questionTypeBasicOptions: BasicQuestionType[] = ["MCQ", "Checkbox", "Text"];

const createDefaultOptions = (): QuestionOption[] => [
  { id: crypto.randomUUID(), text: "", isCorrect: false },
  { id: crypto.randomUUID(), text: "", isCorrect: false },
  { id: crypto.randomUUID(), text: "", isCorrect: false },
];

const emptyBasicInfo: BasicInfo = {
  title: "",
  candidates: "",
  slots: "",
  questionSet: "",
  questionType: "MCQ",
  startTime: "",
  endTime: "",
  duration: "",
};

const createEmptyDraft = (): QuestionDraft => ({
  prompt: "",
  type: "Checkbox",
  score: 1,
  options: createDefaultOptions(),
});

const richTextTools = [
  { label: "Undo", command: "undo" },
  { label: "Redo", command: "redo" },
  { label: "B", command: "bold" },
  { label: "I", command: "italic" },
  { label: "U", command: "underline" },
  { label: "• List", command: "insertUnorderedList" },
  { label: "1. List", command: "insertOrderedList" },
  { label: "Left", command: "justifyLeft" },
  { label: "Center", command: "justifyCenter" },
  { label: "Right", command: "justifyRight" },
  { label: "Justify", command: "justifyFull" },
];

const getPlainTextFromHtml = (html: string) => {
  if (!html) {
    return "";
  }

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  return (wrapper.textContent || "").replace(/\u00a0/g, " ").trim();
};

const isEffectivelyEmptyHtml = (html: string) => {
  return getPlainTextFromHtml(html).length === 0;
};

function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeightClassName = "min-h-28",
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minHeightClassName?: string;
  ariaLabel: string;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const runCommand = (command: string, commandValue?: string) => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="rounded-lg border border-(--akij-border) bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-(--akij-border) px-2 py-1.5">
        {richTextTools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            onClick={() => runCommand(tool.command)}
            className="rounded-md px-2 py-1 text-xs font-semibold text-(--akij-heading) transition hover:bg-[#f3f4f6]"
          >
            {tool.label}
          </button>
        ))}
      </div>

      <div className="relative">
        {isEffectivelyEmptyHtml(value) && (
          <p className="pointer-events-none absolute left-3 top-2 text-sm text-(--akij-subtext)">
            {placeholder}
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label={ariaLabel}
          className={`${minHeightClassName} w-full px-3 py-2 text-sm text-(--akij-text) outline-none [&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc`}
          onInput={(event) => onChange(event.currentTarget.innerHTML)}
        />
      </div>
    </div>
  );
}

function StepPill({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex size-5 items-center justify-center rounded-full text-xs font-semibold ${
          completed || active
            ? "bg-(--akij-btn-start) text-white"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        {completed ? <FiCheck className="size-3" /> : number}
      </span>
      <span
        className={`text-sm ${
          active || completed ? "text-(--akij-heading)" : "text-(--akij-subtext)"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function StepHeader({ step }: { step: Step }) {
  const isBasicDone = step > 1;
  const isQuestionDone = false;

  return (
    <Card className="gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
      <CardContent className="flex flex-col gap-5 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-(--akij-heading)">
            Manage Online Test
          </h2>
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-xl border-(--akij-border) px-5 text-sm font-semibold text-(--akij-heading)"
          >
            <Link href="/employer-dashboard">Back to Dashboard</Link>
          </Button>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <StepPill number={1} label="Basic Info" active={step === 1} completed={isBasicDone} />
          <div className="h-px w-16 bg-(--akij-border)" />
          <StepPill
            number={2}
            label="Questions Sets"
            active={step === 2}
            completed={isQuestionDone}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function BasicInfoForm({
  value,
  onChange,
  onSave,
  onCancel,
}: {
  value: BasicInfo;
  onChange: (next: BasicInfo) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const inputClassName =
    "h-11 w-full rounded-lg border border-(--akij-border) bg-white px-3 text-sm text-(--akij-text) outline-none transition focus:border-(--akij-btn-start) focus:ring-2 focus:ring-(--akij-btn-start)/20";

  return (
    <>
      <Card className="mx-auto mt-6 max-w-4xl gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
        <CardContent className="space-y-5 p-5 sm:p-7">
          <h3 className="text-2xl font-semibold text-(--akij-heading)">Basic Information</h3>

          <div>
            <label className="mb-1.5 block text-sm text-(--akij-heading)">Online Test Title *</label>
            <input
              className={inputClassName}
              placeholder="Enter online test title"
              value={value.title}
              onChange={(event) => onChange({ ...value, title: event.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-(--akij-heading)">Total Candidates *</label>
              <input
                className={inputClassName}
                placeholder="Enter total candidates"
                value={value.candidates}
                onChange={(event) => onChange({ ...value, candidates: event.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-(--akij-heading)" htmlFor="total-slots">
                Total Slots *
              </label>
              <div className="relative">
                <select
                  id="total-slots"
                  className={`${inputClassName} appearance-none pr-9`}
                  value={value.slots}
                  onChange={(event) => onChange({ ...value, slots: event.target.value })}
                >
                  <option value="" disabled>
                    Select total slots
                  </option>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-(--akij-subtext)" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-(--akij-heading)" htmlFor="total-question-set">
                Total Question Set *
              </label>
              <div className="relative">
                <select
                  id="total-question-set"
                  className={`${inputClassName} appearance-none pr-9`}
                  value={value.questionSet}
                  onChange={(event) => onChange({ ...value, questionSet: event.target.value })}
                >
                  <option value="" disabled>
                    Select total question set
                  </option>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-(--akij-subtext)" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-(--akij-heading)" htmlFor="question-type">
                Question Type *
              </label>
              <div className="relative">
                <select
                  id="question-type"
                  className={`${inputClassName} appearance-none pr-9`}
                  value={value.questionType}
                  onChange={(event) =>
                    onChange({ ...value, questionType: event.target.value as BasicQuestionType })
                  }
                >
                  {questionTypeBasicOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-(--akij-subtext)" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_130px]">
            <div>
              <label className="mb-1.5 block text-sm text-(--akij-heading)" htmlFor="start-time">
                Start Time *
              </label>
              <div className="relative">
                <input
                  id="start-time"
                  type="time"
                  className={`${inputClassName} pr-9`}
                  value={value.startTime}
                  onChange={(event) => onChange({ ...value, startTime: event.target.value })}
                />
                <FiClock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-(--akij-subtext)" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-(--akij-heading)" htmlFor="end-time">
                End Time *
              </label>
              <div className="relative">
                <input
                  id="end-time"
                  type="time"
                  className={`${inputClassName} pr-9`}
                  value={value.endTime}
                  onChange={(event) => onChange({ ...value, endTime: event.target.value })}
                />
                <FiClock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-(--akij-subtext)" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-(--akij-heading)">Duration</label>
              <input
                className={inputClassName}
                placeholder="Duration"
                value={value.duration}
                onChange={(event) => onChange({ ...value, duration: event.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto mt-4 max-w-4xl gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
        <CardContent className="flex items-center justify-between p-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 min-w-30 rounded-xl border-(--akij-border) bg-white text-(--akij-heading)"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-11 min-w-42.5 rounded-xl bg-linear-to-r from-(--akij-btn-start) to-(--akij-btn-end) text-base font-semibold text-white"
            onClick={onSave}
          >
            Save & Continue
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

function BasicInfoSummary({
  value,
  onEdit,
  onContinue,
}: {
  value: BasicInfo;
  onEdit: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <Card className="mx-auto mt-6 max-w-4xl gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
        <CardContent className="space-y-5 p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-semibold text-(--akij-heading)">Basic Information</h3>
            <Button
              type="button"
              variant="ghost"
              className="h-auto p-0 text-sm font-semibold text-(--akij-btn-start) hover:bg-transparent"
              onClick={onEdit}
            >
              <FiEdit2 className="mr-1 size-4" /> Edit
            </Button>
          </div>

          <div>
            <p className="text-sm text-(--akij-subtext)">Online Test Title</p>
            <p className="mt-1 text-lg font-semibold text-(--akij-heading)">{value.title}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-(--akij-subtext)">Total Candidates</p>
              <p className="mt-1 text-lg font-semibold text-(--akij-heading)">{value.candidates}</p>
            </div>
            <div>
              <p className="text-sm text-(--akij-subtext)">Total Slots</p>
              <p className="mt-1 text-lg font-semibold text-(--akij-heading)">{value.slots}</p>
            </div>
            <div>
              <p className="text-sm text-(--akij-subtext)">Total Question Set</p>
              <p className="mt-1 text-lg font-semibold text-(--akij-heading)">{value.questionSet}</p>
            </div>
            <div>
              <p className="text-sm text-(--akij-subtext)">Duration Per Slots (Minutes)</p>
              <p className="mt-1 text-lg font-semibold text-(--akij-heading)">{value.duration || "-"}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-(--akij-subtext)">Question Type</p>
            <p className="mt-1 text-lg font-semibold text-(--akij-heading)">{value.questionType}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto mt-4 max-w-4xl gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
        <CardContent className="flex items-center justify-between p-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 min-w-30 rounded-xl border-(--akij-border) bg-white text-(--akij-heading)"
            onClick={onEdit}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-11 min-w-42.5 rounded-xl bg-linear-to-r from-(--akij-btn-start) to-(--akij-btn-end) text-base font-semibold text-white"
            onClick={onContinue}
          >
            Save & Continue
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

function QuestionCard({
  index,
  question,
  onEdit,
  onRemove,
}: {
  index: number;
  question: Question;
  onEdit: () => void;
  onRemove: () => void;
}) {
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

function QuestionModal({
  isOpen,
  setOpen,
  draft,
  setDraft,
  onSave,
  onSaveAndAdd,
  onDelete,
  isEditing,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  draft: QuestionDraft;
  setDraft: (draft: QuestionDraft) => void;
  onSave: () => void;
  onSaveAndAdd: () => void;
  onDelete: () => void;
  isEditing: boolean;
}) {
  if (!isOpen) {
    return null;
  }

  const setOptionText = (id: string, text: string) => {
    setDraft({
      ...draft,
      options: draft.options.map((option) =>
        option.id === id ? { ...option, text } : option,
      ),
    });
  };

  const toggleCorrect = (id: string) => {
    if (draft.type === "Checkbox") {
      setDraft({
        ...draft,
        options: draft.options.map((option) =>
          option.id === id ? { ...option, isCorrect: !option.isCorrect } : option,
        ),
      });
      return;
    }

    setDraft({
      ...draft,
      options: draft.options.map((option) => ({
        ...option,
        isCorrect: option.id === id,
      })),
    });
  };

  const addOption = () => {
    setDraft({
      ...draft,
      options: [...draft.options, { id: crypto.randomUUID(), text: "", isCorrect: false }],
    });
  };

  const removeOption = (id: string) => {
    if (draft.options.length <= 1) {
      return;
    }

    setDraft({
      ...draft,
      options: draft.options.filter((option) => option.id !== id),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-(--akij-border) bg-white p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-(--akij-border) pb-4">
          <h4 className="mr-auto text-xl font-semibold text-(--akij-heading)">Question</h4>

          <label className="text-sm font-semibold text-(--akij-heading)" htmlFor="question-score">
            Score:
          </label>
          <input
            id="question-score"
            type="number"
            min={1}
            className="h-9 w-16 rounded-md border border-(--akij-border) px-2 text-sm outline-none"
            value={draft.score}
            onChange={(event) =>
              setDraft({ ...draft, score: Number(event.target.value) || 1 })
            }
          />

          <div className="relative">
            <select
              id="question-type-selector"
              aria-label="Question type"
              value={draft.type}
              onChange={(event) => {
                const nextType = event.target.value as QuestionType;
                setDraft({
                  ...draft,
                  type: nextType,
                  options: nextType === "Text" ? [createDefaultOptions()[0]] : createDefaultOptions(),
                });
              }}
              className="h-9 rounded-md border border-(--akij-border) bg-white pl-3 pr-8 text-sm outline-none"
            >
              {questionTypeOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-(--akij-subtext)" />
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={onDelete}
              className="text-[#ef4444] transition hover:opacity-80"
              aria-label="Delete question"
            >
              <FiTrash2 className="size-5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-(--akij-subtext) transition hover:text-(--akij-heading)"
            aria-label="Close question modal"
          >
            <FiX className="size-5" />
          </button>
        </div>

        <div className="space-y-4">
          <RichTextEditor
            value={draft.prompt}
            onChange={(next) => setDraft({ ...draft, prompt: next })}
            placeholder="Write question"
            ariaLabel="Question text editor"
          />

          {draft.options.map((option, index) => (
            <div key={option.id} className="space-y-2">
              <div className="flex items-center justify-between gap-2 text-sm text-(--akij-heading)">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-5 items-center justify-center rounded-full border border-(--akij-border) text-xs">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {draft.type !== "Text" && (
                    <label className="flex items-center gap-2 text-sm text-(--akij-subtext)">
                      <input
                        type={draft.type === "Checkbox" ? "checkbox" : "radio"}
                        name="set-correct"
                        checked={option.isCorrect}
                        onChange={() => toggleCorrect(option.id)}
                      />
                      Set as correct answer
                    </label>
                  )}
                </div>

                {draft.type !== "Text" && (
                  <button
                    type="button"
                    onClick={() => removeOption(option.id)}
                    className="text-(--akij-subtext) transition hover:text-[#ef4444]"
                    aria-label={`Remove option ${index + 1}`}
                  >
                    <FiTrash2 className="size-4" />
                  </button>
                )}
              </div>

              {draft.type === "Text" ? (
                <RichTextEditor
                  value={option.text}
                  onChange={(next) => setOptionText(option.id, next)}
                  placeholder="Write expected answer"
                  minHeightClassName="min-h-22"
                  ariaLabel={`Expected answer editor ${index + 1}`}
                />
              ) : (
                <RichTextEditor
                  value={option.text}
                  onChange={(next) => setOptionText(option.id, next)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  minHeightClassName="min-h-16"
                  ariaLabel={`Option editor ${index + 1}`}
                />
              )}
            </div>
          ))}

          {draft.type !== "Text" && (
            <button
              type="button"
              onClick={addOption}
              className="inline-flex items-center gap-1 text-sm font-semibold text-(--akij-btn-start)"
            >
              <FiPlus className="size-4" /> Another options
            </button>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-(--akij-border) pt-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 min-w-30 rounded-xl border-(--akij-btn-start) text-(--akij-btn-start)"
            onClick={onSave}
          >
            Save
          </Button>
          <Button
            type="button"
            className="h-11 min-w-40 rounded-xl bg-linear-to-r from-(--akij-btn-start) to-(--akij-btn-end) text-white"
            onClick={onSaveAndAdd}
          >
            Save & Add More
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ManageOnlineTest() {
  const [step, setStep] = useState<Step>(1);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(emptyBasicInfo);
  const [isBasicInfoPreview, setIsBasicInfoPreview] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState<QuestionDraft>(createEmptyDraft());
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const isBasicValid = useMemo(() => {
    return (
      basicInfo.title.trim() &&
      basicInfo.candidates.trim() &&
      basicInfo.slots.trim() &&
      basicInfo.questionSet.trim() &&
      basicInfo.startTime.trim() &&
      basicInfo.endTime.trim()
    );
  }, [basicInfo]);

  const openCreateQuestion = () => {
    setEditingQuestionId(null);
    setDraft(createEmptyDraft());
    setIsModalOpen(true);
  };

  const openEditQuestion = (question: Question) => {
    setEditingQuestionId(question.id);
    setDraft({
      prompt: question.prompt,
      type: question.type,
      score: question.score,
      options: question.options.map((item) => ({ ...item })),
    });
    setIsModalOpen(true);
  };

  const persistDraft = () => {
    const normalizedPrompt = draft.prompt.trim();
    const promptPlainText = getPlainTextFromHtml(normalizedPrompt);

    if (!promptPlainText) {
      toast.error("Question title is required.");
      return false;
    }

    const cleanedOptions = draft.options
      .map((option) => ({ ...option, text: option.text.trim() }))
      .filter(
        (option) => getPlainTextFromHtml(option.text).length > 0 || draft.type === "Text",
      );

    if (cleanedOptions.length === 0) {
      toast.error("Please add at least one answer option.");
      return false;
    }

    const hasCorrect =
      draft.type === "Text" ? true : cleanedOptions.some((option) => option.isCorrect);

    if (!hasCorrect) {
      toast.error("Please mark at least one correct answer.");
      return false;
    }

    const payload: Question = {
      id: editingQuestionId ?? crypto.randomUUID(),
      prompt: normalizedPrompt,
      type: draft.type,
      score: draft.score,
      options: cleanedOptions,
    };

    setQuestions((prev) => {
      if (!editingQuestionId) {
        return [...prev, payload];
      }

      return prev.map((item) => (item.id === editingQuestionId ? payload : item));
    });

    return true;
  };

  const handleSaveQuestion = () => {
    const saved = persistDraft();

    if (!saved) {
      return;
    }

    setIsModalOpen(false);
    setEditingQuestionId(null);
    setDraft(createEmptyDraft());
  };

  const handleSaveAndAddMore = () => {
    const saved = persistDraft();

    if (!saved) {
      return;
    }

    setEditingQuestionId(null);
    setDraft(createEmptyDraft());
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = () => {
    if (!editingQuestionId) {
      return;
    }

    setQuestions((prev) => prev.filter((item) => item.id !== editingQuestionId));
    setEditingQuestionId(null);
    setDraft(createEmptyDraft());
    setIsModalOpen(false);
  };

  return (
    <section className="mx-auto min-h-[calc(100vh-7rem)] w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <StepHeader step={step} />

      {step === 1 && !isBasicInfoPreview && (
        <BasicInfoForm
          value={basicInfo}
          onChange={setBasicInfo}
          onCancel={() => setBasicInfo(emptyBasicInfo)}
          onSave={() => {
            if (!isBasicValid) {
              toast.error("Please fill all required basic information fields.");
              return;
            }
            setIsBasicInfoPreview(true);
          }}
        />
      )}

      {step === 1 && isBasicInfoPreview && (
        <BasicInfoSummary
          value={basicInfo}
          onEdit={() => setIsBasicInfoPreview(false)}
          onContinue={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <div className="mx-auto mt-6 max-w-5xl space-y-4">
          {questions.length === 0 ? (
            <Card className="gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
              <CardContent className="p-4 sm:p-6">
                <Button
                  type="button"
                  className="h-12 w-full rounded-xl bg-linear-to-r from-(--akij-btn-start) to-(--akij-btn-end) text-base font-semibold text-white"
                  onClick={openCreateQuestion}
                >
                  Add Question
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  index={index}
                  question={question}
                  onEdit={() => openEditQuestion(question)}
                  onRemove={() =>
                    setQuestions((prev) => prev.filter((item) => item.id !== question.id))
                  }
                />
              ))}

              <Card className="gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
                <CardContent className="p-4">
                  <Button
                    type="button"
                    className="h-11 w-full rounded-xl bg-linear-to-r from-(--akij-btn-start) to-(--akij-btn-end) text-base font-semibold text-white"
                    onClick={openCreateQuestion}
                  >
                    Add Question
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      <QuestionModal
        isOpen={isModalOpen}
        setOpen={setIsModalOpen}
        draft={draft}
        setDraft={setDraft}
        onSave={handleSaveQuestion}
        onSaveAndAdd={handleSaveAndAddMore}
        onDelete={handleDeleteQuestion}
        isEditing={Boolean(editingQuestionId)}
      />
    </section>
  );
}
