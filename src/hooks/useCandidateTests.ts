"use client";

import { fetchCandidateTests } from "@/services/tests";
import { useQuery } from "@tanstack/react-query";

export const useCandidateTests = () => {
  return useQuery({
    queryKey: ["candidate-tests"],
    queryFn: fetchCandidateTests,
  });
};
