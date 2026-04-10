"use client";

import {
  BasicInfoForm,
  BasicInfoSummary,
} from "@/components/employer/manage-online-test/BasicInfoSection";
import {
  createEmptyDraft,
  emptyBasicInfo,
} from "@/components/employer/manage-online-test/constants";
import QuestionCard from "@/components/employer/manage-online-test/QuestionCard";
import QuestionModal from "@/components/employer/manage-online-test/QuestionModal";
import { getPlainTextFromHtml } from "@/components/employer/manage-online-test/rich-text";
import StepHeader from "@/components/employer/manage-online-test/StepHeader";
import {
  BasicInfo,
  Question,
  QuestionDraft,
  Step,
} from "@/components/employer/manage-online-test/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateEmployeeTest } from "@/hooks/useCreateEmployeeTest";
import { CreateTestPayload } from "@/types/exam";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function ManageOnlineTest() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(emptyBasicInfo);
  const [isBasicInfoPreview, setIsBasicInfoPreview] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState<QuestionDraft>(createEmptyDraft());
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const createTestMutation = useCreateEmployeeTest();

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
        (option) =>
          getPlainTextFromHtml(option.text).length > 0 || draft.type === "Text",
      );

    if (cleanedOptions.length === 0) {
      toast.error("Please add at least one answer option.");
      return false;
    }

    const hasCorrect =
      draft.type === "Text"
        ? true
        : cleanedOptions.some((option) => option.isCorrect);

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

  const handlePublishTest = async () => {
    if (questions.length === 0) {
      toast.error("Please add at least one question before publishing.");
      return;
    }

    const payload: CreateTestPayload = {
      title: basicInfo.title.trim(),
      totalCandidates: Number(basicInfo.candidates),
      totalSlots: Number(basicInfo.slots),
      totalQuestionSet: Number(basicInfo.questionSet),
      questionType: basicInfo.questionType,
      startTime: basicInfo.startTime,
      endTime: basicInfo.endTime,
      durationMinutes: Number(basicInfo.duration || 30),
      negativeMarking: "-0.25/wrong",
      questions: questions.map((question) => ({
        prompt: question.prompt,
        type: question.type,
        score: question.score,
        options: question.options.map((option) => ({
          text: option.text,
          isCorrect: option.isCorrect,
        })),
      })),
    };

    if (
      Number.isNaN(payload.totalCandidates) ||
      Number.isNaN(payload.totalSlots) ||
      Number.isNaN(payload.totalQuestionSet) ||
      Number.isNaN(payload.durationMinutes)
    ) {
      toast.error("Please provide valid numeric values in basic information.");
      return;
    }

    try {
      await createTestMutation.mutateAsync(payload);

      toast.success("Online test published successfully.");
      router.replace("/employer-dashboard");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to publish test.";
      toast.error(message);
    }
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
                    setQuestions((prev) =>
                      prev.filter((item) => item.id !== question.id),
                    )
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

              <Card className="gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
                <CardContent className="flex justify-end p-4">
                  <Button
                    type="button"
                    disabled={createTestMutation.isPending}
                    className="h-11 min-w-42 rounded-xl bg-linear-to-r from-(--akij-btn-start) to-(--akij-btn-end) text-base font-semibold text-white disabled:opacity-70"
                    onClick={handlePublishTest}
                  >
                    {createTestMutation.isPending
                      ? "Publishing..."
                      : "Publish Online Test"}
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
