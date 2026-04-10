"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { FiAlertCircle, FiSearch } from "react-icons/fi";

type CardMetric = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

type BaseTest = {
  id: string;
  title: string;
};

type OnlineTestsBoardProps<T extends BaseTest> = {
  heading: string;
  tests: T[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  getMetrics: (test: T) => CardMetric[];
  renderAction: (test: T) => React.ReactNode;
  headerAction?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
};

const PAGE_SIZE_OPTIONS = [4, 8, 12];

export default function OnlineTestsBoard<T extends BaseTest>({
  heading,
  tests,
  isLoading = false,
  searchPlaceholder = "Search by exam title",
  getMetrics,
  renderAction,
  headerAction,
  emptyTitle = "No Online Test Available",
  emptyDescription = "Currently, there are no online tests available. Please check back later for updates.",
}: OnlineTestsBoardProps<T>) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const filteredTests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return tests;
    }

    return tests.filter((test) => test.title.toLowerCase().includes(normalizedQuery));
  }, [query, tests]);

  const totalPages = Math.max(1, Math.ceil(filteredTests.length / pageSize));

  const pagedTests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTests.slice(start, start + pageSize);
  }, [currentPage, filteredTests, pageSize]);

  const isEmpty = !isLoading && pagedTests.length === 0;

  return (
    <section className="mx-auto min-h-[calc(100vh-7rem)] w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full rounded-2xl border border-(--akij-border) bg-white/85 p-5 shadow-[0_14px_40px_rgba(28,39,64,0.08)] backdrop-blur-sm sm:p-6 lg:p-7">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-(--akij-heading)">{heading}</h2>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <label className="relative w-full min-w-0 sm:min-w-90" htmlFor="tests-search">
              <FiSearch className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-(--akij-subtext)" />
              <input
                id="tests-search"
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-lg border border-(--akij-border) bg-white px-3 pr-10 text-sm text-(--akij-text) outline-none transition focus:border-(--akij-btn-start) focus:ring-2 focus:ring-(--akij-btn-start)/25"
              />
            </label>

            {headerAction}
          </div>
        </div>

        {isLoading ? (
          <Card className="gap-0 rounded-xl border border-(--akij-border) bg-white py-0 shadow-none">
            <CardContent className="px-6 py-12 text-center text-sm text-(--akij-subtext)">
              Loading tests...
            </CardContent>
          </Card>
        ) : null}

        {isEmpty ? (
          <Card className="gap-0 rounded-xl border border-(--akij-border) bg-white py-0 shadow-none">
            <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center sm:py-16">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-(--akij-btn-start)/10 text-(--akij-btn-start)">
                <FiAlertCircle className="size-8" />
              </div>

              <h3 className="text-2xl font-semibold text-(--akij-heading)">{emptyTitle}</h3>
              <p className="mt-2 max-w-2xl text-sm text-(--akij-subtext)">{emptyDescription}</p>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !isEmpty ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {pagedTests.map((test) => (
              <Card key={test.id} className="gap-0 rounded-xl border border-(--akij-border) bg-white py-0 shadow-none">
                <CardContent className="space-y-4 p-5">
                  <h3 className="text-lg font-semibold leading-snug text-(--akij-heading)">{test.title}</h3>

                  <div className="grid grid-cols-1 gap-2 text-sm text-(--akij-subtext) sm:grid-cols-3 sm:gap-4">
                    {getMetrics(test).map((metric) => (
                      <div key={`${test.id}-${metric.label}`} className="flex items-center gap-2">
                        {metric.icon}
                        <span>
                          {metric.label}: {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {renderAction(test)}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {!isLoading && !isEmpty ? (
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
        ) : null}
      </div>
    </section>
  );
}
