"use client";

import OnlineTestsBoard from "@/components/common/online-tests/OnlineTestsBoard";
import { Button } from "@/components/ui/button";
import { useEmployeeTests } from "@/hooks/useEmployeeTests";
import { EmployerTestSummary } from "@/services/tests";
import Link from "next/link";
import { FiClock, FiFileText, FiUsers } from "react-icons/fi";

const formatInfo = (value: number | null) => {
  if (value === null) {
    return "Not Set";
  }

  return value.toLocaleString();
};

export default function EmployerDashboard() {
  const { data, isLoading } = useEmployeeTests();

  return (
    <OnlineTestsBoard<EmployerTestSummary>
      heading="Online Tests"
      tests={data ?? []}
      isLoading={isLoading}
      headerAction={
        <Button
          asChild
          className="h-10 rounded-lg bg-linear-to-r from-(--akij-btn-start) to-(--akij-btn-end) px-5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(88,64,248,0.35)] transition hover:brightness-105"
        >
          <Link href="/employer-dashboard/create-online-test">
            Create Online Test
          </Link>
        </Button>
      }
      getMetrics={(test) => [
        {
          icon: <FiUsers className="size-4" />,
          label: "Candidates",
          value: formatInfo(test.candidates),
        },
        {
          icon: <FiFileText className="size-4" />,
          label: "Question Set",
          value: formatInfo(test.questionSet),
        },
        {
          icon: <FiClock className="size-4" />,
          label: "Exam Slots",
          value: formatInfo(test.examSlots),
        },
      ]}
      renderAction={() => (
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-lg border-(--akij-btn-start) px-5 text-sm font-semibold text-(--akij-btn-start) hover:bg-(--akij-btn-start)/8"
        >
          View Candidates
        </Button>
      )}
    />
  );
}
