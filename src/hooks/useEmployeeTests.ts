"use client";

import { fetchEmployeeTests } from "@/services/tests";
import { useQuery } from "@tanstack/react-query";

export const useEmployeeTests = () => {
  return useQuery({
    queryKey: ["employee-tests"],
    queryFn: fetchEmployeeTests,
  });
};
