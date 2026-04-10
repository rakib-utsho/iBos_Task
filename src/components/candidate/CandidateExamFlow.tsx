"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CandidateAnswerPayload, CandidateTestDetail } from "@/types/exam";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { toast } from "sonner";

const toolbarItems = [
  { label: "Undo", command: "undo" },
  { label: "Redo", command: "redo" },
  { label: "B", command: "bold" },
  { label: "I", command: "italic" },
  { label: "U", command: "underline" },
  { label: "•", command: "insertUnorderedList" },
  { label: "1.", command: "insertOrderedList" },
  { label: "Left", command: "justifyLeft" },
  { label: "Center", command: "justifyCenter" },
  { label: "Right", command: "justifyRight" },
  { label: "Justify", command: "justifyFull" },
];

const sanitizeHtml = (html: string) => {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+=\"[^\"]*\"/gi, "")
    .replace(/on\w+='[^']*'/gi, "");
};

function RichTextAnswer({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const runCommand = (command: string) => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.focus();
    document.execCommand(command, false);
    onChange(editorRef.current.innerHTML);
  };

  const empty = useMemo(() => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = value;
    return (wrapper.textContent || "").trim().length === 0;
  }, [value]);

  return (
    <div className="rounded-lg border border-(--akij-border)">
      <div className="flex flex-wrap items-center gap-1 border-b border-(--akij-border) px-3 py-2">
        {toolbarItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => runCommand(item.command)}
            className="rounded-md px-2 py-1 text-xs font-semibold text-(--akij-heading) transition hover:bg-[#f3f4f6]"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="relative">
        {empty && (
          <p className="pointer-events-none absolute left-3 top-3 text-sm text-(--akij-subtext)">
            Type answer here..
          </p>
        )}
        <div
          ref={editorRef}
          role="textbox"
          aria-label="Answer text editor"
          aria-multiline="true"
          contentEditable
          suppressContentEditableWarning
          className="min-h-36 px-3 py-2 text-sm text-(--akij-text) outline-none [&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc"
          onInput={(event) => onChange(event.currentTarget.innerHTML)}
        />
      </div>
    </div>
  );
}

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} left`;
}

export default function CandidateExamFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const testId = searchParams.get("testId") ?? "";

  const [test, setTest] = useState<CandidateTestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<CandidateAnswerPayload>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const currentQuestion = test?.questions[currentIndex];

  useEffect(() => {
    const loadTest = async () => {
      if (!testId) {
        toast.error("Test id missing.");
        router.replace("/candidate-dashboard");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/candidate/tests/${testId}`, {
          method: "GET",
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || "Failed to load exam.");
        }

        setTest(result.test);
        setSecondsLeft((result.test?.durationMinutes ?? 20) * 60);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load exam.";
        toast.error(message);
        router.replace("/candidate-dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadTest();
  }, [router, testId]);

  useEffect(() => {
    if (!test || isTimedOut || isCompleted || isSubmitting) {
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setIsTimedOut(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isCompleted, isSubmitting, isTimedOut, test]);

  const submitExam = async (timedOut: boolean) => {
    if (!test || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/candidate/tests/${test.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers, timedOut }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Failed to submit exam.");
      }

      setFinalScore(result.obtainedScore ?? 0);

      if (timedOut) {
        return;
      }

      setIsCompleted(true);
      toast.success("Exam submitted successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit exam.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isTimedOut || isCompleted) {
      return;
    }

    submitExam(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimedOut]);

  const saveAndGoNext = async () => {
    if (!test) {
      return;
    }

    if (currentIndex === test.questions.length - 1) {
      await submitExam(false);
      return;
    }

    setCurrentIndex((index) => index + 1);
  };

  const skipQuestion = async () => {
    if (!test) {
      return;
    }

    if (currentIndex === test.questions.length - 1) {
      await submitExam(false);
      return;
    }

    setCurrentIndex((index) => index + 1);
  };

  if (isLoading) {
    return (
      <section className="mx-auto min-h-[calc(100vh-7rem)] w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
          <CardContent className="px-6 py-12 text-center text-sm text-(--akij-subtext)">
            Loading exam...
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!test || !currentQuestion) {
    return null;
  }

  if (isCompleted) {
    return (
      <section className="mx-auto min-h-[calc(100vh-7rem)] w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center sm:p-14">
            <FiCheckCircle className="mb-3 size-12 text-[#1f9ae8]" />
            <h2 className="text-3xl font-semibold text-(--akij-heading)">
              Test Completed
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-(--akij-subtext)">
              Congratulations! You have completed your exam. Thank you for
              participating.
            </p>
            {finalScore !== null && (
              <p className="mt-2 text-sm font-semibold text-(--akij-heading)">
                Your Score: {finalScore}
              </p>
            )}
            <Button
              asChild
              type="button"
              variant="outline"
              className="mt-6 h-10 rounded-lg border-(--akij-border) px-6 text-sm font-semibold text-(--akij-heading)"
            >
              <Link href="/candidate-dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto min-h-[calc(100vh-7rem)] w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <Card className="gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
          <CardContent className="flex items-center justify-between p-3 sm:p-4">
            <h3 className="text-2xl font-semibold text-(--akij-heading)">
              Question ({currentIndex + 1}/{test.questions.length})
            </h3>
            <div className="flex h-11 min-w-35 items-center justify-center rounded-xl bg-[#f3f5f8] px-4 text-lg font-semibold text-(--akij-heading)">
              {formatSeconds(secondsLeft)}
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
          <CardContent className="space-y-5 p-3 sm:p-4">
            <div
              className="text-2xl font-semibold text-(--akij-heading) [&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc"
              dangerouslySetInnerHTML={{
                __html: `Q${currentIndex + 1}. ${currentQuestion.prompt}`,
              }}
            />

            {currentQuestion.type === "Radio" && (
              <div className="space-y-2">
                {currentQuestion.options?.map((option) => {
                  const selected =
                    answers[currentQuestion.id]?.radio === option.id;

                  return (
                    <label
                      key={option.id}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-(--akij-border) px-3 py-2 text-sm text-(--akij-heading)"
                    >
                      <input
                        type="radio"
                        aria-label="Select option"
                        checked={selected}
                        onChange={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [currentQuestion.id]: {
                              ...prev[currentQuestion.id],
                              radio: option.id,
                            },
                          }))
                        }
                      />
                      <div
                        className="[&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc"
                        dangerouslySetInnerHTML={{ __html: option.text }}
                      />
                    </label>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "Checkbox" && (
              <div className="space-y-2">
                {currentQuestion.options?.map((option) => {
                  const selected =
                    answers[currentQuestion.id]?.checkbox?.includes(
                      option.id,
                    ) ?? false;

                  return (
                    <label
                      key={option.id}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-(--akij-border) px-3 py-2 text-sm text-(--akij-heading)"
                    >
                      <input
                        type="checkbox"
                        aria-label="Select option"
                        checked={selected}
                        onChange={(event) => {
                          setAnswers((prev) => {
                            const currentSelections =
                              prev[currentQuestion.id]?.checkbox ?? [];
                            const nextSelections = event.target.checked
                              ? [...currentSelections, option.id]
                              : currentSelections.filter(
                                  (item) => item !== option.id,
                                );

                            return {
                              ...prev,
                              [currentQuestion.id]: {
                                ...prev[currentQuestion.id],
                                checkbox: nextSelections,
                              },
                            };
                          });
                        }}
                      />
                      <div
                        className="[&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc"
                        dangerouslySetInnerHTML={{ __html: option.text }}
                      />
                    </label>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "Text" && (
              <RichTextAnswer
                value={answers[currentQuestion.id]?.text ?? ""}
                onChange={(value) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id]: {
                      ...prev[currentQuestion.id],
                      text: sanitizeHtml(value),
                    },
                  }))
                }
              />
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-(--akij-border) bg-white px-4 text-sm font-semibold text-(--akij-heading)"
                onClick={skipQuestion}
                disabled={isSubmitting}
              >
                Skip this Question
              </Button>
              <Button
                type="button"
                className="h-11 rounded-xl bg-linear-to-r from-(--akij-btn-start) to-(--akij-btn-end) px-6 text-sm font-semibold text-white"
                onClick={saveAndGoNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Save & Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {isTimedOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <Card className="w-full max-w-2xl gap-0 rounded-2xl border border-(--akij-border) bg-white py-0">
            <CardContent className="flex flex-col items-center justify-center p-10 text-center sm:p-12">
              <div className="mb-3 rounded-full bg-[#eef3f8] p-2 text-[#2f5f7b]">
                <FiClock className="size-7" />
                <FiXCircle className="-mt-2 ml-4 size-5 text-[#f25b71]" />
              </div>
              <h3 className="text-3xl font-semibold text-(--akij-heading)">
                Timeout!
              </h3>
              <p className="mt-2 max-w-xl text-sm text-(--akij-subtext)">
                Dear candidate, your exam time has been finished. Thank you for
                participating.
              </p>
              {finalScore !== null && (
                <p className="mt-2 text-sm font-semibold text-(--akij-heading)">
                  Your Score: {finalScore}
                </p>
              )}
              <Button
                asChild
                type="button"
                variant="outline"
                className="mt-6 h-10 rounded-lg border-(--akij-border) px-6 text-sm font-semibold text-(--akij-heading)"
              >
                <Link href="/candidate-dashboard">Back to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
