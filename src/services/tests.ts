import http from "@/lib/api/http";
import { CandidateAnswerPayload, CandidateTestDetail, CreateTestPayload, TestSummary } from "@/types/exam";

export type EmployerTestSummary = {
  id: string;
  title: string;
  candidates: number | null;
  questionSet: number | null;
  examSlots: number | null;
  questionCount?: number;
};

export const fetchEmployeeTests = async (): Promise<EmployerTestSummary[]> => {
  const { data } = await http.get<{ tests: EmployerTestSummary[] }>("/api/employee/tests");
  return data.tests ?? [];
};

export const createEmployeeTest = async (payload: CreateTestPayload) => {
  const { data } = await http.post<{ success: boolean; testId: string }>("/api/employee/tests", payload);
  return data;
};

export const fetchCandidateTests = async (): Promise<TestSummary[]> => {
  const { data } = await http.get<{ tests: TestSummary[] }>("/api/candidate/tests");
  return data.tests ?? [];
};

export const fetchCandidateTestById = async (testId: string): Promise<CandidateTestDetail> => {
  const { data } = await http.get<{ test: CandidateTestDetail }>(`/api/candidate/tests/${testId}`);
  return data.test;
};

export const submitCandidateTest = async (testId: string, payload: { answers: CandidateAnswerPayload; timedOut?: boolean }) => {
  const { data } = await http.post<{ success: boolean; attemptId: string; obtainedScore: number }>(
    `/api/candidate/tests/${testId}/submit`,
    payload,
  );
  return data;
};
