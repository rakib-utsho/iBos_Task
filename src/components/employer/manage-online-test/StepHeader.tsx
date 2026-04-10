"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { FiCheck } from "react-icons/fi";
import { Step } from "./types";

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

export default function StepHeader({ step }: { step: Step }) {
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
