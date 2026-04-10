"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FiAlertCircle, FiClock, FiFileText, FiSearch, FiUsers } from "react-icons/fi";

type OnlineTest = {
  id: string;
  title: string;
  candidates: number | null;
  questionSet: number | null;
  examSlots: number | null;
};

const ONLINE_TESTS: OnlineTest[] = [
  {
    id: "ot-1",
    title: "Psychometric Test for Management Trainee Officer",
    candidates: 10000,
    questionSet: 3,
    examSlots: 3,
  },
  {
    id: "ot-2",
    title: "Psychometric Test for Management Trainee Officer",
    candidates: 10000,
    questionSet: 3,
    examSlots: 3,
  },
  {
    id: "ot-3",
    title: "Psychometric Test for Management Trainee Officer",
    candidates: null,
    questionSet: null,
    examSlots: null,
  },
  {
    id: "ot-4",
    title: "Psychometric Test for Management Trainee Officer",
    candidates: 10000,
    questionSet: 3,
    examSlots: 3,
  },
];

const formatInfo = (value: number | null) => {
  if (value === null) {
    return "Not Set";
  }

  return value.toLocaleString();
};

function OnlineTestCard({ test }: { test: OnlineTest }) {
  return (
    <Card className="gap-0 rounded-xl border border-(--akij-border) bg-white py-0 shadow-none">
      <CardContent className="space-y-4 p-5">
        <h3 className="text-lg font-semibold leading-snug text-(--akij-heading)">
          {test.title}
        </h3>

        <div className="grid grid-cols-1 gap-2 text-sm text-(--akij-subtext) sm:grid-cols-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <FiUsers className="size-4" />
            <span>Candidates: {formatInfo(test.candidates)}</span>
          </div>

          <div className="flex items-center gap-2">
            <FiFileText className="size-4" />
            <span>Question Set: {formatInfo(test.questionSet)}</span>
          </div>

          <div className="flex items-center gap-2">
            <FiClock className="size-4" />
            <span>Exam Slots: {formatInfo(test.examSlots)}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-lg border-(--akij-btn-start) px-5 text-sm font-semibold text-(--akij-btn-start) hover:bg-(--akij-btn-start)/8"
        >
          View Candidates
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="gap-0 rounded-xl border border-(--akij-border) bg-white py-0 shadow-none">
      <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center sm:py-16">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-(--akij-btn-start)/10 text-(--akij-btn-start)">
          <FiAlertCircle className="size-8" />
        </div>

        <h3 className="text-2xl font-semibold text-(--akij-heading)">
          No Online Test Available
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-(--akij-subtext)">
          Currently, there are no online tests available. Please check back later for updates.
        </p>
      </CardContent>
    </Card>
  );
}

const PAGE_SIZE_OPTIONS = [4, 8, 12];

export default function EmployerDashboard() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const filteredTests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return ONLINE_TESTS;
    }

    return ONLINE_TESTS.filter((test) =>
      test.title.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filteredTests.length / pageSize));

  const pagedTests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTests.slice(start, start + pageSize);
  }, [currentPage, pageSize, filteredTests]);

  const isEmpty = pagedTests.length === 0;

  const handleSearch = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setCurrentPage(nextPage);
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-[calc(100vh-7rem)]">
      <div className="w-full rounded-2xl border border-(--akij-border) bg-white/85 p-5 shadow-[0_14px_40px_rgba(28,39,64,0.08)] backdrop-blur-sm sm:p-6 lg:p-7">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-(--akij-heading)">
            Online Tests
          </h2>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <label className="relative w-full min-w-0 sm:min-w-90" htmlFor="test-search">
              <FiSearch className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-(--akij-subtext)" />
              <input
                id="test-search"
                type="text"
                value={query}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search by exam title"
                className="h-10 w-full rounded-lg border border-(--akij-border) bg-white px-3 pr-10 text-sm text-(--akij-text) outline-none transition focus:border-(--akij-btn-start) focus:ring-2 focus:ring-(--akij-btn-start)/25"
              />
            </label>

            <Button
              asChild
              className="h-10 rounded-lg bg-linear-to-r from-(--akij-btn-start) to-(--akij-btn-end) px-5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(88,64,248,0.35)] transition hover:brightness-105"
            >
              <Link href="/employer-dashboard/create-online-test">Create Online Test</Link>
            </Button>
          </div>
        </div>

        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {pagedTests.map((test) => (
              <OnlineTestCard key={test.id} test={test} />
            ))}
          </div>
        )}

        {!isEmpty && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-(--akij-border) pt-4 text-sm text-(--akij-subtext)">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 px-2 text-(--akij-text)"
              >
                &gt;
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="page-size">Online Test Per Page</label>
              <select
                id="page-size"
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
        )}
      </div>
    </section>
  );
}