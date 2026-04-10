"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FiClock, FiFileText, FiSearch, FiXCircle } from "react-icons/fi";

type CandidateTest = {
  id: string;
  title: string;
  durationMinutes: number;
  questionCount: number;
  negativeMarking: string;
};

const TESTS: CandidateTest[] = [
  {
    id: "ct-1",
    title: "Psychometric Test for Management Trainee Officer",
    durationMinutes: 30,
    questionCount: 20,
    negativeMarking: "-0.25/wrong",
  },
  {
    id: "ct-2",
    title: "Psychometric Test for Management Trainee Officer",
    durationMinutes: 30,
    questionCount: 20,
    negativeMarking: "-0.25/wrong",
  },
  {
    id: "ct-3",
    title: "Psychometric Test for Management Trainee Officer",
    durationMinutes: 30,
    questionCount: 20,
    negativeMarking: "-0.25/wrong",
  },
  {
    id: "ct-4",
    title: "Psychometric Test for Management Trainee Officer",
    durationMinutes: 30,
    questionCount: 20,
    negativeMarking: "-0.25/wrong",
  },
];

function CandidateTestCard({ test }: { test: CandidateTest }) {
  return (
    <Card className="gap-0 rounded-xl border border-(--akij-border) bg-white py-0 shadow-none">
      <CardContent className="space-y-4 p-5">
        <h3 className="text-lg font-semibold leading-snug text-(--akij-heading)">{test.title}</h3>

        <div className="grid grid-cols-1 gap-2 text-sm text-(--akij-subtext) sm:grid-cols-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <FiClock className="size-4" />
            <span>Duration: {test.durationMinutes} min</span>
          </div>
          <div className="flex items-center gap-2">
            <FiFileText className="size-4" />
            <span>Question: {test.questionCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiXCircle className="size-4" />
            <span>Negative Marking: {test.negativeMarking}</span>
          </div>
        </div>

        <Button
          asChild
          type="button"
          variant="outline"
          className="h-9 rounded-lg border-(--akij-btn-start) px-8 text-sm font-semibold text-(--akij-btn-start) hover:bg-(--akij-btn-start)/8"
        >
          <Link href={`/candidate-dashboard/exam?testId=${test.id}`}>Start</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

const PAGE_SIZE_OPTIONS = [4, 8, 12];

export default function CandidateDashboard() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const filteredTests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return TESTS;
    }

    return TESTS.filter((test) => test.title.toLowerCase().includes(normalizedQuery));
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filteredTests.length / pageSize));

  const pagedTests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTests.slice(start, start + pageSize);
  }, [currentPage, filteredTests, pageSize]);

  return (
    <section className="mx-auto min-h-[calc(100vh-7rem)] w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full rounded-2xl border border-(--akij-border) bg-white/85 p-5 shadow-[0_14px_40px_rgba(28,39,64,0.08)] backdrop-blur-sm sm:p-6 lg:p-7">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-(--akij-heading)">Online Tests</h2>

          <label className="relative w-full min-w-0 md:w-auto md:min-w-100" htmlFor="candidate-test-search">
            <FiSearch className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-(--akij-subtext)" />
            <input
              id="candidate-test-search"
              type="text"
              placeholder="Search by exam title"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-lg border border-(--akij-border) bg-white px-3 pr-10 text-sm text-(--akij-text) outline-none transition focus:border-(--akij-btn-start) focus:ring-2 focus:ring-(--akij-btn-start)/25"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {pagedTests.map((test) => (
            <CandidateTestCard key={test.id} test={test} />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-(--akij-border) pt-4 text-sm text-(--akij-subtext)">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="h-8 px-2 text-(--akij-text)"
            >
              &lt;
            </Button>
            <span className="px-2 text-(--akij-text)">{currentPage}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-2 text-(--akij-text)"
            >
              &gt;
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="candidate-page-size">Online Test Per Page</label>
            <select
              id="candidate-page-size"
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="h-8 rounded-md border border-(--akij-border) bg-white px-2 text-(--akij-text) outline-none focus:border-(--akij-btn-start)"
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
