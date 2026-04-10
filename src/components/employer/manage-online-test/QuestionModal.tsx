"use client";

import { Button } from "@/components/ui/button";
import { FiChevronDown, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { createDefaultOptions, questionTypeOptions } from "./constants";
import { RichTextEditor } from "./rich-text";
import { QuestionDraft, QuestionType } from "./types";

type QuestionModalProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  draft: QuestionDraft;
  setDraft: (draft: QuestionDraft) => void;
  onSave: () => void;
  onSaveAndAdd: () => void;
  onDelete: () => void;
  isEditing: boolean;
};

export default function QuestionModal({
  isOpen,
  setOpen,
  draft,
  setDraft,
  onSave,
  onSaveAndAdd,
  onDelete,
  isEditing,
}: QuestionModalProps) {
  if (!isOpen) {
    return null;
  }

  const setOptionText = (id: string, text: string) => {
    setDraft({
      ...draft,
      options: draft.options.map((option) => (option.id === id ? { ...option, text } : option)),
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
            onChange={(event) => setDraft({ ...draft, score: Number(event.target.value) || 1 })}
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
