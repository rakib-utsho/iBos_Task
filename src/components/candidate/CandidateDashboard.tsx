"use client";

import OnlineTestsBoard from "@/components/common/online-tests/OnlineTestsBoard";
import { Button } from "@/components/ui/button";
import { useCandidateTests } from "@/hooks/useCandidateTests";
import { TestSummary } from "@/types/exam";
import Link from "next/link";
import { FiClock, FiFileText, FiXCircle } from "react-icons/fi";

export default function CandidateDashboard() {
  const { data, isLoading } = useCandidateTests();

  return (
    <OnlineTestsBoard<TestSummary>
      heading="Online Tests"
      tests={data ?? []}
      isLoading={isLoading}
      getMetrics={(test) => [
        {
          icon: <FiClock className="size-4" />,
          label: "Duration",
          value: `${test.durationMinutes} min`,
        },
        {
          icon: <FiFileText className="size-4" />,
          label: "Question",
          value: String(test.questionCount),
        },
        {
          icon: <FiXCircle className="size-4" />,
          label: "Negative Marking",
          value: test.negativeMarking,
        },
      ]}
      renderAction={(test) => (
        <Button
          asChild
          type="button"
          variant="outline"
          className="h-9 rounded-lg border-(--akij-btn-start) px-8 text-sm font-semibold text-(--akij-btn-start) hover:bg-(--akij-btn-start)/8"
        >
          <Link href={`/candidate-dashboard/exam?testId=${test.id}`}>
            Start
          </Link>
        </Button>
      )}
    />
  );
}
